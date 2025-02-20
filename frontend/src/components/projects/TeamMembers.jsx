import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

export const TeamMembers = ({ projectID }) => {
    const [allTeam, setAllTeam] = useState({
        students: [],
        experts: [],
        faculty: [],
    });
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [contactInfo, setContactInfo] = useState("");
    const [memberid, setMemberID] = useState("");

    // Fetch all team members based on the selected project
    useEffect(() => {
        const fetchAllAvailable = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get-all-team`);
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
        fetchProjectTeamMembers();
    }, [projectID]);
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
    const handleAddTeamMember = async () => {
        if (!selectedMember) {
            return;
        }

        try {
            const newTeamMember = {
                projectID: projectID,
                memberid: selectedMember.studentid || selectedMember.expertid || selectedMember.facultyid,
                trainingID: null, // If trainingID is required, you can pass it
                name: selectedMember.name,
                roleid: selectedMember.roleid, // Directly use the selected member's roleid
                expertiseid: selectedMember.expertiseid, // Directly use the selected member's expertiseid
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
                setMemberID("");
                fetchProjectTeamMembers(); // Refresh the project members list
            } else {
            }
        } catch (error) {
            console.error("Error adding team member:", error);
        }
    };

    const handleDeleteMember = async (memberID) => {
        try {
            const response = await fetch(`http://localhost:5000/project/${projectID}/team/${memberID}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setTeamMembers((prevMembers) => prevMembers.filter((m) => m.memberid !== memberID)); // Remove the member from the state
            } else {
                console.error("Error deleting member");
            }
        } catch (error) {
            console.error("Error during deletion:", error);
        }
    };

    return (
        <div className="team-member-selector">
            <h3 className="text-2xl font-semibold mb-4">Add Team Member</h3>
<div className="flex items-center space-x-4">
    <div className="flex-1">
        <label htmlFor="memberid" className="block text-sm font-medium text-gray-700">Member ID</label>
        <input
            id="memberid"
            type="text"
            value={memberid}
            onChange={(e) => setMemberID(e.target.value)}
            placeholder="Enter Member ID"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
    </div>

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

    {selectedMember && (
        <div className="flex-1">
            <button
                onClick={handleAddTeamMember}
                className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Add Team Member
            </button>
        </div>
    )}
</div>

            <h3 className="text-2xl font-semibold my-4">Project Team Members</h3>
            <table className="w-full text-sm border">
                <thead className="border-b">
                    <tr>
                        {["ID", "Name", "Role", "Expertise", "Contact Info", "Actions"].map((header) => (
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
                                <td className="py-2 px-2 text-gray-600 border-r">{member.rolename}</td>
                                <td className="py-2 px-2 text-gray-600 border-r">{member.expertisename}</td>
                                <td className="py-2 px-2 text-gray-600 border-r">{member.contactinfo}</td>
                                <td className="py-2 px-2 flex space-x-2">
                                    <button
                                        onClick={() => handleDeleteMember(member.memberid)}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
