import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import InsightUpdateForm from "../components/InsightUpdateForm";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaEdit, FaTrash, FaClock, FaUser } from 'react-icons/fa';

const InsightDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [insightData, setInsightData] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchInsightDetails = async () => {
        setIsLoading(true);
        try {
            const response = await apiRequest({
                url: `/insights/get-insight-detail/${id}`,
                method: "GET",
            });
            if (response.status === 200) {
                setInsightData(response.data);
            } else {
                toast.error("Failed to fetch insight details.");
            }
        } catch (error) {
            console.error("Error fetching insight details:", error);
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInsightDetails();
    }, [id]);

    const handleDeleteInsight = async () => {
        if (window.confirm("Delete Insight Post?")) {
            try {
                const response = await apiRequest({
                    url: `/insights/delete-insight/${id}`,
                    method: "DELETE",
                    token: user.token,
                });
                if (response.status === 200) {
                    toast.success("Insight deleted successfully");
                    navigate("/insights");
                } else {
                    toast.error("Failed to delete insight.");
                }
            } catch (error) {
                console.error("Error deleting insight:", error);
                toast.error("Something went wrong.");
            }
        }
    };

    const handleCloseEditForm = () => {
        setIsEditOpen(false);
    };

    const canEdit = user?.accountType === "admin";

    return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : !insightData ? (
                        <div className="p-8 text-center text-gray-600">Insight not found</div>
                    ) : (
                        <>
                            <div className="p-8 md:p-12 lg:p-16">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">{insightData.title}</h1>
                                <div className="flex items-center text-sm md:text-base text-gray-500 mb-10">
                                    <FaUser className="mr-2" />
                                    <span className="mr-4">{insightData?.admin?.name || 'Anonymous'}</span>
                                    <FaClock className="mr-2" />
                                    <span>{new Date(insightData.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="prose prose-lg md:prose-xl lg:prose-2xl max-w-none prose-img:mx-auto prose-img:block">
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            img: ({ node, ...props }) => (
                                                <div className="flex justify-center my-10">
                                                    <img {...props} className="max-w-full h-auto rounded-lg shadow-lg" />
                                                </div>
                                            )
                                        }}
                                    >
                                        {insightData.content}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {canEdit && (
                                <div className="bg-gray-50 px-8 md:px-12 lg:px-16 py-6 flex justify-end space-x-6">
                                    <button
                                        onClick={() => setIsEditOpen(true)}
                                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition duration-200 text-lg"
                                    >
                                        <FaEdit className="mr-3" />
                                    </button>
                                    <button
                                        onClick={handleDeleteInsight}
                                        className="flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition duration-200 text-lg"
                                    >
                                        <FaTrash className="mr-3" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <InsightUpdateForm
                open={isEditOpen}
                setOpen={handleCloseEditForm}
                insightDetails={insightData}
                onUpdate={fetchInsightDetails}
            />
        </div>
    );
};

export default InsightDetails;