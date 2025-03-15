
import React from 'react';

const ProjectDetails = ({ project, organizations, loadingOrganizations }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
                ["Project ID", project.projectid],
                ["Type", project.type],
                [
                    "Start Date",
                    new Date(project.startdate).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    ),
                ],
                [
                    "End Date",
                    new Date(project.enddate).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    ),
                ],
                ["Status", project.status],
                [
                    "Funding Organization",
                    loadingOrganizations
                        ? "Loading..."
                        : organizations.find(
                              (org) => org.organizationid === project.fundingorgid
                          )?.name || "Unknown Organization",
                ],
                [
                    "Outsourcing Organization",
                    loadingOrganizations
                        ? "Loading..."
                        : organizations.find(
                              (org) => org.organizationid === project.outsourcingorgid
                          )?.name || "Unknown Organization",
                ],
            ].map(([label, value]) => (
                <div key={label} className="border-b pb-2">
                    <dt className="font-medium text-gray-900">{label}</dt>
                    <dd className="mt-1 text-gray-600">{value}</dd>
                </div>
            ))}
        </div>
    );
};

export default ProjectDetails;

