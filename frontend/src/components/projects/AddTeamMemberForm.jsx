// AddTeamMemberForm.jsx
import { useState } from "react";
import AddTeamMemberButton from "./AddTeamMemberButton";
import { Link } from "react-router-dom";

const AddTeamMemberForm = ({
    allTeam,
    roles,
    projectID,
    fetchProjectTeamMembers,
    handleAddRole,
}) => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [roleid, setRoleID] = useState("");
    const [showAddMenu, setShowAddMenu] = useState(false);

    // Add team member
    const handleAddTeamMember = async () => {
        if (!selectedMember || !roleid) {
            return;
        }

        try {
            const newTeamMember = {
                projectID: projectID,
                memberid:
                    selectedMember.studentid ||
                    selectedMember.expertid ||
                    selectedMember.facultyid,
                name: selectedMember.name,
                roleid: roleid,
                expertiseid: selectedMember.expertiseid,
                contactInfo: selectedMember.contactinfo,
            };

            const response = await fetch(
                `http://localhost:5000/project/${projectID}/team/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newTeamMember),
                }
            );

            if (response.ok) {
                setSelectedMember(null);
                setRoleID("");
                fetchProjectTeamMembers(); // Refresh the project members list
            }
        } catch (error) {
            console.error("Error adding team member:", error);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="flex-1">
                <select
                    id="member"
                    onChange={(e) => {
                        const [type, index] = e.target.value.split("-");
                        setSelectedMember(allTeam[type][index]);
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                    <option value="">Select Member</option>
                    {["students", "experts", "faculty"].map((type) => (
                        <optgroup
                            key={type}
                            label={type.charAt(0).toUpperCase() + type.slice(1)}
                            className="text-gray-700"
                        >
                            {allTeam[type].map((member, index) => (
                                <option
                                    key={
                                        member.studentid ||
                                        member.expertid ||
                                        member.facultyid
                                    }
                                    value={`${type}-${index}`}
                                >
                                    {member.name}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>
            <AddTeamMemberButton
                showAddMenu={showAddMenu}
                setShowAddMenu={setShowAddMenu}
            />
            <div className="flex-1">
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
                className="inline-flex items-center rounded-md bg-blue-600 ml-4 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-1"
            >
                Add New Role
            </button>

            {selectedMember && (
                <div>
                    <button
                        onClick={handleAddTeamMember}
                        className="inline-flex items-center rounded-md bg-blue-600 ml-4 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-5"
                    >
                        Add Team Member
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddTeamMemberForm;
