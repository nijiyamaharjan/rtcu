import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddTraining = () => {
    const navigate = useNavigate();

    const [training, setTraining] = useState({
        trainingID: '',
        title: '',
        startDate: '',
        endDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTraining({
            ...training,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/training/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(training)
        });

        if (response.ok) {
            toast.success('Training added successfully');
            setTraining({
                trainingID: '',
                title: '',
                startDate: '',
                endDate: ''
            });
            navigate("/trainings");
        } else {
            toast.error('Error adding training');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Add Training</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="trainingID" className="block text-sm font-medium text-gray-700">Training ID</label>
                    <input
                        type="text"
                        id="trainingID"
                        name="trainingID"
                        value={training.trainingID}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={training.title}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={training.startDate}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={training.endDate}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
                        Add Training
                    </button>
                </div>
            </form>
        </div>
    );
};
