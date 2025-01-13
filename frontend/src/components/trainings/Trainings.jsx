import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export const Trainings = () => {
  const [trainings, setTrainings] = useState([])

  useEffect(() => {
    const fetchTrainings = async () => {
      const response = await fetch('http://localhost:5000/training/all')
      const json = await response.json()
      if (response.ok) {
        setTrainings(json)
      }
    }

    fetchTrainings()
  }, [])
  return (
    <div id="trainings" className="px-4">
  <p className="text-2xl font-semibold py-4">Trainings</p>
  <Link to={"/add-training"} className="text-blue-500">Add Training</Link>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {trainings.map((training) => (
      <div
        key={training.trainingid}
        className="p-4 border border-gray-300 rounded-lg"
      >
            <h3 className="text-lg font-medium mb-2">{training.title}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Training ID:</span> {training.trainingid}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Start Date:</span> {training.startdate}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">End Date:</span> {training.enddate}
            </p>
            <Link
          to={`/training/${training.trainingid}`}
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