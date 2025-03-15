// TeamMembersSection.jsx
import React from 'react';
import { TeamMembers } from "../projects/TeamMembers";

const TeamMembersSection = ({ projectID }) => {
    return (
        <section className="pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Team Members
            </h2>
            <TeamMembers projectID={projectID} />
        </section>
    );
};

export default TeamMembersSection;

