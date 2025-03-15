import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Imported components
import ProjectHeader from "./ProjectHeader";
import ProjectDetails from "./ProjectDetails";
import ProjectActions from "./ProjectActions";
import TeamMembersSection from "./TeamMembersSection";
import ProjectMediaSection from "./ProjectMediaSection";
import UpdateProjectModal from "./UpdateProjectModal";

export const ProjectDetail = () => {
    const { id: projectID } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [project, setProject] = useState(null);
    const [updatedProject, setUpdatedProject] = useState({
        title: "",
        description: "",
        type: "",
        startdate: "",
        enddate: "",
        status: "",
        fundingorgid: "",
        outsourcingorgid: "",
    });
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [loadingOrganizations, setLoadingOrganizations] = useState(true);
    const [projectImages, setProjectImages] = useState([]);
    const [projectAttachments, setProjectAttachments] = useState([]);
    const user = useAuth();

    // Fetch project data
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/project/${projectID}`
                );
                if (!response.ok) throw new Error("Failed to fetch project");
                const json = await response.json();
                setProject(json);
                setUpdatedProject({ ...json });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProject();
    }, [projectID]);

    // Fetch organizations data
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/organization/all"
                );
                if (!response.ok)
                    throw new Error("Failed to fetch organizations");
                const orgData = await response.json();
                setOrganizations(orgData);
            } catch (err) {
                console.error("Error fetching organizations:", err);
            } finally {
                setLoadingOrganizations(false);
            }
        };
        fetchOrganizations();
    }, []);

    // Fetch project media
    useEffect(() => {
        const fetchProjectMedia = async () => {
            try {
                // Fetch images
                const imagesResponse = await fetch(
                    `http://localhost:5000/project/${projectID}/images`
                );
                if (imagesResponse.ok) {
                    const imagesData = await imagesResponse.json();
                    setProjectImages(imagesData);
                }

                // Fetch attachments
                const attachmentsResponse = await fetch(
                    `http://localhost:5000/project/${projectID}/attachments`
                );
                if (attachmentsResponse.ok) {
                    const attachmentsData = await attachmentsResponse.json();
                    setProjectAttachments(attachmentsData);
                }
            } catch (err) {
                console.error("Error fetching project media:", err);
            }
        };

        if (projectID) {
            fetchProjectMedia();
        }
    }, [projectID]);

    // Handle input changes for project update
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProject((prev) => ({ ...prev, [name]: value }));
    };

    // Handle project update
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://localhost:5000/project/${projectID}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedProject),
                }
            );
            if (!response.ok) throw new Error("Failed to update project");
            setProject(updatedProject);
            setIsUpdateModalOpen(false);
            toast.success("Project updated successfully");
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Handle project deletion
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this project?"))
            return;
        try {
            const response = await fetch(
                `http://localhost:5000/project/${projectID}`,
                {
                    method: "DELETE",
                }
            );
            if (!response.ok) throw new Error("Failed to delete project");
            navigate("/projects");
            toast.success("Project deleted successfully");
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Handle image upload, deletion, and refresh
    const handleImageUpload = async (imageFile, caption) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("caption", caption);

        try {
            const response = await fetch(
                `http://localhost:5000/project/${projectID}/images`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Failed to upload image");

            const newImage = await response.json();
            setProjectImages([...projectImages, newImage]);
            toast.success("Image uploaded successfully");
            return true;
        } catch (err) {
            toast.error(err.message);
            return false;
        }
    };

    const handleImageDelete = async (imageId) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;
        
        try {
            const response = await fetch(
                `http://localhost:5000/project/${projectID}/images/${imageId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) throw new Error("Failed to delete image");
            
            setProjectImages(projectImages.filter(img => img.imageid !== imageId));
            toast.success("Image deleted successfully");
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Handle attachment upload, deletion, and download
    const handleAttachmentUpload = async (attachmentFile, description) => {
        const formData = new FormData();
        formData.append("attachment", attachmentFile);
        formData.append("description", description);

        try {
            const response = await fetch(
                `http://localhost:5000/project/${projectID}/attachments`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Failed to upload attachment");

            const newAttachment = await response.json();
            setProjectAttachments([...projectAttachments, newAttachment]);
            toast.success("File uploaded successfully");
            return true;
        } catch (err) {
            toast.error(err.message);
            return false;
        }
    };

    const handleAttachmentDelete = async (attachmentId) => {
        if (!window.confirm("Are you sure you want to delete this attachment?")) return;
        
        try {
            const response = await fetch(
                `http://localhost:5000/project/${projectID}/attachments/${attachmentId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) throw new Error("Failed to delete attachment");
            
            setProjectAttachments(projectAttachments.filter(att => att.attachmentid !== attachmentId));
            toast.success("Attachment deleted successfully");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleAttachmentDownload = (attachmentUrl, filename) => {
        const link = document.createElement('a');
        link.href = `http://localhost:5000${attachmentUrl}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Error Loading Project
                    </h3>
                    <p className="mt-2 text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <main className="max-w-4xl pl-8 pr-8 py-8">
            <section className="space-y-6">
                <ProjectHeader project={project} />
                
                <ProjectDetails 
                    project={project} 
                    organizations={organizations} 
                    loadingOrganizations={loadingOrganizations} 
                />
                
                <ProjectActions 
                    user={user} 
                    onUpdate={() => setIsUpdateModalOpen(true)} 
                    onDelete={handleDelete} 
                />
                
                <TeamMembersSection projectID={project.projectid} />
                
                <ProjectMediaSection 
                    projectID={project.projectid}
                    user={user}
                    projectImages={projectImages}
                    projectAttachments={projectAttachments}
                    onImageUpload={handleImageUpload}
                    onImageDelete={handleImageDelete}
                    onAttachmentUpload={handleAttachmentUpload}
                    onAttachmentDelete={handleAttachmentDelete}
                    onAttachmentDownload={handleAttachmentDownload}
                />
            </section>

            {isUpdateModalOpen && user && (
                <UpdateProjectModal
                    project={updatedProject}
                    organizations={organizations}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onChange={handleChange}
                    onSubmit={handleUpdateSubmit}
                />
            )}
        </main>
    );
};