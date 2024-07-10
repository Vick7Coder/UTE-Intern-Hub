import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import InsightUpdateForm from "../components/InsightUpdateForm"; // Import InsightUpdateForm

const InsightDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user); // Get user info from Redux store
    const [insightData, setInsightData] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false); // State to manage edit modal visibility

    useEffect(() => {
        const fetchInsightDetails = async () => {
            try {
                const response = await apiRequest({
                    url: `/insights/get-insight-detail/${id}`, // Adjust endpoint as per your backend
                    method: "GET",
                });
                if (response.status === 200) {
                    setInsightData(response.data); // Save insight data to state
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
                    url: `/insights/delete-insight/${id}`, // Adjust endpoint as per your backend
                    method: "DELETE",
                    token: user.token, // Pass token if needed
                });
                if (response.status === 200) {
                    toast.success("Insight deleted successfully");
                    navigate("/"); // Navigate to home or other page after successful deletion
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
        console.log('User:', user); // Debug log for user data
        console.log('Insight Data:', insightData); // Debug log for insight data
    }, [user, insightData]);

    if (!insightData) {
        return <div>Loading...</div>; // Show loading while fetching data
    }

    // Check if the logged-in user is a recruiter/company and the author of the insight

    // const canEdit = user?.accountType === "company" && insightData?.recruiter?._id === user?.id;
    const canEdit = user?.accountType === "admin";
    return (
        <div className="container mx-auto">
            <div className="w-full bg-white px-5 py-10 shadow-md">
                <div className="my-6">
                    <p className="text-2xl font-semibold">{insightData?.title}</p>
                    <div className="text-base mt-4">{insightData?.content}</div>
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

            {/* Render InsightUpdateForm modal */}
            <InsightUpdateForm
                open={isEditOpen}
                setOpen={setIsEditOpen}
                insightDetails={() => {
                    // Callback to refresh insight details after update
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
