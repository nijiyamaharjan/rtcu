// UpdateProjectModal.jsx
import React from 'react';
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const UpdateProjectModal = ({ project, organizations, onClose, onChange, onSubmit }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Update Project
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {[
                            {
                                label: "Title",
                                name: "title",
                                type: "text",
                            },
                            {
                                label: "Description",
                                name: "description",
                                type: "textarea",
                            },
                            {
                                label: "Type",
                                name: "type",
                                type: "text",
                            },
                            {
                                label: "Start Date",
                                name: "startdate",
                                type: "date",
                            },
                            {
                                label: "End Date",
                                name: "enddate",
                                type: "date",
                            },
                            {
                                label: "Status",
                                name: "status",
                                type: "text",
                            },
                            {
                                label: "Funding Organization",
                                name: "fundingorgid",
                                type: "select",
                                options: organizations.map((org) => ({
                                    value: org.organizationid,
                                    label: org.name,
                                })),
                            },
                            {
                                label: "Outsourcing Organization",
                                name: "outsourcingorgid",
                                type: "select",
                                options: organizations.map((org) => ({
                                    value: org.organizationid,
                                    label: org.name,
                                })),
                            },
                        ].map(({ label, name, type, options }) => (
                            <div key={name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {label}
                                </label>
                                {type === "textarea" ? (
                                    <textarea
                                        name={name}
                                        value={project[name]}
                                        onChange={onChange}
                                        className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        rows={3}
                                    />
                                ) : type === "select" ? (
                                    <select
                                        name={name}
                                        value={project[name]}
                                        onChange={onChange}
                                        className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            Select {label}
                                        </option>
                                        {options.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={type}
                                        name={name}
                                        value={project[name]}
                                        onChange={onChange}
                                        className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                )}
                            </div>
                        ))}
                        <Link
                            to="/add-organization"
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Add Organization
                        </Link>
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
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
    );
};

export default UpdateProjectModal;