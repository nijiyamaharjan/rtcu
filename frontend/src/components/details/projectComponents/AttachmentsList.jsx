import React, { useState } from 'react';
import { Loader2, Trash2, Download, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AttachmentsList = ({ projectID, user, attachments, onUpload, onDelete, onDownload }) => {
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [description, setDescription] = useState('');
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!attachmentFile) {
            toast.error("Please select a file to upload");
            return;
        }

        setUploadingAttachment(true);
        
        try {
            const success = await onUpload(attachmentFile, description);
            if (success) {
                setAttachmentFile(null);
                setDescription('');
                e.target.reset();
                setIsModalOpen(false);
            }
        } finally {
            setUploadingAttachment(false);
        }
    };

    return (
        <div>
            <div className='flex gap-4'>
                <h3 className="text-xl font-semibold mb-2">Attachments</h3>           
                {user && (
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="bg-blue-600 text-white px-2 py-1 mb-2 rounded hover:bg-blue-700"
                    >
                        Upload New Attachment
                    </button>
                )}
            </div>          
            
                {attachments.length > 0 ? (
                    attachments.map((attachment) => (
                        <div className="border rounded divide-y mt-4">
                        <div key={attachment.attachmentid} className="p-3 flex justify-between items-center">
                            <div className="flex-1">
                                <h4 className="font-medium">{attachment.filename}</h4>
                                {attachment.description && (
                                    <p className="text-sm text-gray-500">{attachment.description}</p>
                                )}
                                <div className="text-xs text-gray-400">
                                    {new Date(attachment.uploaddate).toLocaleDateString()} • {(attachment.filesize / 1024).toFixed(2)} KB
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onDownload(attachment.fileurl, attachment.filename)}
                                    className="p-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                                    title="Download file"
                                >
                                    <Download size={18} />
                                </button>
                                {user && (
                                    <button
                                        onClick={() => onDelete(attachment.attachmentid)}
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
                    <p className="p-0 mt-4 text-gray-500">No attachments uploaded yet.</p>
                )}
            
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg w-96 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 text-gray-800 hover:bg-gray-300"
                        >
                            <X size={20} />
                        </button>
                        <h4 className="font-medium mb-2">Upload New Attachment</h4>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                            <input
                                type="file"
                                name="attachment"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                className="border p-2 rounded"
                                onChange={(e) => setAttachmentFile(e.target.files[0])}
                            />
                            <input
                                type="text"
                                name="description"
                                placeholder="Description (optional)"
                                className="border p-2 rounded"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={uploadingAttachment}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {uploadingAttachment ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                                    </span>
                                ) : (
                                    "Upload File"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttachmentsList;
