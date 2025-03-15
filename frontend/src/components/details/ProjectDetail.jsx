import { useState, useEffect } from "react";
import { TeamMembers } from "../projects/TeamMembers";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, Pencil, Users, Trash2, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [isTeamMembersExpanded, setIsTeamMembersExpanded] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [loadingOrganizations, setLoadingOrganizations] = useState(true);
    const [projectImages, setProjectImages] = useState([]);
    const [projectAttachments, setProjectAttachments] = useState([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
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

    // Add these functions for uploading
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
                `http://localhost:5000/project/${projectID}/images`,
                {
                    method: "POST",
                    body: formData,
                    // No Content-Type header needed, it's set automatically for FormData
                }
            );

            if (!response.ok) throw new Error("Failed to upload image");

            const newImage = await response.json();
            setProjectImages([...projectImages, newImage]);
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
            e.target.reset();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploadingAttachment(false);
        }
    };
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
        } catch (err) {
            toast.error(err.message);
        }
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
                <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {project.title}
                    </h1>
                    <p className="mt-4 text-gray-600">{project.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        ["Project ID", project.projectid],
                        ["Type", project.type],

                        [
                            "Start Date",
                            new Date(project.startdate).toLocaleDateString(
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
                            new Date(project.enddate).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }
                            ),
                        ],

                        ["Status", project.status],
                        [
                            "Funding Organization",
                            loadingOrganizations
                                ? "Loading..."
                                : organizations.find(
                                      (org) =>
                                          org.organizationid ===
                                          project.fundingorgid
                                  )?.name || "Unknown Organization",
                        ],
                        [
                            "Outsourcing Organization",
                            loadingOrganizations
                                ? "Loading..."
                                : organizations.find(
                                      (org) =>
                                          org.organizationid ===
                                          project.outsourcingorgid
                                  )?.name || "Unknown Organization",
                        ],
                    ].map(([label, value]) => (
                        <div key={label} className="border-b pb-2">
                            <dt className="font-medium text-gray-900">
                                {label}
                            </dt>
                            <dd className="mt-1 text-gray-600">{value}</dd>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 pt-4">
                    {user && (
                        <button
                            onClick={() => setIsUpdateModalOpen(true)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Update Project"
                        >
                            <Pencil size={20} />
                        </button>
                    )}

                    {user && (
                        <button
                            onClick={handleDelete}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Project"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>

                <section className="pt-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Team Members
                    </h2>
                    <TeamMembers projectID={project.projectid} />
                </section>

                {isUpdateModalOpen && user && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Update Project
                                    </h2>
                                    <button
                                        onClick={() =>
                                            setIsUpdateModalOpen(false)
                                        }
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <form
                                    onSubmit={handleUpdateSubmit}
                                    className="space-y-4"
                                >
                                    {[
                                        {
                                            label: "Title",
                                            name: "title",
                                            type: "text",
                                        },
                                        {
                                            label: "Description",
                                            name: "description",
                                            type: "textarea",
                                        },
                                        {
                                            label: "Type",
                                            name: "type",
                                            type: "text",
                                        },
                                        {
                                            label: "Start Date",
                                            name: "startdate",
                                            type: "date",
                                        },
                                        {
                                            label: "End Date",
                                            name: "enddate",
                                            type: "date",
                                        },
                                        {
                                            label: "Status",
                                            name: "status",
                                            type: "text",
                                        },
                                        {
                                            label: "Funding Organization",
                                            name: "fundingorgid",
                                            type: "select",
                                            options: organizations.map(
                                                (org) => ({
                                                    value: org.organizationid,
                                                    label: org.name,
                                                })
                                            ),
                                        },
                                        {
                                            label: "Outsourcing Organization",
                                            name: "outsourcingorgid",
                                            type: "select",
                                            options: organizations.map(
                                                (org) => ({
                                                    value: org.organizationid,
                                                    label: org.name,
                                                })
                                            ),
                                        },
                                    ].map(({ label, name, type, options }) => (
                                        <div key={name}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {label}
                                            </label>
                                            {type === "textarea" ? (
                                                <textarea
                                                    name={name}
                                                    value={updatedProject[name]}
                                                    onChange={handleChange}
                                                    className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    rows={3}
                                                />
                                            ) : type === "select" ? (
                                                <select
                                                    name={name}
                                                    value={updatedProject[name]}
                                                    onChange={handleChange}
                                                    className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                >
                                                    <option value="">
                                                        Select {label}
                                                    </option>
                                                    {options.map((option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={type}
                                                    name={name}
                                                    value={updatedProject[name]}
                                                    onChange={handleChange}
                                                    className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <Link
                                        to="/add-organization"
                                        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Add Organization
                                    </Link>
                                    <div className="flex justify-end gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsUpdateModalOpen(false)
                                            }
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
                            </div>
                        </div>
                    </div>
                )}
                <section className="pt-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Project Media
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
                            {projectImages.length > 0 ? (
                                projectImages.map((image) => (
                                    <div
                                        key={image.imageid}
                                        className="border rounded overflow-hidden"
                                    >
                                        <img
                                            src={`http://localhost:5000${image.imageurl}`}
                                            alt={
                                                image.caption || "Project image"
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
                            {projectAttachments.length > 0 ? (
                                projectAttachments.map((attachment) => (
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
            </section>
        </main>
    );
};
