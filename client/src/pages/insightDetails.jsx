import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import InsightUpdateForm from "../components/InsightUpdateForm";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const InsightDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [insightData, setInsightData] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        const fetchInsightDetails = async () => {
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
            }
        };

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
                    navigate("/");
                } else {
                    toast.error("Failed to delete insight.");
                }
            } catch (error) {
                console.error("Error deleting insight:", error);
                toast.error("Something went wrong.");
            }
        }
    };

    useEffect(() => {
        console.log('User:', user);
        console.log('Insight Data:', insightData);
    }, [user, insightData]);

    if (!insightData) {
        return <div>Loading...</div>;
    }

    const canEdit = user?.accountType === "admin";

    return (
        <div className="container mx-auto">
            <div className="w-full bg-white px-5 py-10 shadow-md">
                <div className="my-6">
                    <p className="text-2xl font-semibold">{insightData?.title}</p>
                    <div className="text-base mt-4">
                        <ReactMarkdown
                            components={{
                                code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={solarizedlight}
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
                                }
                            }}
                        >
                            {insightData?.content}
                        </ReactMarkdown>
                    </div>
                </div>
                {canEdit && (
                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Edit Insight
                        </button>
                        <button
                            onClick={handleDeleteInsight}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete Insight
                        </button>
                    </div>
                )}
            </div>

            <InsightUpdateForm
                open={isEditOpen}
                setOpen={setIsEditOpen}
                insightDetails={() => {
                    const fetchInsightDetails = async () => {
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
                        }
                    };
                    fetchInsightDetails();
                }}
            />
            <br /><br /> <br /> <br /><br /><br /><br /><br /><br />
        </div>
    );
};

export default InsightDetails;