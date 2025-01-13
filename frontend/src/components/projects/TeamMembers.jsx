import { useEffect, useState } from "react";

export const TeamMembers = ({projectID}) => {
    const [teamMembers, setTeamMembers] = useState([]);
    
      useEffect(() => {
        const fetchTeamMembers = async () => {
          const response = await fetch(`http://localhost:5000/project/${projectID}/team/all`);
          const json = await response.json();
          if (response.ok) {
            setTeamMembers(json);
          }
        };
    
        fetchTeamMembers();
      }, []);
  return (
    <div>
        <p>Team Members:</p>
        <ul>
            {teamMembers.map((member) => (
                <li key={member.memberid} className="py-2">
                    <p>Member ID: {member.memberid}</p>
                    <p>Project ID: {member.projectid}</p>
                    <p>Name: {member.name}</p>
                    <p>Role: {member.role}</p>
                    <p>Expertise: {member.expertise}</p>
                    <p>Contact Info: {member.contactinfo}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}