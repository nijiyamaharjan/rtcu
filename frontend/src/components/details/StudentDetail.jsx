import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const StudentDetail = () => {
    const { id } = useParams(); // Get the studentID from the route parameter
    const navigate = useNavigate(); // To navigate after delete or update
    const [student, setStudent] = useState(null);
    const [expertiseList, setExpertiseList] = useState([]);

    const [updatedStudent, setUpdatedStudent] = useState({
        name: "",
        expertise: "",
        contactInfo: "",
    });
    const user = useAuth();

    useEffect(() => {
        // Fetch the student data based on studentID
        const fetchStudentData = async () => {
            const response = await fetch(`http://localhost:5000/student/${id}`);
            if (response.ok) {
                const data = await response.json();
                setStudent(data);
                setUpdatedStudent({
                    name: data.name,
                    expertiseid: data.expertiseid,
                    contactInfo: data.contactInfo,
                });
            } else {
                console.error("Error fetching student data");
            }
        };

        // Fetch roles and expertise options
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
            alert("Student updated successfully");
            setStudent({ ...student, ...updatedStudent });
        } else {
            alert("Error updating student");
        }
    };

    // Handle delete student
    const handleDelete = async () => {
        const response = await fetch(`http://localhost:5000/student/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Student deleted successfully");
            navigate("/"); // Redirect to home page after deletion
        } else {
            alert("Error deleting student");
        }
    };

    if (!student || !expertiseList.length) {
        return <div>Loading...</div>; // Show loading if the data is not yet loaded
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">{student.name}</h2>
            <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
                <span>
                    <strong>Student ID:</strong> {student.studentid}
                </span>
                <span>
                    <strong>Name:</strong> {student.name}
                </span>
                <span>
                    <strong>Expertise:</strong> {student.expertisename}
                </span>
                <span>
                    <strong>Contact Info:</strong> {student.contactinfo}
                </span>
            </div>

            {user && (
                <>
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

                        {/* Update Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
                            >
                                Update Student
                            </button>
                        </div>
                    </form>

                    {/* Delete Button */}
                    <div className="mt-6">
                        <button
                            onClick={handleDelete}
                            className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
                        >
                            Delete Student
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
