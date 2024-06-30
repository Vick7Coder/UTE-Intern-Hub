import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import BlogUpdateForm from "../components/BlogUpdateForm"; // Import BlogUpdateForm

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user); // Get user info from Redux store
    const [blogData, setBlogData] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false); // State to manage edit modal visibility

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await apiRequest({
                    url: `/blogs/get-blog-detail/${id}`, // Adjust endpoint as per your backend
                    method: "GET",
                });
                if (response.status === 200) {
                    setBlogData(response.data); // Save blog data to state
                } else {
                    toast.error("Failed to fetch blog details.");
                }
            } catch (error) {
                console.error("Error fetching blog details:", error);
                toast.error("Something went wrong.");
            }
        };

        fetchBlogDetails();
    }, [id]);

    const handleDeleteBlog = async () => {
        if (window.confirm("Delete Blog Post?")) {
            try {
                const response = await apiRequest({
                    url: `/blogs/delete-blog/${id}`, // Adjust endpoint as per your backend
                    method: "DELETE",
                    token: user.token, // Pass token if needed
                });
                if (response.status === 200) {
                    toast.success("Blog deleted successfully");
                    navigate("/"); // Navigate to home or other page after successful deletion
                } else {
                    toast.error("Failed to delete blog.");
                }
            } catch (error) {
                console.error("Error deleting blog:", error);
                toast.error("Something went wrong.");
            }
        }
    };

    useEffect(() => {
        console.log('User:', user); // Debug log for user data
        console.log('Blog Data:', blogData); // Debug log for blog data
    }, [user, blogData]);

    if (!blogData) {
        return <div>Loading...</div>; // Show loading while fetching data
    }

    // Check if the logged-in user is a recruiter/company and the author of the blog
    const canEdit = user?.accountType === "company" && blogData?.recruiter?._id === user?.id;

    return (
        <div className="container mx-auto">
            <div className="w-full bg-white px-5 py-10 shadow-md">
                <div className="my-6">
                    <p className="text-2xl font-semibold">{blogData?.title}</p>
                    <div className="text-base mt-4">{blogData?.content}</div>
                </div>
                {canEdit && (
                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Edit Blog
                        </button>
                        <button
                            onClick={handleDeleteBlog}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete Blog
                        </button>
                    </div>
                )}
            </div>

            {/* Render BlogUpdateForm modal */}
            <BlogUpdateForm
                open={isEditOpen}
                setOpen={setIsEditOpen}
                blogDetails={() => {
                    // Callback to refresh blog details after update
                    const fetchBlogDetails = async () => {
                        try {
                            const response = await apiRequest({
                                url: `/blogs/get-blog-detail/${id}`,
                                method: "GET",
                            });
                            if (response.status === 200) {
                                setBlogData(response.data);
                            } else {
                                toast.error("Failed to fetch blog details.");
                            }
                        } catch (error) {
                            console.error("Error fetching blog details:", error);
                            toast.error("Something went wrong.");
                        }
                    };
                    fetchBlogDetails();
                }}
            />
        </div>
    );
};

export default BlogDetails;
