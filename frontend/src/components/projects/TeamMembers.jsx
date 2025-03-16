// TeamMembers.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";
import AddTeamMemberForm from "./AddTeamMemberForm";
import TeamMembersList from "./TeamMembersList";
import AddTeamMemberButton from "./AddTeamMemberButton";

export const TeamMembers = ({ projectID }) => {
    const [allTeam, setAllTeam] = useState({
        students: [],
        experts: [],
        faculty: [],
    });
    const [teamMembers, setTeamMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const user = useAuth();

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
            const response = await fetch(
                `http://localhost:5000/project/${projectID}/team/all`
            );
            const data = await response.json();
            if (response.ok) {
                setTeamMembers(data);
            }
        } catch (error) {
            console.error("Error fetching project team members:", error);
        }
    };

    // Fetch all available team members
    useEffect(() => {
        const fetchAllAvailable = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/get-all-team"
                );
                const data = await response.json();
                if (response.ok) {
                    setAllTeam({
                        students: data.students || [],
                        experts: data.experts || [],
                        faculty: data.faculty || [],
                    });
                }
            } catch (error) {
                console.error(
                    "Error fetching all available team members:",
                    error
                );
            }
        };

        fetchAllAvailable();
        fetchRoles();
        fetchProjectTeamMembers();
    }, [projectID, roles]);

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

    // Delete team member
    const handleDeleteMember = async (memberID) => {
        try {
            const response = await fetch(
                `http://localhost:5000/project/${projectID}/team/${memberID}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setTeamMembers((prevMembers) =>
                    prevMembers.filter((m) => m.memberid !== memberID)
                );
            } else {
                console.error("Error deleting member");
            }
        } catch (error) {
            console.error("Error during deletion:", error);
        }
    };

    // Update team member role
    const handleUpdateRole = async (editingRole, roleid) => {
        if (!editingRole || !roleid) return;

        try {
            const response = await fetch(
                `http://localhost:5000/project/${projectID}/team/${editingRole}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ roleid: roleid }),
                }
            );

            if (response.ok) {
                const updatedRole = roles.find(
                    (role) => role.roleid === roleid
                );
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
            } else {
                console.error("Failed to update role");
            }
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    return (
        <div className="team-member-selector">
            {user && (
                <>
                    <AddTeamMemberForm
                        allTeam={allTeam}
                        roles={roles}
                        projectID={projectID}
                        fetchProjectTeamMembers={fetchProjectTeamMembers}
                        handleAddRole={handleAddRole}
                    />
                </>
            )}

            <TeamMembersList
                teamMembers={teamMembers}
                roles={roles}
                user={user}
                handleDeleteMember={handleDeleteMember}
                handleUpdateRole={handleUpdateRole}
            />
        </div>
    );
};
