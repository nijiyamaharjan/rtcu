import { useEffect, useState } from "react"

export const Faculty = () => {
  const [faculty, setFaculty] = useState([])

  useEffect(() => {
    const fetchFaculty = async () => {
      const response = await fetch('http://localhost:5000/faculty/all')
      const json = await response.json()
      if (response.ok) {
        setFaculty(json)
      }
    }

    fetchFaculty()
  }, [])
  return (
    <div>
      <p className="text-2xl py-4">Faculty</p>
      <ul className="flex">
        {faculty.map((person) => (
          <li key={person.facultyid} className="py-2">
              <p>Faculty ID : {person.facultyid}</p>
              <p>Name : {person.name}</p>
              <p>Person : {person.role}</p>
              <p>Expertise : {person.expertise}</p>
              <p>Contact Info : {person.contactInfo}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}