import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const TrainingDetail = () => {
  const { id } = useParams(); // Get the trainingID from the route parameter
  const [training, setTraining] = useState(null);

  useEffect(() => {
    const fetchTrainingData = async () => {
      const response = await fetch(`http://localhost:5000/training/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTraining(data);
      } else {
        console.error("Error fetching training data");
      }
    };

    fetchTrainingData();
  }, [id]); // Fetch data when the id changes

  if (!training) {
    return <div>Loading...</div>; // Show loading if the data is not yet loaded
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">{training.title}</h2>
      <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
        <span>
          <strong>Training ID:</strong> {training.trainingid}
        </span>
        <span>
          <strong>Title:</strong> {training.title}
        </span>
        <span>
          <strong>Start Date:</strong> {training.startdate}
        </span>
        <span>
          <strong>End Date:</strong> {training.enddate}
        </span>
      </div>
    </div>
  );
};
