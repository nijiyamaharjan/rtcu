import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">&times;</button>
        {children}
      </div>
    </div>
  );
}

export const TeamMembers = ({ projectID }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMemberID, setEditingMemberID] = useState(null);
  const [memberData, setMemberData] = useState({
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
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        const updatedMember = await response.json();
        setTeamMembers((prevMembers) => 
          isEditing
            ? prevMembers.map((m) => (m.memberid === editingMemberID ? updatedMember : m))
            : [...prevMembers, updatedMember]
        );
        setMemberData({ memberID: "", name: "", role: "", expertise: "", contactInfo: "" });
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
      role: member.role,
      expertise: member.expertise,
      contactInfo: member.contactinfo,
    });
    setEditingMemberID(member.memberid);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Team Members</h2>
        <button onClick={() => { setIsModalOpen(true); setIsEditing(false); }} className="bg-blue-500 text-white px-3 py-1 rounded flex items-center">
          <FaPlus className="mr-2" /> Add Member
        </button>
      </div>
      <table className="w-full text-sm border">
        <thead className="border-b">
          <tr>
            {["ID", "Name", "Role", "Expertise", "Contact Info", "Actions"].map((header) => (
              <th key={header} className="text-left py-2 px-2 text-gray-700 border-r">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teamMembers.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">No team members found for this project.</td>
            </tr>
          ) : (
            teamMembers.map((member) => (
              <tr key={member.memberid} className="border-b">
                {["memberid", "name", "role", "expertise", "contactinfo"].map((key) => (
                  <td key={key} className="py-2 px-2 text-gray-600 border-r">{member[key]}</td>
                ))}
                <td className="py-2 px-2 flex space-x-2">
                  <button onClick={() => handleEditMember(member)} className="text-gray-500 hover:text-blue-500"><FaEdit /></button>
                  <button className="text-gray-500 hover:text-red-500"><FaTrash /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">{isEditing ? "Edit Member" : "Add New Member"}</h3>
        <input type="text" name="memberID" placeholder="Member ID" value={memberData.memberID} onChange={handleInputChange} className="w-full p-2 mb-2 border rounded" disabled={isEditing} />
        <input type="text" name="name" placeholder="Name" value={memberData.name} onChange={handleInputChange} className="w-full p-2 mb-2 border rounded" />
        <input type="text" name="role" placeholder="Role" value={memberData.role} onChange={handleInputChange} className="w-full p-2 mb-2 border rounded" />
        <input type="text" name="expertise" placeholder="Expertise" value={memberData.expertise} onChange={handleInputChange} className="w-full p-2 mb-2 border rounded" />
        <input type="text" name="contactInfo" placeholder="Contact Info" value={memberData.contactInfo} onChange={handleInputChange} className="w-full p-2 mb-2 border rounded" />
        <button onClick={handleAddOrEditMember} className="bg-blue-500 text-white px-4 py-2 rounded">{isEditing ? "Update" : "Add"}</button>
      </Modal>
    </div>
  );
}
