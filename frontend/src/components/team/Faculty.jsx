import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';

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
    <div id="faculty" className="px-4">
      <p className="text-2xl font-semibold py-4">Faculty</p>
      <Link to={"/add-faculty"} className="text-blue-500">Add Faculty</Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map((person) => (
          <div
            key={person.facultyid}
            className="p-4 border border-gray-300 rounded-lg"
          >
            <h3 className="text-lg font-medium mb-2">{person.name}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Faculty ID:</span> {person.facultyid}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Role:</span> {person.role}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Expertise:</span> {person.expertise}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Contact Info:</span> {person.contactInfo}
            </p>
            <Link
          to={`/faculty/${person.facultyid}`}
          className="text-blue-500 hover:underline"
        >
          Details
        </Link>
          </div>
        ))}
      </div>
    </div>
  )
}