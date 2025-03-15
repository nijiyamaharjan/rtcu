// TeamMembersList.jsx
import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const TeamMembersList = ({ 
    teamMembers, 
    roles, 
    user, 
    handleDeleteMember, 
    handleUpdateRole 
}) => {
    const [editingRole, setEditingRole] = useState(null);
    const [roleid, setRoleID] = useState("");

    const onSaveRole = (memberId) => {
        handleUpdateRole(memberId, roleid);
        setEditingRole(null);
        setRoleID("");
    };

    return (
        <>
            <h3 className="text-xl font-semibold my-4">Project Team Members</h3>
            <table className="w-full text-sm border">
                <thead className="border-b">
                    <tr>
                        {[
                            "ID",
                            "Name",
                            "Project Role",
                            "Expertise",
                            "Contact Info",
                            ...(user ? ["Actions"] : [])
                        ].map((header) => (
                            <th
                                key={header}
                                className="text-left py-2 px-2 text-gray-700 border-r"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {teamMembers.length === 0 ? (
                        <tr>
                            <td colSpan={user ? 6 : 5} className="text-center py-4">
                                No team members found for this project.
                            </td>
                        </tr>
                    ) : (
                        teamMembers.map((member) => (
                            <tr key={member.memberid} className="border-b">
                                <td className="py-2 px-2 text-gray-600 border-r">
                                    {member.memberid}
                                </td>
                                <td className="py-2 px-2 text-gray-600 border-r">
                                    {member.name}
                                </td>
                                <td className="py-2 px-2 text-gray-600 border-r">
                                    {editingRole === member.memberid ? (
                                        <select
                                            value={roleid}
                                            onChange={(e) =>
                                                setRoleID(e.target.value)
                                            }
                                            className="p-2 border border-gray-300"
                                        >
                                            <option value="">
                                                Select Project Role
                                            </option>
                                            {roles.map((role) => (
                                                <option
                                                    key={role.roleid}
                                                    value={role.roleid}
                                                >
                                                    {role.rolename}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        member.rolename
                                    )}
                                </td>
                                <td className="py-2 px-2 text-gray-600 border-r">
                                    {member.expertisename}
                                </td>
                                <td className="py-2 px-2 text-gray-600 border-r">
                                    {member.contactinfo}
                                </td>
                                {user && (
                                    <td className="py-2 px-2 flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleDeleteMember(
                                                    member.memberid
                                                )
                                            }
                                            className="text-gray-500 hover:text-red-500"
                                        >
                                            <FaTrash />
                                        </button>
                                        {editingRole === member.memberid ? (
                                            <button
                                                onClick={() => onSaveRole(member.memberid)}
                                                className="ml-2 text-green-500"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingRole(member.memberid);
                                                    setRoleID(member.roleid);
                                                }}
                                                className="text-blue-500"
                                            >
                                                <FaEdit />
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    );
};

export default TeamMembersList;