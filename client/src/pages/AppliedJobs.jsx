import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppliedJobCard } from "../components";
import { apiRequest } from "../utils";

const AppliedJobs = () => {
    const { user } = useSelector((state) => state.user);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await apiRequest({
                    url: `/user/applied-jobs/${user?.id}`,
                    method: "GET",
                    token: user?.token,
                });

                if (result.data?.success) {
                    setAppliedJobs(result.data.appliedJobs || []);
                    console.log("Applied Jobs Data:", result.data.appliedJobs); 
                } else {
                    setError(result.data?.message || "Failed to fetch applied jobs");
                }
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
                setError("An error occurred while fetching applied jobs");
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id && user?.token) {
            fetchAppliedJobs();
        }
    }, [user?.id, user?.token]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='container mx-auto p-5'>
            <h2 className='text-2xl font-semibold mb-4'>APPLIED JOBS</h2>
            <br />
            {appliedJobs.length === 0 ? (
                <p className='text-gray-600'>You haven't applied to any jobs yet.</p>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {appliedJobs.map((job) => (
                        <AppliedJobCard key={job._id} data={job} />
                    ))}
                </div>
            )}
            <br /><br /> <br /><br /><br /><br />
        </div>
    );
};

export default AppliedJobs;
