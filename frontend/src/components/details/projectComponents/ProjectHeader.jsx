import React from 'react';

const ProjectHeader = ({ project }) => {
    return (
        <div className="border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
                {project.title}
            </h1>
            <p className="mt-4 text-gray-600">{project.description}</p>
        </div>
    );
};

export default ProjectHeader;