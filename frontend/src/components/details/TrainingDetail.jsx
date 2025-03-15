import { useEffect, useState } from "react";
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

export const TrainingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState(null);
    const [updatedTraining, setUpdatedTraining] = useState({
        title: "",
        startdate: "",
        enddate: "",
        description: ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = useAuth();
    const [trainingImages, setTrainingImages] = useState([]);
    const [trainingAttachments, setTrainingAttachments] = useState([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingAttachment, setUploadingAttachment] = useState(false);

    useEffect(() => {
        const fetchTrainingData = async () => {
            const response = await fetch(
                `http://localhost:5000/training/${id}`
            );
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

    useEffect(() => {
        const fetchTrainingMedia = async () => {
            try {
                // Fetch images
                const imagesResponse = await fetch(
                    `http://localhost:5000/training/${id}/images`
                );
                if (imagesResponse.ok) {
                    const imagesData = await imagesResponse.json();
                    setTrainingImages(imagesData);
                }

                // Fetch attachments
                const attachmentsResponse = await fetch(
                    `http://localhost:5000/training/${id}/attachments`
                );
                if (attachmentsResponse.ok) {
                    const attachmentsData = await attachmentsResponse.json();
                    setTrainingAttachments(attachmentsData);
                }
            } catch (err) {
                console.error("Error fetching training media:", err);
            }
        };

        if (id) {
            fetchTrainingMedia();
        }
    }, [id]);

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const imageFile = e.target.image.files[0];
        const caption = e.target.caption.value;

        if (!imageFile) {
            toast.error("Please select an image to upload");
            return;
        }

        formData.append("image", imageFile);
        formData.append("caption", caption);

        setUploadingImage(true);

        try {
            const response = await fetch(
                `http://localhost:5000/training/${id}/images`,
                {
                    method: "POST",
                    body: formData,
                    // No Content-Type header needed, it's set automatically for FormData
                }
            );

            if (!response.ok) throw new Error("Failed to upload image");

            const newImage = await response.json();
            setTrainingImages([...trainingImages, newImage]);
            toast.success("Image uploaded successfully");
            e.target.reset();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAttachmentUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const attachmentFile = e.target.attachment.files[0];
        const description = e.target.description.value;

        if (!attachmentFile) {
            toast.error("Please select a file to upload");
            return;
        }

        formData.append("attachment", attachmentFile);
        formData.append("description", description);

        setUploadingAttachment(true);

        try {
            const response = await fetch(
                `http://localhost:5000/training/${id}/attachments`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Failed to upload attachment");

            const newAttachment = await response.json();
            setTrainingAttachments([...trainingAttachments, newAttachment]);
            toast.success("File uploaded successfully");
            e.target.reset();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploadingAttachment(false);
        }
    };

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
            toast.success("Training updated successfully!");
            const updatedData = await response.json();
            setTraining(updatedData);
            setIsModalOpen(false);
        } else {
            toast.error("Failed to update training.");
        }
    };

    const handleDelete = async () => {
        const response = await fetch(`http://localhost:5000/training/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            toast.success("Training deleted successfully!");
            navigate("/trainings");
        } else {
            toast.error("Failed to delete training.");
        }
    };

    if (!training) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl pl-8 pr-8 py-8">
            <h2 className="text-2xl font-semibold mb-6">{training.title}</h2>
            <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
                <span>
                    <strong>Training ID:</strong> {training.trainingid}
                </span>
                <span>
                    <strong>Title:</strong> {training.title}
                </span>
                <span>
                    <strong>Start Date:</strong>{" "}
                    {formatDate(training.startdate)}
                </span>
                <span>
                    <strong>End Date:</strong> {formatDate(training.enddate)}
                </span>
            </div>
            <p className="mt-4 text-gray-600">{training.description}</p>

            {user && (
                <div className="pt-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Update Training"
                    >
                        <Pencil size={20} />
                    </button>

                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Training"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3 className="text-xl font-semibold mb-4">Update Training</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
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
                        <label
                            htmlFor="startdate"
                            className="block text-sm font-medium text-gray-700"
                        >
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
                        <label
                            htmlFor="enddate"
                            className="block text-sm font-medium text-gray-700"
                        >
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
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <input
                            type="textarea"
                            id="description"
                            name="description"
                            value={updatedTraining.description}
                            onChange={handleChange}
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
            <section className="pt-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Training Media
                    </h2>

                    {/* Images Gallery */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-2">Images</h3>

                        {/* Image Upload Form */}
                        {user && (
                            <form
                                onSubmit={handleImageUpload}
                                className="mb-4 p-4 border rounded"
                            >
                                <h4 className="font-medium mb-2">
                                    Upload New Image
                                </h4>
                                <div className="flex flex-col space-y-2">
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="caption"
                                        placeholder="Caption (optional)"
                                        className="border p-2 rounded"
                                    />
                                    <button
                                        type="submit"
                                        disabled={uploadingImage}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {uploadingImage
                                            ? "Uploading..."
                                            : "Upload Image"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Images Display */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {trainingImages.length > 0 ? (
                                trainingImages.map((image) => (
                                    <div
                                        key={image.imageid}
                                        className="border rounded overflow-hidden"
                                    >
                                        <img
                                            src={`http://localhost:5000${image.imageurl}`}
                                            alt={
                                                image.caption || "Training image"
                                            }
                                            className="w-full h-48 object-cover"
                                        />
                                        {image.caption && (
                                            <div className="p-2 text-sm text-gray-700">
                                                {image.caption}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    No images uploaded yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Attachments List */}
                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            Attachments
                        </h3>

                        {/* Attachment Upload Form */}
                        {user && (
                            <form
                                onSubmit={handleAttachmentUpload}
                                className="mb-4 p-4 border rounded"
                            >
                                <h4 className="font-medium mb-2">
                                    Upload New Attachment
                                </h4>
                                <div className="flex flex-col space-y-2">
                                    <input
                                        type="file"
                                        name="attachment"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Description (optional)"
                                        className="border p-2 rounded"
                                    />
                                    <button
                                        type="submit"
                                        disabled={uploadingAttachment}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {uploadingAttachment
                                            ? "Uploading..."
                                            : "Upload File"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Attachments Display */}
                        <div className="border rounded divide-y">
                            {trainingAttachments.length > 0 ? (
                                trainingAttachments.map((attachment) => (
                                    <div
                                        key={attachment.attachmentid}
                                        className="p-3 flex justify-between items-center"
                                    >
                                        <div>
                                            <h4 className="font-medium">
                                                {attachment.filename}
                                            </h4>
                                            {attachment.description && (
                                                <p className="text-sm text-gray-500">
                                                    {attachment.description}
                                                </p>
                                            )}
                                            <div className="text-xs text-gray-400">
                                                {new Date(
                                                    attachment.uploaddate
                                                ).toLocaleDateString()}{" "}
                                                •
                                                {(
                                                    attachment.filesize / 1024
                                                ).toFixed(2)}{" "}
                                                KB
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    No images uploaded yet.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
        </div>
    );
};
