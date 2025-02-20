import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AddExpert = () => {
    const [expert, setExpert] = useState({
        expertID: "",
        name: "",
        expertiseid: "", // Store expertiseid instead of expertisename
        contactInfo: "",
    });
    const navigate= useNavigate()

    const [expertiseList, setExpertiseList] = useState([]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpert({
            ...expert,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/expert/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(expert),
        });

        if (response.ok) {
            alert("Expert added successfully");
            setExpert({
                expertID: "",
                name: "",
                expertiseid: "", // Reset expertiseid
                contactInfo: "",
            });
            navigate('/team')
        } else {
            alert("Error adding expert");
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
          setExpertiseList((prevExpertise) => [...prevExpertise, addedExpertise]);
        } else {
          alert("Failed to add expertise");
        }
      }
    };
    

    const handleDeleteExpertise = async (expertiseID) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this expertise?"
        );
        if (confirmDelete) {
            const response = await fetch(
                `http://localhost:5000/expertise/${expertiseID}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setExpertiseList(
                    expertiseList.filter(
                        (item) => item.expertiseid !== expertiseID
                    )
                );
            } else {
                alert("Failed to delete expertise");
            }
        }
    };

    

    

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Add Expert</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="expertID"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Expert ID
                    </label>
                    <input
                        type="text"
                        id="expertID"
                        name="expertID"
                        value={expert.expertID}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

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
                        value={expert.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                

                {/* Dropdown for Expertise */}
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
                        value={expert.expertiseid}
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
                        value={expert.contactInfo}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
                    >
                        Add Expert
                    </button>
                </div>
            </form>
        </div>
    );
};
