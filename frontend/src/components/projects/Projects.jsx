import { useEffect, useState } from "react";
import { TeamMembers } from "./TeamMembers";
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
    console.log(projects)

    fetchProjects();
  }, []);

  return (
    <div id="projects" className="px-4">
      <p className="text-2xl font-semibold py-4">Projects</p>
      <ul className="space-y-6">
        {projects.map((project) => (
          <li
            key={project.projectid}
            className="border-b border-gray-300 pb-4 last:border-none"
          >
            <h3 className="text-lg font-medium">{project.title}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
            <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
              <span>
                <strong>Project ID:</strong> {project.projectid}
              </span>
              <span>
                <strong>Type:</strong> {project.type}
              </span>
              <span>
                <strong>Start Date:</strong> {project.startdate}
              </span>
              <span>
                <strong>End Date:</strong> {project.enddate}
              </span>
              <span>
                <strong>Status:</strong> {project.status}
              </span>
              <span>
                <strong>Funding Org:</strong> {project.fundingorgid}
              </span>
              <span>
                <strong>Outsourcing Org:</strong> {project.outsourcingorgid}
              </span>
            </div>
            <div className="mt-2">
              <strong>Team Members:</strong>
              <TeamMembers projectID={project.projectid} />
            </div>
          </li>
        ))}
      </ul>
    </div>
      );
};
