// src/pages/AppliedJobs.jsx
import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { apiRequest, updateURl } from '../utils';

const AppliedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const response = await apiRequest.get("/jobs/applied-jobs");
                if (response.status === 200) {
                    setJobs(response.data.data);
                } else {
                    console.error("Failed to fetch applied jobs:", response.data);
                }
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppliedJobs();
    }, []);

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="w-full flex flex-wrap gap-16 max-[600px]:justify-center pt-8 pl-4">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <JobCard key={job._id} data={job} />
                        ))
                    ) : (
                        <p>No jobs applied yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppliedJobs;
