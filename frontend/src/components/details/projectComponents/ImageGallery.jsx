import React, { useState } from 'react';
import { Loader2, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';

const ImageGallery = ({ projectID, user, images, onUpload, onDelete }) => {
    const [imageFile, setImageFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!imageFile) {
            toast.error("Please select an image to upload");
            return;
        }

        setUploadingImage(true);
        
        try {
            const success = await onUpload(imageFile, caption);
            if (success) {
                setImageFile(null);
                setCaption('');
                e.target.reset();
            }
        } finally {
            setUploadingImage(false);
        }
    };

    const openModal = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Images</h3>

            {/* Image Upload Form */}
            {user && (
                <form
                    onSubmit={handleSubmit}
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
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                        <input
                            type="text"
                            name="caption"
                            placeholder="Caption (optional)"
                            className="border p-2 rounded"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={uploadingImage}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
                    </div>
                </form>
            )}

            {/* Images Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {images.length > 0 ? (
                    images.map((image) => (
                        <div
                            key={image.imageid}
                            className="border rounded overflow-hidden relative group"
                        >
                            <img
                                src={`http://localhost:5000${image.imageurl}`}
                                alt={image.caption || "Project image"}
                                className="w-full h-48 object-cover cursor-pointer"
                                onClick={() => openModal(image)} // Open modal on image click
                            />
                            {image.caption && (
                                <div className="p-2 text-sm text-gray-700">
                                    {image.caption}
                                </div>
                            )}
                            {user && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onDelete(image.imageid)}
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

            {/* Modal for Viewing Image */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-0 rounded-lg">
                        <button
                            onClick={closeModal}
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
                            <div className="mt-2 text-center text-sm text-gray-700">
                                {selectedImage.caption}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
