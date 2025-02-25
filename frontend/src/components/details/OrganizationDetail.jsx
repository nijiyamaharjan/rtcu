import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "./../../hooks/useAuth";
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

export const OrganizationDetail = () => {
    const { id } = useParams(); // Get the organizationID from the route parameter
    const navigate = useNavigate(); // For navigation after update or delete
    const [organization, setOrganization] = useState(null);
    const user = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle input changes for update form
    const [updatedOrganization, setUpdatedOrganization] = useState({
        name: "",
        contactinfo: "",
    });

    const fetchOrganizationData = async () => {
      const response = await fetch(
          `http://localhost:5000/organization/${id}`
      );
      if (response.ok) {
          const data = await response.json();
          setOrganization(data);
          setUpdatedOrganization({
              name: data.name,
              contactInfo: data.contactinfo,
          });
      } else {
          console.error("Error fetching organization data");
      }
  };

    useEffect(() => {
        // Fetch the organization data based on organizationID


        fetchOrganizationData();
    }, [id]); // Fetch data when the id changes

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdatedOrganization({
            ...updatedOrganization,
            [name]: value,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(
            `http://localhost:5000/organization/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedOrganization),
            }
        );

        if (response.ok) {
            toast.success("Organization updated successfully");
            setOrganization({
                ...organization,
                ...updatedOrganization,
            });
            setIsModalOpen(false);
            fetchOrganizationData()
        } else {
            toast.error("Error updating organization");
        }
    };

    const handleDelete = async () => {
        const response = await fetch(
            `http://localhost:5000/organization/${id}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            toast.success("Organization deleted successfully");
            navigate("/team"); // Redirect to home page after deletion
        } else {
            toast.error("Error deleting organization");
        }
    };

    if (!organization) {
        return <div>Loading...</div>; // Show loading if the data is not yet loaded
    }

    return (
        <div className="max-w-4xl pl-8 pr-8 py-8">
            <h2 className="text-2xl font-semibold mb-6">{organization.name}</h2>

            {/* Organization Details */}
            <div className="grid grid-cols-1 gap-y-2 mt-2 text-sm">
                <span>
                    <strong>Organization ID:</strong>{" "}
                    {organization.organizationid}
                </span>
                <span>
                    <strong>Contact Info:</strong> {organization.contactinfo}
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
                    Update Organization
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
                            value={updatedOrganization.name}
                            onChange={handleUpdateChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
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
                            value={updatedOrganization.contactInfo}
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
