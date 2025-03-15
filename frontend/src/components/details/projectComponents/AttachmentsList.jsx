import React, { useState } from 'react';
import { Loader2, Trash2, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const AttachmentsList = ({ projectID, user, attachments, onUpload, onDelete, onDownload }) => {
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [description, setDescription] = useState('');
    const [uploadingAttachment, setUploadingAttachment] = useState(false);

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
            }
        } finally {
            setUploadingAttachment(false);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">
                Attachments
            </h3>

            {/* Attachment Upload Form */}
            {user && (
                <form
                    onSubmit={handleSubmit}
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
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </span>
                            ) : (
                                "Upload File"
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* Attachments Display */}
            <div className="border rounded divide-y">
                {attachments.length > 0 ? (
                    attachments.map((attachment) => (
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
                    ))
                ) : (
                    <p className="p-3 text-gray-500">
                        No attachments uploaded yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AttachmentsList;