import { useEffect, useState } from "react";

export const TeamMembers = ({ projectID }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    role: "",
    expertise: "",
    contactinfo: ""
  });

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const response = await fetch(`http://localhost:5000/project/${projectID}/team/all`);
      const json = await response.json();
      if (response.ok) {
        setTeamMembers(json);
      }
    };

    fetchTeamMembers();
  }, [projectID]);

  // Update a team member
  const handleUpdate = async (memberID) => {
    const response = await fetch(`http://localhost:5000/project/${projectID}/team/${memberID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    if (response.ok) {
      // Update the team member in the state
      setTeamMembers(prevMembers =>
        prevMembers.map(member =>
          member.memberid === memberID ? { ...member, ...updatedData } : member
        )
      );
      setSelectedMember(null); // Close the update form
    } else {
      console.error("Error updating member");
    }
  };

  // Delete a team member
  const handleDelete = async (memberID) => {
    const response = await fetch(`http://localhost:5000/project/${projectID}/team/${memberID}`, {
      method: "DELETE"
    });

    if (response.ok) {
      // Remove the team member from the state
      setTeamMembers(prevMembers =>
        prevMembers.filter(member => member.memberid !== memberID)
      );
    } else {
      console.error("Error deleting member");
    }
  };

  // Handle form changes for the update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <ul className="space-y-6">
        {teamMembers.length === 0 ? (
          <li>No team members found for this project.</li>
        ) : (
          teamMembers.map((member) => (
            <li key={member.memberid} className="border-b border-gray-300 pb-4 last:border-none">
              <div className="flex flex-col sm:flex-row sm:space-x-6">
                <div className="flex-1 mb-4 sm:mb-0">
                  <strong className="text-gray-800">Member ID:</strong>
                  <p>{member.memberid}</p>
                </div>
                <div className="flex-1 mb-4 sm:mb-0">
                  <strong className="text-gray-800">Project ID:</strong>
                  <p>{member.projectid}</p>
                </div>
                <div className="flex-1 mb-4 sm:mb-0">
                  <strong className="text-gray-800">Name:</strong>
                  <p>{member.name}</p>
                </div>
                <div className="flex-1 mb-4 sm:mb-0">
                  <strong className="text-gray-800">Role:</strong>
                  <p>{member.role}</p>
                </div>
                <div className="flex-1 mb-4 sm:mb-0">
                  <strong className="text-gray-800">Expertise:</strong>
                  <p>{member.expertise}</p>
                </div>
                <div className="flex-1">
                  <strong className="text-gray-800">Contact Info:</strong>
                  <p>{member.contactinfo}</p>
                </div>
                <div className="flex space-x-2">
                  {/* Update Button */}
                  <button
                    onClick={() => {
                      setSelectedMember(member.memberid);
                      setUpdatedData({
                        name: member.name,
                        role: member.role,
                        expertise: member.expertise,
                        contactinfo: member.contactinfo
                      });
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Update
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(member.memberid)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Show Update Form */}
              {selectedMember === member.memberid && (
                <div className="mt-4">
                  <h4 className="text-gray-800 font-semibold">Update Member</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={updatedData.name}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={updatedData.role}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Expertise</label>
                      <input
                        type="text"
                        name="expertise"
                        value={updatedData.expertise}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Contact Info</label>
                      <input
                        type="text"
                        name="contactinfo"
                        value={updatedData.contactinfo}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => handleUpdate(member.memberid)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
