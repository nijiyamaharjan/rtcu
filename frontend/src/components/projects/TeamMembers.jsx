import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export const TeamMembers = ({ projectID }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    role: "",
    expertise: "",
    contactinfo: "",
  });

  const [newMemberData, setNewMemberData] = useState({
    memberID: "",
    name: "",
    role: "",
    expertise: "",
    contactInfo: "",
  });

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/project/${projectID}/team/all`);
        const data = await response.json();
        if (response.ok) {
          setTeamMembers(data);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, [projectID]);

  const handleUpdate = async (memberID) => {
    try {
      const response = await fetch(`http://localhost:5000/project/${projectID}/team/${memberID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setTeamMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.memberid === memberID ? { ...member, ...updatedData } : member
          )
        );
        setSelectedMember(null);
      } else {
        console.error("Error updating member");
      }
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

  const handleDelete = async (memberID) => {
    try {
      const response = await fetch(`http://localhost:5000/project/${projectID}/team/${memberID}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTeamMembers((prevMembers) =>
          prevMembers.filter((member) => member.memberid !== memberID)
        );
      } else {
        console.error("Error deleting member");
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNewMemberInputChange = (e) => {
    const { name, value } = e.target;
    setNewMemberData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddMember = async () => {
    try {
      const response = await fetch(`http://localhost:5000/project/${projectID}/team/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMemberData),
      });

      if (response.ok) {
        const newMember = await response.json();
        setTeamMembers((prevMembers) => [...prevMembers, newMember]);
        setNewMemberData({ memberID: "", name: "", role: "", expertise: "", contactInfo: "" });
      } else {
        console.error("Error adding new member");
      }
    } catch (error) {
      console.error("Error during add:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Add New Member Form */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Team Member</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["memberID", "name", "role", "expertise", "contactInfo"].map((field) => (
            <div key={field}>
              <label className="block text-sm text-gray-600 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                name={field}
                value={newMemberData[field]}
                onChange={handleNewMemberInputChange}
                className="p-1 border border-gray-300 rounded w-full text-sm"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddMember}
          className="flex items-center mt-4 text-sm text-white bg-gray-600 px-3 py-1 rounded hover:bg-gray-700"
        >
          <FaPlus className="mr-2" /> Add Member
        </button>
      </section>

      {/* Team Members List */}
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            {["ID", "Name", "Role", "Expertise", "Contact Info", "Actions"].map((header) => (
              <th key={header} className="text-left py-2 px-2 text-gray-700">
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
                {["memberid", "name", "role", "expertise", "contactinfo"].map((key) => (
                  <td key={key} className="py-2 px-2 text-gray-600">
                    {member[key]}
                  </td>
                ))}
                <td className="py-2 px-2 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedMember(member.memberid);
                      setUpdatedData({
                        name: member.name,
                        role: member.role,
                        expertise: member.expertise,
                        contactinfo: member.contactinfo,
                      });
                    }}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(member.memberid)}
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

      {/* Update Member Form */}
      {selectedMember && (
        <div className="mt-6">
          <h4 className="text-gray-700 font-semibold mb-2">Update Member</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["name", "role", "expertise", "contactinfo"].map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-600 capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={updatedData[field]}
                  onChange={handleInputChange}
                  className="p-1 border border-gray-300 rounded w-full text-sm"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => handleUpdate(selectedMember)}
            className="flex items-center mt-4 text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
