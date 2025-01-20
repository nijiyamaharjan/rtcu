import { useState, useEffect } from "react";
import { TeamMembers } from "../projects/TeamMembers";
import { useParams, useNavigate } from "react-router-dom";

export const ProjectDetail = () => {
  const params = useParams();
  const projectID = params.id;
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [updatedProject, setUpdatedProject] = useState({
    title: "",
    description: "",
    type: "",
    startdate: "",
    enddate: "",
    status: "",
    fundingorgid: "",
    outsourcingorgid: "",
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isTeamMembersExpanded, setIsTeamMembersExpanded] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`http://localhost:5000/project/${projectID}`);
      const json = await response.json();
      if (response.ok) {
        setProject(json);
        setUpdatedProject({
          title: json.title,
          description: json.description,
          type: json.type,
          startdate: json.startdate,
          enddate: json.enddate,
          status: json.status,
          fundingorgid: json.fundingorgid,
          outsourcingorgid: json.outsourcingorgid,
        });
      }
    };

    fetchProject();
  }, [projectID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject({ ...updatedProject, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/project/${projectID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProject),
    });

    if (response.ok) {
      alert("Project updated successfully");
      setProject({ ...project, ...updatedProject });
      setIsUpdateModalOpen(false);
    } else {
      alert("Error updating project");
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/project/${projectID}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Project deleted successfully");
      navigate("/");
    } else {
      alert("Error deleting project");
    }
  };

  if (!project) {
    return <div className="text-center py-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-lg shadow-md">
      {/* Project Details */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{project.title}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {[
          ["Project ID", project.projectid],
          ["Type", project.type],
          ["Start Date", project.startdate],
          ["End Date", project.enddate],
          ["Status", project.status],
          ["Funding Organization", project.fundingorgid],
          ["Outsourcing Organization", project.outsourcingorgid],
        ].map(([label, value]) => (
          <div key={label}>
            <strong className="block text-gray-700">{label}:</strong>
            <p className="text-gray-600">{value}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setIsUpdateModalOpen(true)}
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Update
        </button>
        <button
          onClick={() => setIsTeamMembersExpanded(!isTeamMembersExpanded)}
          className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {isTeamMembersExpanded ? "Hide Team Members" : "Show Team Members"}
        </button>
        <button
          onClick={handleDelete}
          className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete Project
        </button>
      </div>

      {/* Team Members */}
      {isTeamMembersExpanded && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Members</h2>
          <TeamMembers projectID={project.projectid} />
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Update Project</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {[
                { label: "Title", name: "title", type: "text" },
                { label: "Description", name: "description", type: "textarea" },
                { label: "Type", name: "type", type: "text" },
                { label: "Start Date", name: "startdate", type: "date" },
                { label: "End Date", name: "enddate", type: "date" },
                { label: "Status", name: "status", type: "text" },
                { label: "Funding Organization", name: "fundingorgid", type: "text" },
                { label: "Outsourcing Organization", name: "outsourcingorgid", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      id={name}
                      name={name}
                      value={updatedProject[name]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  ) : (
                    <input
                      type={type}
                      id={name}
                      name={name}
                      value={updatedProject[name]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
