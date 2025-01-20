import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const TrainingDetail = () => {
  const { id } = useParams(); // Get the trainingID from the route parameter
  const navigate = useNavigate();
  const [training, setTraining] = useState(null);
  const [updatedTraining, setUpdatedTraining] = useState({
    title: "",
    startdate: "",
    enddate: "",
  });

  useEffect(() => {
    const fetchTrainingData = async () => {
      const response = await fetch(`http://localhost:5000/training/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTraining(data);
        setUpdatedTraining({
          title: data.title,
          startdate: data.startdate,
          enddate: data.enddate,
        });
      } else {
        console.error("Error fetching training data");
      }
    };

    fetchTrainingData();
  }, [id]); // Fetch data when the id changes

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTraining((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle update form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/training/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTraining),
    });

    if (response.ok) {
      alert("Training updated successfully!");
      const updatedData = await response.json();
      setTraining(updatedData); // Update training details in the UI
    } else {
      alert("Failed to update training.");
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/training/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Training deleted successfully!");
      navigate("/trainings"); // Redirect to the list of trainings
    } else {
      alert("Failed to delete training.");
    }
  };

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

      {/* Update Form */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Update Training</h3>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={updatedTraining.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label
            htmlFor="startdate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startdate"
            name="startdate"
            value={updatedTraining.startdate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label
            htmlFor="enddate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            type="date"
            id="enddate"
            name="enddate"
            value={updatedTraining.enddate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
        >
          Update Training
        </button>
      </form>

      {/* Delete Button */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
        >
          Delete Training
        </button>
      </div>
    </div>
  );
};
