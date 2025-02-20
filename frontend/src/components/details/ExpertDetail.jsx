import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const ExpertDetail = () => {
    const { id } = useParams(); // Get the expertID from the route parameter
    const navigate = useNavigate(); // For navigation after update or delete
    const [expert, setExpert] = useState(null);
    const [expertiseList, setExpertiseList] = useState([]);

    // Handle input changes for update form
    const [updatedExpert, setUpdatedExpert] = useState({
        name: "",
        expertiseid: "", // Use expertiseID instead of expertise name
        contactInfo: "",
    });
    const user = useAuth();

    useEffect(() => {
        // Fetch the expert data based on expertID
        const fetchExpertData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/expert/${id}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setExpert(data);
                    setUpdatedExpert({
                        name: data.name,
                        expertiseid: data.expertiseid, // Use expertiseID from the fetched data
                        contactInfo: data.contactinfo,
                    });
                } else {
                    console.error("Error fetching expert data");
                }
            } catch (error) {
                console.error("Network error: ", error);
            }
        };

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

        fetchExpertData();
        fetchExpertise();
    }, [id]); // Fetch data when the id changes

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdatedExpert({
            ...updatedExpert,
            [name]: value,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        // Send the updated data with expertiseID
        const response = await fetch(`http://localhost:5000/expert/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedExpert), // Send the updated expert object
        });

        if (response.ok) {
            alert("Expert updated successfully");
            setExpert({
                ...expert,
                ...updatedExpert,
            });
        } else {
            alert("Error updating expert");
        }
    };

    const handleDelete = async () => {
        const response = await fetch(`http://localhost:5000/expert/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Expert deleted successfully");
            navigate("/team"); // Redirect to home page after deletion
        } else {
            alert("Error deleting expert");
        }
    };

    if (!expert || !expertiseList.length) {
        return <div>Loading...</div>; // Show loading if the data is not yet loaded
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">{expert.name}</h2>

            {/* Expert Details */}
            <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
                <span>
                    <strong>Expert ID:</strong> {expert.expertid}
                </span>
                <span>
                    <strong>Name:</strong> {expert.name}
                </span>
                <span>
                    <strong>Expertise:</strong> {expert.expertisename}
                </span>
                <span>
                    <strong>Contact Info:</strong> {expert.contactinfo}
                </span>
            </div>

            {user && (
                <>
                    {/* Update Form */}
                    <h3 className="text-xl font-semibold mt-8 mb-4">
                        Update Expert
                    </h3>
                    <form onSubmit={handleUpdateSubmit} className="space-y-6">
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
                                value={updatedExpert.name}
                                onChange={handleUpdateChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        

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
                                value={updatedExpert.expertiseid} // Bind to expertiseID, not expertisename
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
                                value={updatedExpert.contactInfo}
                                onChange={handleUpdateChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
                            >
                                Update Expert
                            </button>
                        </div>
                    </form>

                    {/* Delete Button */}
                    <div className="mt-6">
                        <button
                            onClick={handleDelete}
                            className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
                        >
                            Delete Expert
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
