import { useEffect, useState } from "react";

export const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch('http://localhost:5000/student/all');
      const json = await response.json();
      if (response.ok) {
        setStudents(json);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <p className="text-2xl py-4">Students</p>
      <ul className="flex">
        {students.map((student) => (
          <li key={student.studentid} className="py-2">
            <p>Student ID : {student.studentid}</p>
            <p>Name : {student.name}</p>
            <p>Expertise : {student.expertise}</p>
            <p>Contact Info : {student.contactInfo}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
