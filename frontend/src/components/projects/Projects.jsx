import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch("http://localhost:5000/project/all");
      const json = await response.json();
      if (response.ok) {
        setProjects(json);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div id="projects" className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-bold text-gray-800">Projects</p>
        <Link
          to="/add-project"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Project
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.projectid}
            className="p-6 border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            <Link
              to={`/project/${project.projectid}`}
              className="text-blue-500 font-medium hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
