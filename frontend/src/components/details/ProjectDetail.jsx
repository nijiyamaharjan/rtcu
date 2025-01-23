import { useState, useEffect } from "react";
import { TeamMembers } from "../projects/TeamMembers";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Pencil, Users, Trash2, X } from "lucide-react";

export const ProjectDetail = () => {
  const { id: projectID } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [updatedProject, setUpdatedProject] = useState({
    title: "", description: "", type: "", startdate: "", 
    enddate: "", status: "", fundingorgid: "", outsourcingorgid: ""
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isTeamMembersExpanded, setIsTeamMembersExpanded] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/project/${projectID}`);
        if (!response.ok) throw new Error("Failed to fetch project");
        const json = await response.json();
        setProject(json);
        setUpdatedProject({ ...json });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/project/${projectID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProject),
      });
      if (!response.ok) throw new Error("Failed to update project");
      setProject(updatedProject);
      setIsUpdateModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`http://localhost:5000/project/${projectID}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete project");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Error Loading Project</h3>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl pl-2 pr-8 py-8">
      <section className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="mt-4 text-gray-600">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            ["Project ID", project.projectid],
            ["Type", project.type],
            ["Start Date", project.startdate],
            ["End Date", project.enddate],
            ["Status", project.status],
            ["Funding Organization", project.fundingorgid],
            ["Outsourcing Organization", project.outsourcingorgid],
          ].map(([label, value]) => (
            <div key={label} className="border-b pb-2">
              <dt className="font-medium text-gray-900">{label}</dt>
              <dd className="mt-1 text-gray-600">{value}</dd>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Update Project"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => setIsTeamMembersExpanded(!isTeamMembersExpanded)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
            title={isTeamMembersExpanded ? "Hide Team" : "Show Team"}
          >
            <Users size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Project"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {isTeamMembersExpanded && (
          <section className="pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Members</h2>
            <TeamMembers projectID={project.projectid} />
          </section>
        )}

        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Update Project</h2>
                  <button 
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      {type === "textarea" ? (
                        <textarea
                          name={name}
                          value={updatedProject[name]}
                          onChange={handleChange}
                          className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          rows={3}
                        />
                      ) : (
                        <input
                          type={type}
                          name={name}
                          value={updatedProject[name]}
                          onChange={handleChange}
                          className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsUpdateModalOpen(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};