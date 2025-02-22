import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">&times;</button>
        {children}
      </div>
    </div>
  );
}

export const TrainingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState(null);
  const [updatedTraining, setUpdatedTraining] = useState({
    title: "",
    startdate: "",
    enddate: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuth()

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
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTraining((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
      setTraining(updatedData);
      setIsModalOpen(false);
    } else {
      alert("Failed to update training.");
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/training/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Training deleted successfully!");
      navigate("/trainings");
    } else {
      alert("Failed to delete training.");
    }
  };

  if (!training) {
    return <div>Loading...</div>;
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
          <strong>Start Date:</strong> {formatDate(training.startdate)}
        </span>
        <span>
          <strong>End Date:</strong> {formatDate(training.enddate)}
        </span>
      </div>

{user && (
  <>
  <button onClick={() => setIsModalOpen(true)} className="mt-6 py-2 px-4 bg-blue-600 text-white rounded-md">
        Update Training
      </button>

      <button onClick={handleDelete} className="mt-6 ml-4 py-2 px-4 bg-red-600 text-white rounded-md">
        Delete Training
      </button>
  </>
  
)}
      

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">Update Training</h3>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="startdate" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="enddate" className="block text-sm font-medium text-gray-700">
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
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
};
