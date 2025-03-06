import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddOrganization = () => {
    const navigate = useNavigate();
    const [organization, setOrganization] = useState({
        organizationID: "",
        name: "",
        contactInfo: "",
    });
    const [contactError, setContactError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "contactInfo") {
            validateContactInfo(value);
        }
        setOrganization({
            ...organization,
            [name]: value,
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(
            "http://localhost:5000/organization/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(organization),
            }
        );

        if (response.ok) {
            alert("Organization added successfully");
            setOrganization({
                organizationID: "",
                name: "",
                contactInfo: "",
            });
            navigate("/team"); // Navigate to the home page after successful form submission
        } else {
            alert("Error adding organization");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Add Organization</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="organizationID"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Organization ID
                    </label>
                    <input
                        type="text"
                        id="organizationID"
                        name="organizationID"
                        value={organization.organizationID}
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
                        value={organization.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
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
                        value={organization.contactInfo}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {contactError && (
                        <p className="mt-1 text-sm text-red-600">
                            {contactError}
                        </p>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
                    >
                        Add Organization
                    </button>
                </div>
            </form>
        </div>
    );
};
