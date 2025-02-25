import { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TeamMembers = ({ projectID }) => {
    const [allTeam, setAllTeam] = useState({
        students: [],
        experts: [],
        faculty: [],
    });
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [contactInfo, setContactInfo] = useState("");
    const [roleid, setRoleID] = useState("");
    const [roles, setRoles] = useState([]);
    const user = useAuth();
    const [editingRole, setEditingRole] = useState(null);

    // Fetch roles from API
    const fetchRoles = async () => {
        try {
            const response = await fetch("http://localhost:5000/role");
            const data = await response.json();
            setRoles(data);
        } catch (err) {
            console.error("Error fetching roles", err);
        }
    };

    const fetchProjectTeamMembers = async () => {
        try {
            const response = await fetch(`http://localhost:5000/project/${projectID}/team/all`);
            const data = await response.json();
            if (response.ok) {
                setTeamMembers(data); // Save project-specific team members
            }
        } catch (error) {
            console.error("Error fetching project team members:", error);
        }
    };
    // Fetch all available team members
    useEffect(() => {
        const fetchAllAvailable = async () => {
            try {
                const response = await fetch("http://localhost:5000/get-all-team");
                const data = await response.json();
                if (response.ok) {
                    setAllTeam({
                        students: data.students || [],
                        experts: data.experts || [],
                        faculty: data.faculty || [],
                    });
                }
            } catch (error) {
                console.error("Error fetching all available team members:", error);
            }
        };



        fetchAllAvailable();
        fetchRoles();
        fetchProjectTeamMembers();
    }, [projectID, roles]);

    // Add team member
    const handleAddTeamMember = async () => {
        if (!selectedMember || !roleid) {
            return;
        }

        try {
            const newTeamMember = {
                projectID: projectID,
                memberid: selectedMember.studentid || selectedMember.expertid || selectedMember.facultyid,
                name: selectedMember.name,
                roleid: roleid, 
                expertiseid: selectedMember.expertiseid,
                contactInfo: selectedMember.contactinfo,
            };

            const response = await fetch(`http://localhost:5000/project/${projectID}/team/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTeamMember),
            });

            if (response.ok) {
                setSelectedMember(null);
                setContactInfo("");
                setRoleID("");
                fetchProjectTeamMembers(); // Refresh the project members list
            }
        } catch (error) {
            console.error("Error adding team member:", error);
        }
    };

    // Delete team member
    const handleDeleteMember = async (memberID) => {
        try {
            const response = await fetch(`http://localhost:5000/project/${projectID}/team/${memberID}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setTeamMembers((prevMembers) => prevMembers.filter((m) => m.memberid !== memberID)); // Remove member from state
            } else {
                console.error("Error deleting member");
            }
        } catch (error) {
            console.error("Error during deletion:", error);
        }
    };

    const handleAddRole = async () => {
        const newRole = prompt("Enter new role name");
        if (newRole) {
            const response = await fetch("http://localhost:5000/role", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rolename: newRole }),
            });

            if (response.ok) {
                const addedRole = await response.json();
                setRoles((prevRoles) => [...prevRoles, addedRole]);
            } else {
                toast.error("Failed to add role");
            }
        }
    };

    const handleDeleteRole = async (roleID) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this role?"
        );
        if (confirmDelete) {
            const response = await fetch(
                `http://localhost:5000/role/${roleID}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setRoles(roles.filter((item) => item.roleid !== roleID));
            } else {
                toast.error("Failed to delete role");
            }
        }
    };

    // Update team member role
    const handleUpdateRole = async () => {
        if (!editingRole || !roleid) return;
    
        try {
            const response = await fetch(`http://localhost:5000/project/${projectID}/team/${editingRole}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roleid: roleid }),
            });
    
            if (response.ok) {
                const updatedRole = roles.find((role) => role.roleid === roleid);
                if (updatedRole) {
                    setTeamMembers((prevMembers) =>
                        prevMembers.map((member) =>
                            member.memberid === editingRole
                                ? { ...member, rolename: updatedRole.rolename }
                                : member
                        )
                    );
                } else {
                    console.error("Role not found");
                }
    
                setEditingRole(null);
                setRoleID("");
            } else {
                console.error("Failed to update role");
            }
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };
    

    return (
        <div className="team-member-selector">
            {user && <>
                <h3 className="text-2xl font-semibold mb-4">Add Team Member</h3>
            <div className="flex items-center space-x-4">

                <div className="flex-1">
                    <label htmlFor="member" className="block text-sm font-medium text-gray-700">Select Member</label>
                    <select
                        id="member"
                        onChange={(e) => {
                            const [type, index] = e.target.value.split("-");
                            setSelectedMember(allTeam[type][index]);
                        }}
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select</option>
                        {["students", "experts", "faculty"].map((type) => (
                            <optgroup
                                key={type}
                                label={type.charAt(0).toUpperCase() + type.slice(1)}
                                className="text-gray-700"
                            >
                                {allTeam[type].map((member, index) => (
                                    <option
                                        key={member.studentid || member.expertid || member.facultyid}
                                        value={`${type}-${index}`}
                                    >
                                        {member.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <div className="flex-1">
                    <label
                        htmlFor="roleid"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Project Role
                    </label>
                    <select
                        id="roleid"
                        name="roleid"
                        value={roleid}
                        onChange={(e) => setRoleID(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Select Project Role</option>
                        {roles.map((role) => (
                            <option key={role.roleid} value={role.roleid}>
                                {role.rolename}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                        type="button"
                        onClick={handleAddRole}
                        className="mt-2 text-blue-600"
                    >
                        Add New Role
                    </button>

                {selectedMember && (
                    <div>
                        <button
                            onClick={handleAddTeamMember}
                            className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Add Team Member
                        </button>
                    </div>
                )}
            </div>
            </>}
            

            <h3 className="text-2xl font-semibold my-4">Project Team Members</h3>
            <table className="w-full text-sm border">
                <thead className="border-b">
                    <tr>
                        {["ID", "Name", "Project Role", "Expertise", "Contact Info"].map((header) => (
                            <th key={header} className="text-left py-2 px-2 text-gray-700 border-r">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {teamMembers.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-4">
                                No team members found for this project.
                            </td>
                        </tr>
                    ) : (
                        teamMembers.map((member) => (
                            <tr key={member.memberid} className="border-b">
                                <td className="py-2 px-2 text-gray-600 border-r">{member.memberid}</td>
                                <td className="py-2 px-2 text-gray-600 border-r">{member.name}</td>
                                <td className="py-2 px-2 text-gray-600 border-r">
                                    {editingRole === member.memberid ? (
                                        <select
                                            value={roleid}
                                            onChange={(e) => setRoleID(e.target.value)}
                                            className="p-2 border border-gray-300"
                                        >
                                            <option value="">Select Project Role</option>
                                            {roles.map((role) => (
                                                <option key={role.roleid} value={role.roleid}>
                                                    {role.rolename}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        member.rolename
                                    )}
                                </td>
                                <td className="py-2 px-2 text-gray-600 border-r">{member.expertisename}</td>
                                <td className="py-2 px-2 text-gray-600 border-r">{member.contactinfo}</td>
                                {user && <>
                                    <td className="py-2 px-2 flex space-x-2">
                                    <button
                                        onClick={() => handleDeleteMember(member.memberid)}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        <FaTrash />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingRole(member.memberid);
                                            setRoleID(member.roleid); // Set the role for editing
                                        }}
                                        className="text-blue-500"
                                    >
                                        <FaEdit />
                                    </button>
                                    {editingRole === member.memberid && (
                                        <button
                                            onClick={handleUpdateRole}
                                            className="ml-2 text-green-500"
                                        >
                                            Save
                                        </button>
                                    )}
                                </td>
                                </>}
                                
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
