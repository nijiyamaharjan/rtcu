import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

export const TeamMembers = ({ projectID }) => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [expertiseList, setExpertiseList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingMemberID, setEditingMemberID] = useState(null);
    const [memberData, setMemberData] = useState({
        memberID: "",
        name: "",
        roleid: "",
        expertiseid: "",
        contactInfo: "",
    });

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/project/${projectID}/team/all`
                );
                const data = await response.json();
                if (response.ok) {
                    setTeamMembers(data);
                }
            } catch (error) {
                console.error("Error fetching team members:", error);
            }
        };

        const fetchRolesAndExpertise = async () => {
            try {
                const rolesResponse = await fetch("http://localhost:5000/role");
                const expertiseResponse = await fetch(
                    "http://localhost:5000/expertise"
                );
                const rolesData = await rolesResponse.json();
                const expertiseData = await expertiseResponse.json();
                setRoles(rolesData);
                setExpertiseList(expertiseData);
            } catch (error) {
                console.error("Error fetching roles or expertise:", error);
            }
        };

        fetchTeamMembers();
        fetchRolesAndExpertise();
    }, [projectID, memberData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMemberData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddOrEditMember = async () => {
        try {
            const url = isEditing
                ? `http://localhost:5000/project/${projectID}/team/${editingMemberID}`
                : `http://localhost:5000/project/${projectID}/team/add`;

            const method = isEditing ? "PUT" : "POST";

            console.log("Sending data:", memberData); // Log the memberData

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(memberData),
            });

            if (response.ok) {
                const updatedMember = await response.json();
                setTeamMembers((prevMembers) =>
                    isEditing
                        ? prevMembers.map((m) =>
                              m.memberid === editingMemberID ? updatedMember : m
                          )
                        : [...prevMembers, updatedMember]
                );
                setMemberData({
                    memberID: "",
                    name: "",
                    roleid: "",
                    expertiseid: "",
                    contactInfo: "",
                });
                setIsModalOpen(false);
                setIsEditing(false);
            } else {
                console.error("Error saving member data");
            }
        } catch (error) {
            console.error("Error during save:", error);
        }
    };

    const handleEditMember = (member) => {
        setMemberData({
            memberID: member.memberid,
            name: member.name,
            roleid: member.roleid,
            expertiseid: member.expertiseid,
            contactInfo: member.contactinfo,
        });
        setEditingMemberID(member.memberid);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDeleteMember = async (memberID) => {
      try {
        const response = await fetch(`http://localhost:5000/project/${projectID}/team/${memberID}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          setTeamMembers((prevMembers) => prevMembers.filter((m) => m.memberid !== memberID));
        } else {
          console.error("Error deleting member");
        }
      } catch (error) {
        console.error("Error during deletion:", error);
      }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Team Members</h2>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setIsEditing(false);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                >
                    <FaPlus className="mr-2" /> Add Member
                </button>
            </div>
            <table className="w-full text-sm border">
                <thead className="border-b">
                    <tr>
                        {[
                            "ID",
                            "Name",
                            "Role",
                            "Expertise",
                            "Contact Info",
                            "Actions",
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
                            <td colSpan={6} className="text-center py-4">
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
                                    {member.rolename}
                                </td>
                                <td className="py-2 px-2 text-gray-600 border-r">
                                    {member.expertisename}
                                </td>
                                <td className="py-2 px-2 text-gray-600 border-r">
                                    {member.contactinfo}
                                </td>
                                <td className="py-2 px-2 flex space-x-2">
                                    <button
                                        onClick={() => handleEditMember(member)}
                                        className="text-gray-500 hover:text-blue-500"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button className="text-gray-500 hover:text-red-500"
                                     onClick={() => handleDeleteMember(member.memberid)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3 className="text-lg font-semibold mb-4">
                    {isEditing ? "Edit Member" : "Add New Member"}
                </h3>
                <input
                    type="text"
                    name="memberID"
                    placeholder="Member ID"
                    value={memberData.memberID}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border rounded"
                    disabled={isEditing}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={memberData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border rounded"
                />
                <select
                    name="roleid"
                    value={memberData.roleid}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border rounded"
                >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                        <option key={role.roleid} value={role.roleid}>
                            {role.rolename}
                        </option>
                    ))}
                </select>
                <select
                    name="expertiseid"
                    value={memberData.expertiseid}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border rounded"
                >
                    <option value="">Select Expertise</option>
                    {expertiseList.map((expertise) => (
                        <option
                            key={expertise.expertiseid}
                            value={expertise.expertiseid}
                        >
                            {expertise.expertisename}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="contactInfo"
                    placeholder="Contact Info"
                    value={memberData.contactInfo}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border rounded"
                />
                <button
                    onClick={handleAddOrEditMember}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {isEditing ? "Update" : "Add"}
                </button>
            </Modal>
        </div>
    );
};
