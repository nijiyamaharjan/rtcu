import React from 'react';
import ImageGallery from './ImageGallery';
import AttachmentsList from './AttachmentsList';

const ProjectMediaSection = ({ 
    projectID, 
    user, 
    projectImages, 
    projectAttachments, 
    onImageUpload, 
    onImageDelete, 
    onAttachmentUpload, 
    onAttachmentDelete, 
    onAttachmentDownload 
}) => {
    return (
        <section className="pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Project Media
            </h2>

            <ImageGallery 
                projectID={projectID}
                user={user}
                images={projectImages}
                onUpload={onImageUpload}
                onDelete={onImageDelete}
            />

            <AttachmentsList 
                projectID={projectID}
                user={user}
                attachments={projectAttachments}
                onUpload={onAttachmentUpload}
                onDelete={onAttachmentDelete}
                onDownload={onAttachmentDownload}
            />
        </section>
    );
};

export default ProjectMediaSection;