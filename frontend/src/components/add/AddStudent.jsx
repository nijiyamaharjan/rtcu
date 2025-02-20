import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import expertiseList from "../json/expertise.json"

export const AddStudent = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState({
        studentID: "",
        name: "",
        roleid: "",
        expertiseid: "",
        contactInfo: "",
    });
    const [roles, setRoles] = useState([]);
    const [expertiseList, setExpertiseList] = useState([]);

    // Fetch roles from the server
    const fetchRoles = async () => {
        try {
            const response = await fetch("http://localhost:5000/role");
            const data = await response.json();
            setRoles(data);
        } catch (err) {
            console.error("Error fetching roles", err);
        }
    };
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
        fetchRoles();

        fetchExpertise();
    }, []);

    // Updates the form fields when any input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Name:", name, "Value:", value);
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
            alert("Student added successfully");
            setStudent({
                studentID: "",
                name: "",
                roleid: "", // Reset roleid
                expertiseid: "",
                contactInfo: "",
            });
            navigate("/team");
        } else {
            alert("Error adding student");
        }
    };

    // Add new role
    const handleAddRole = async () => {
        const newRole = prompt("Enter new role name");
        if (newRole) {
            const response = await fetch("http://localhost:5000/role", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rolename: newRole }),
            });

            if (response.ok) {
                const addedRole = await response.json();
                setRoles((prevRoles) => [...prevRoles, addedRole]);
            } else {
                alert("Failed to add role");
            }
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
                alert("Failed to add expertise");
            }
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
                {/* Dropdown for Role */}
                <div>
                    <label
                        htmlFor="roleid"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Role
                    </label>
                    <select
                        id="roleid"
                        name="roleid"
                        value={student.roleid}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.roleid} value={role.roleid}>
                                {role.rolename}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleAddRole}
                        className="mt-2 text-blue-600"
                    >
                        Add New Role
                    </button>
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
