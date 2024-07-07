import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import BlogCard from "../components/BlogCard";
import { apiRequest, updateURlblog } from "../utils";
import { toast } from "react-toastify";
import { Header, SortBox, CustomButton, Loading } from '../components';

const FindBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sort, setSort] = useState("Newest");
    const [page, setPage] = useState(1);
    const [numPage, setNumPage] = useState(1);
    const [recordCount, setRecordCount] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const fetchBlogs = async (reset = false) => {
        setIsLoading(true);
        try {
            const newUrl = updateURlblog({
                pageNum: page,
                query: searchQuery,
                sort: sort,
                navigate: navigate,
                location: location
            });

            const response = await apiRequest({
                url: "/blogs/find-blogs" + newUrl,
                method: "GET",
            });
            console.log("API URL:", "/blogs/find-blogs" + newUrl);
            if (response.status === 200) {
                setBlogs(prevBlogs => reset ? response.data.data : [...prevBlogs, ...response.data.data]);
                setNumPage(response.data.numOfPage);
                setRecordCount(response.data.totalBlogs);
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

    useEffect(() => {
        setPage(1);
        fetchBlogs(true);
    }, [searchQuery, sort]);

    useEffect(() => {
        if (page === 1) {
            fetchBlogs(true);
        } else {
            fetchBlogs();
        }
    }, [page]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchBlogs(true);
    };

    const handleShowMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    return (
        <>
            <Header
                title='Discover Insightful Blogs'
                type='Home'
                handleClick={handleSearchSubmit}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <div className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <p className="text-base mb-2 sm:mb-0">
                            Total number of blogs: <span className="font-semibold">{recordCount}</span>
                        </p>

                        <div className="flex items-center gap-2">
                            <p className="text-base">Sort By:</p>
                            <SortBox sort={sort} setSort={setSort} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                        {blogs.map((blog, index) => (
                            <BlogCard key={`${blog._id}-${index}`} data={blog} />
                        ))}
                    </div>

                    {isLoading && (
                        <div className='py-10 flex justify-center'>
                            <Loading />
                        </div>
                    )}

                    {numPage > page && !isLoading && (
                        <div className="flex justify-center mt-10">
                            <CustomButton
                                onClick={handleShowMore}
                                title="Load More"
                                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FindBlogs;