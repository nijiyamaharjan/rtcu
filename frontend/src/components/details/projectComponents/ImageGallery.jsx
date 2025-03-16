import React, { useState } from 'react';
import { Loader2, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';

const ImageGallery = ({ projectID, user, images, onUpload, onDelete }) => {
    const [imageFile, setImageFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
                toast.success("Image uploaded successfully");
                setIsUploadModalOpen(false);
            }
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="mb-8">
            <div className='flex gap-4'>
                <h3 className="text-xl font-semibold mb-2">Images</h3>
                {user && (
                    <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="bg-blue-600 text-white px-2 py-1 mb-1 rounded hover:bg-blue-700"
                    >
                        Upload New Image
                    </button>
                )}
            </div>           
            {/* Images Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                                onClick={() => {
                                    setSelectedImage(image);
                                    setIsImageModalOpen(true);
                                }}
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
                    <p className="text-gray-500">No images uploaded yet.</p>
                )}
            </div>

            {/* Upload Image Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 relative">
                        <button
                            onClick={() => setIsUploadModalOpen(false)}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                        >
                            <X size={20} />
                        </button>
                        <h4 className="text-lg font-medium mb-4">Upload New Image</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="file"
                                accept="image/*"
                                className="border p-2 rounded w-full"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                            <input
                                type="text"
                                placeholder="Caption (optional)"
                                className="border p-2 rounded w-full"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
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

            {/* View Image Modal */}
            {isImageModalOpen && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-0 rounded-lg">
                        <button
                            onClick={() => setIsImageModalOpen(false)}
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
