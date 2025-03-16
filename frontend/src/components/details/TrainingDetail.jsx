import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Loader2, Pencil, Users, Trash2, X, Download } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        description: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = useAuth();
    const [trainingImages, setTrainingImages] = useState([]);
    const [trainingAttachments, setTrainingAttachments] = useState([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    // Image modal states
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
    // Attachment modal state
    const [isAttachmentUploadModalOpen, setIsAttachmentUploadModalOpen] =
        useState(false);
    // Form states
    const [imageFile, setImageFile] = useState(null);
    const [imageCaption, setImageCaption] = useState("");
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [attachmentDescription, setAttachmentDescription] = useState("");

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
                    description: data.description,
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

    const openImageModal = (image) => {
        setSelectedImage(image);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImage(null);
    };
    const closeAttachmentModal = () => {
        setIsAttachmentUploadModalOpen(false);
    };

    const handleDownloadAttachment = (fileUrl, filename) => {
        // Create a full URL
        const fullUrl = `http://localhost:5000${fileUrl}`;

        // Create an anchor element and trigger download
        const link = document.createElement("a");
        link.href = fullUrl;
        link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Downloading ${filename}`);
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            toast.error("Please select an image to upload");
            return;
        }

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("caption", imageCaption);

        setUploadingImage(true);

        try {
            const response = await fetch(
                `http://localhost:5000/training/${id}/images`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Failed to upload image");

            const newImage = await response.json();
            setTrainingImages([...trainingImages, newImage]);
            setIsImageUploadModalOpen(false);
            setImageFile(null);
            setImageCaption("");
            toast.success("Image uploaded successfully");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAttachmentUpload = async (e) => {
        e.preventDefault();

        if (!attachmentFile) {
            toast.error("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("attachment", attachmentFile);
        formData.append("description", attachmentDescription);

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
            setIsAttachmentUploadModalOpen(false);
            setAttachmentFile(null);
            setAttachmentDescription("");
            toast.success("File uploaded successfully");
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

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm("Are you sure you want to delete this image?"))
            return;
        try {
            const response = await fetch(
                `http://localhost:5000/training/images/${imageId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) throw new Error("Failed to delete image");

            // Update state by removing the deleted image
            setTrainingImages(
                trainingImages.filter((img) => img.imageid !== imageId)
            );
            toast.success("Image deleted successfully");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        if (!window.confirm("Are you sure you want to delete this attachment?"))
            return;
        try {
            const response = await fetch(
                `http://localhost:5000/training/attachments/${attachmentId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) throw new Error("Failed to delete attachment");

            // Update state by removing the deleted attachment
            setTrainingAttachments(
                trainingAttachments.filter(
                    (att) => att.attachmentid !== attachmentId
                )
            );
            toast.success("Attachment deleted successfully");
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (!training) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full px-24 py-8">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 text-center">
                    {training.title}
                </h1>
                <p className="mt-4 text-gray-600">{training.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
                ["Training ID", training.trainingid],[],
                [
                    "Start Date",
                    new Date(training.startdate).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    ),
                ],
                [
                    "End Date",
                    new Date(training.enddate).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    ),
                ],
            ].map(([label, value]) => (
                <div key={label} className="border-b pb-2">
                    <dt className="font-medium text-gray-900">{label}</dt>
                    <dd className="mt-1 text-gray-600">{value}</dd>
                </div>
            ))}
        </div>

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
                        <textarea
                            id="description"
                            name="description"
                            value={updatedTraining.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            rows="3"
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
                    <div className="flex justify-between">
                        <h3 className="text-xl font-semibold mb-2">Images</h3>
                        {user && (
                            <button
                                onClick={() => setIsImageUploadModalOpen(true)}
                                className="bg-blue-600 text-white px-2 py-1 mb-1 rounded hover:bg-blue-700"
                            >
                                Upload New Image
                            </button>
                        )}
                    </div>

                    {/* Images Display */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {trainingImages.length > 0 ? (
                            trainingImages.map((image) => (
                                <div
                                    key={image.imageid}
                                    className="border rounded overflow-hidden relative group"
                                >
                                    <img
                                        src={`http://localhost:5000${image.imageurl}`}
                                        alt={image.caption || "Training image"}
                                        className="w-full h-48 object-cover cursor-pointer"
                                        onClick={() => openImageModal(image)}
                                    />
                                    {image.caption && (
                                        <div className="p-2 text-sm text-gray-700">
                                            {image.caption}
                                        </div>
                                    )}
                                    {user && (
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() =>
                                                    handleDeleteImage(
                                                        image.imageid
                                                    )
                                                }
                                                className="p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                                                title="Delete image"
                                            >
                                                <Trash2 size={16} />
                                            </button>
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

                {/* Attachments List with Download and Delete Buttons */}
                <div>
                    <div className="flex justify-between">
                        <h3 className="text-xl font-semibold mb-2">
                            Attachments
                        </h3>

                        {/* Attachment Upload Form */}
                        {user && (
                            <button
                                onClick={() =>
                                    setIsAttachmentUploadModalOpen(true)
                                }
                                className="bg-blue-600 text-white px-2 py-1 mb-1 rounded hover:bg-blue-700"
                            >
                                Upload New Attachment
                            </button>
                        )}
                    </div>

                    {/* Attachments Display with Download and Delete Options */}

                    {trainingAttachments.length > 0 ? (
                        trainingAttachments.map((attachment) => (
                            <div className="border rounded divide-y">
                                <div
                                    key={attachment.attachmentid}
                                    className="p-3 flex justify-between items-center"
                                >
                                    <div className="flex-1">
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
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleDownloadAttachment(
                                                    attachment.fileurl,
                                                    attachment.filename
                                                )
                                            }
                                            className="p-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                                            title="Download file"
                                        >
                                            <Download size={18} />
                                        </button>
                                        {user && (
                                            <button
                                                onClick={() =>
                                                    handleDeleteAttachment(
                                                        attachment.attachmentid
                                                    )
                                                }
                                                className="p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                                                title="Delete file"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="p-0 mt-4 text-gray-500">
                            No attachments uploaded yet.
                        </p>
                    )}
                </div>
            </section>

            {isImageUploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 relative">
                        <button
                            onClick={() => setIsImageUploadModalOpen(false)}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                        >
                            <X size={20} />
                        </button>
                        <h4 className="text-lg font-medium mb-4">
                            Upload New Image
                        </h4>
                        <form
                            onSubmit={handleImageUpload}
                            className="space-y-4"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                className="border p-2 rounded w-full"
                                onChange={(e) =>
                                    setImageFile(e.target.files[0])
                                }
                            />
                            <input
                                type="text"
                                placeholder="Caption (optional)"
                                className="border p-2 rounded w-full"
                                value={imageCaption}
                                onChange={(e) =>
                                    setImageCaption(e.target.value)
                                }
                            />
                            <button
                                type="submit"
                                disabled={uploadingImage}
                                className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
                            >
                                {uploadingImage ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </span>
                                ) : (
                                    "Upload Image"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isAttachmentUploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg w-96 relative">
                        <button
                            onClick={() =>
                                setIsAttachmentUploadModalOpen(false)
                            }
                            className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 text-gray-800 hover:bg-gray-300"
                        >
                            <X size={20} />
                        </button>
                        <h4 className="font-medium mb-2">
                            Upload New Attachment
                        </h4>
                        <form
                            onSubmit={handleAttachmentUpload}
                            className="flex flex-col space-y-2"
                        >
                            <input
                                type="file"
                                name="attachment"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                className="border p-2 rounded"
                                onChange={(e) =>
                                    setAttachmentFile(e.target.files[0])
                                }
                            />
                            <input
                                type="text"
                                name="description"
                                placeholder="Description (optional)"
                                className="border p-2 rounded"
                                value={attachmentDescription}
                                onChange={(e) =>
                                    setAttachmentDescription(e.target.value)
                                }
                            />
                            <button
                                type="submit"
                                disabled={uploadingAttachment}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {uploadingAttachment ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                                        Uploading...
                                    </span>
                                ) : (
                                    "Upload File"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {isImageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-0 rounded-lg">
                        <button
                            onClick={closeImageModal}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-800 hover:bg-gray-200"
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={`http://localhost:5000${selectedImage.imageurl}`}
                            alt={selectedImage.caption || "Selected image"}
                            className="w-96 h-auto object-contain"
                        />
                        {selectedImage.caption && (
                            <div className="p-4 text-center text-sm text-gray-700">
                                {selectedImage.caption}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
