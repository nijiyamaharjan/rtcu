import { useEffect, useState } from "react"

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
    <div>
      <p className="text-2xl py-4">Trainings</p>
      <ul className="flex">
        {trainings.map((training) => (
          <li key={training.trainingid} className="py-2">
              <p>Training ID : {training.trainingid}</p>
              <p>Title : {training.title}</p>
              <p>Start Date : {training.startdate}</p>
              <p>End Date : {training.enddate}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}