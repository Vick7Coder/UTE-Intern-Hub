import React from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";

const SeekerCard = ({ seeker }) => {
    return (
        <div className="w-full flex items-center justify-between bg-white shadow-md rounded p-4">
            <div className="flex items-center space-x-4 w-1/3">
                <Link to={`/user-profile/${seeker?._id}`} className="flex items-center space-x-4">
                    <img
                        src={seeker?.profileUrl ?? NoProfile}
                        alt={seeker?.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <p className="text-base font-semibold text-gray-600 truncate">
                            {seeker?.name}
                        </p>
                        <span className="text-sm text-blue-600 truncate">{seeker?.email}</span>
                    </div>
                </Link>
            </div>

            <div className="w-1/4 truncate">
                <p className="text-base text-gray-600">{seeker?.location || "N/A"}</p>
            </div>

            <div className="w-1/4 truncate">
                <p className="text-base text-gray-600">{seeker?.stuId || "N/A"}</p>
            </div>

            <div className="w-1/6 text-center">
                <p className="text-blue-600 font-semibold">{seeker?.appliedJobs?.length || 0}</p>
                <span className="text-xs text-gray-600">Jobs Applied</span>
            </div>
        </div>
    );
};

export default SeekerCard;