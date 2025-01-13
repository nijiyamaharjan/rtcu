import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('http://localhost:5000/project/all');
      const json = await response.json();
      if (response.ok) {
        setProjects(json);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div id="projects" className="px-4">
  <p className="text-2xl font-semibold py-4">Projects</p>
  <Link to={"/add-project"} className="text-blue-500">Add Faculty</Link>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {projects.map((project) => (
      <div
        key={project.projectid}
        className="p-4 border border-gray-300 rounded-lg"
      >
        <h3 className="text-lg font-medium mb-2">{project.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{project.description}</p>
        <Link
          to={`/project/${project.projectid}`}
          className="text-blue-500 hover:underline"
        >
          Details
        </Link>
      </div>
    ))}
  </div>
</div>

      );
};
