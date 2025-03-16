import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Loader2, Pencil, Users, Trash2, X } from "lucide-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

export const StudentDetail = () => {
    const { id } = useParams(); // Get the studentID from the route parameter
    const navigate = useNavigate(); // To navigate after delete or update
    const [student, setStudent] = useState(null);
    const [expertiseList, setExpertiseList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [updatedStudent, setUpdatedStudent] = useState({
        name: "",
        expertise: "",
        contactInfo: "",
    });
    const user = useAuth();

    useEffect(() => {
        // Fetch the student data based on studentID


        // Fetch expertise options
        const fetchExpertise = async () => {
            const expertiseResponse = await fetch(
                "http://localhost:5000/expertise"
            );

            if (expertiseResponse.ok) {
                const expertiseData = await expertiseResponse.json();
                setExpertiseList(expertiseData);
            } else {
                console.error("Error fetching expertise");
            }
        };

        fetchStudentData();
        fetchExpertise();
    }, [id]);

    const fetchStudentData = async () => {
        const response = await fetch(`http://localhost:5000/student/${id}`);
        if (response.ok) {
            const data = await response.json();
            setStudent(data);
            setUpdatedStudent({
                name: data.name,
                expertiseid: data.expertiseid,
                contactInfo: data.contactinfo,
            });
        } else {
            console.error("Error fetching student data");
        }
    };

    // Handle form input changes
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdatedStudent({
            ...updatedStudent,
            [name]: value,
        });
    };

    // Handle update submission
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/student/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedStudent),
        });

        if (response.ok) {
            toast.success("Student updated successfully");
            setStudent({ ...student, ...updatedStudent });
            setIsModalOpen(false)
            fetchStudentData()
        } else {
            toast.error("Error updating student");
        }
    };

    // Handle delete student
    const handleDelete = async () => {
        const response = await fetch(`http://localhost:5000/student/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            toast.success("Student deleted successfully");
            // navigate("/team"); // Redirect to home page after deletion
        } else {
            toast.error("Error deleting student");
        }
    };

    if (!student || !expertiseList.length) {
        return <div>Loading...</div>; // Show loading if the data is not yet loaded
    }

    const handleAddExpertise = async () => {
        const newExpertise = prompt("Enter new expertise name");
        if (newExpertise) {
            const response = await fetch("http://localhost:5000/expertise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ expertisename: newExpertise }),
            });

            if (response.ok) {
                const addedExpertise = await response.json();
                // Add the new expertise to the state instead of re-fetching all expertise
                setExpertiseList((prevExpertise) => [
                    ...prevExpertise,
                    addedExpertise,
                ]);
                setIsModalOpen(false);
            } else {
                toast.error("Failed to add expertise");
            }
        }
    };

    return (
        <div className="max-w-4xl pl-8 pr-8 py-8">
            <h2 className="text-2xl font-semibold mb-6">{student.name}</h2>
            <div className="grid grid-cols-1 gap-y-2 mt-2 text-sm">
                <span>
                    <strong>Student ID:</strong> {student.studentid}
                </span>
                <span>
                    <strong>Expertise:</strong> {student.expertisename}
                </span>
                <span>
                    <strong>Contact Info:</strong> {student.contactinfo}
                </span>
            </div>

            {user && (
                <div className="pt-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Update Expert"
                    >
                        <Pencil size={20} />
                    </button>

                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Expert"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {/* Update Form */}
                <h3 className="text-xl font-semibold mt-8 mb-4">
                    Update Student
                </h3>
                <form onSubmit={handleUpdateSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={updatedStudent.name}
                            onChange={handleUpdateChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    {/* Expertise Dropdown */}
                    <div>
                        <label
                            htmlFor="expertise"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Expertise
                        </label>
                        <button
                            type="button"
                            onClick={handleAddExpertise}
                            className="mt-2 text-blue-600"
                        >
                            Add New Expertise
                        </button>
                        <select
                            id="expertise"
                            name="expertiseid" // Use expertiseID instead of expertise
                            value={updatedStudent.expertiseid} // Bind to expertiseID, not expertisename
                            onChange={handleUpdateChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="" disabled>
                                Select expertise
                            </option>
                            {expertiseList.map((expertise) => (
                                <option
                                    key={expertise.expertiseid}
                                    value={expertise.expertiseid}
                                >
                                    {expertise.expertisename}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <label
                            htmlFor="contactInfo"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Contact Info
                        </label>
                        <input
                            type="text"
                            id="contactInfo"
                            name="contactInfo"
                            value={updatedStudent.contactInfo}
                            onChange={handleUpdateChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
