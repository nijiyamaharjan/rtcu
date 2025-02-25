import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddStudent = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState({
        studentID: "",
        name: "",
        expertiseid: "",
        contactInfo: "",
    });
    const [expertiseList, setExpertiseList] = useState([]);
    const [contactError, setContactError] = useState("");

    const fetchExpertise = async () => {
        try {
            const response = await fetch("http://localhost:5000/expertise");
            const data = await response.json();
            console.log("Fetched expertise:", data); // Debugging
            setExpertiseList(data);
        } catch (err) {
            console.error("Error fetching expertise", err);
        }
    };

    useEffect(() => {
        fetchExpertise();
    }, []);

    // Updates the form fields when any input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "contactInfo") {
            validateContactInfo(value);
        }
        setStudent({
            ...student,
            [name]: value,
        });
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/student/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(student),
        });

        if (response.ok) {
            toast.success("Student added successfully");
            setStudent({
                studentID: "",
                name: "",
                expertiseid: "",
                contactInfo: "",
            });
            navigate("/team");
        } else {
            toast.error("Error adding student");
        }
    };

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
            } else {
                toast.error("Failed to add expertise");
            }
        }
    };

    const validateContactInfo = (value) => {
        const tenDigitPattern = /^\d{10}$/;
        if (!tenDigitPattern.test(value)) {
            setContactError(
                "Phone number must be exactly 10 digits and contain only numbers."
            );
        } else {
            setContactError("");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Add Student</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student ID */}
                <div>
                    <label
                        htmlFor="studentID"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Student ID
                    </label>
                    <input
                        type="text"
                        id="studentID"
                        name="studentID"
                        value={student.studentID}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

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
                        value={student.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                
                <div>
                    <label
                        htmlFor="expertiseid"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Expertise
                    </label>
                    <select
                        id="expertiseid"
                        name="expertiseid"
                        value={student.expertiseid}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Select Expertise</option>
                        {expertiseList.map((expertise) => (
                            <option
                                key={expertise.expertiseid}
                                value={expertise.expertiseid}
                            >
                                {expertise.expertisename}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleAddExpertise}
                        className="mt-2 text-blue-600"
                    >
                        Add New Expertise
                    </button>
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
                        value={student.contactInfo}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {contactError && (
                        <p className="mt-1 text-sm text-red-600">
                            {contactError}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
                    >
                        Add Student
                    </button>
                </div>
            </form>
        </div>
    );
};
