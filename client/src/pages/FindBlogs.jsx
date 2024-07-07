import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";  // Đảm bảo bạn đã nhập đúng đường dẫn
import { apiRequest } from "../utils"; // Đảm bảo bạn đã nhập đúng đường dẫn
import { toast } from "react-toastify"; // Đảm bảo bạn đã nhập đúng đường dẫn

const FindBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await apiRequest({
                    url: "/blogs/find-blogs", 
                    method: "GET",
                });
                if (response.status === 200) {
                    setBlogs(response.data);
                } else {
                    toast.error("Failed to fetch blogs.");
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
                toast.error("Something went wrong.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="w-full flex flex-wrap gap-16 max-[600px]:justify-center pt-8 pl-4">
                    {blogs.map((blog) => (
                        <BlogCard key={blog._id} data={blog} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FindBlogs;

