import { useEffect, useState } from "react";

export const Experts = () => {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    const fetchExperts = async () => {
      const response = await fetch('http://localhost:5000/expert/all');
      const json = await response.json();
      if (response.ok) {
        setExperts(json);
      }
    };
    console.log(experts)

    fetchExperts();
  }, []);

  return (
    <div>
      <p className="text-2xl py-4">Experts</p>
      <ul className="flex">
        {experts.map((expert) => (
          <li key={expert.expertid} className="py-2">
            <p>Expert ID : {expert.expertid}</p>
            <p>Name : {expert.name}</p>
            <p>Role : {expert.role}</p>
            <p>Expertise : {expert.expertise}</p>
            <p>Contact Info : {expert.contactInfo}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
