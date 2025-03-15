// ProjectActions.jsx
import React from 'react';
import { Pencil, Trash2 } from "lucide-react";

const ProjectActions = ({ user, onUpdate, onDelete }) => {
    if (!user) return null;
    
    return (
        <div className="flex gap-4 pt-4">
            <button
                onClick={onUpdate}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Update Project"
            >
                <Pencil size={20} />
            </button>
            <button
                onClick={onDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete Project"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};

export default ProjectActions;

