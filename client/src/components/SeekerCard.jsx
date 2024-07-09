import React from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { useSelector } from "react-redux";
import { CustomButton } from ".";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";

const SeekerCard = ({ seeker, onSeekerRemoved }) => {
    const { user } = useSelector((state) => state.user);

    const removeSeekerFromLecturer = async () => {
        try {
            const result = await apiRequest({
                url: '/lecturer/remove-seeker',
                token: user?.token,
                data: { seekerId: seeker?._id },
                method: "POST"
            });

            if (result.status === 200) {

                window.location.reload();
                toast.success("Seeker removed from your student list successfully");
                if (onSeekerRemoved) onSeekerRemoved(seeker?._id);
            } else {
                toast.error(result.message || "Failed to remove seeker from student list");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred while processing your request");
        }
    };

    return (
        <div className="w-full flex items-center justify-between bg-white shadow-md rounded p-4">
            <div className="flex items-center space-x-4 w-1/6">
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
            <div className="w-1/6 truncate">
                <p className="text-base text-gray-600">{seeker?.location || "N/A"}</p>
            </div>
            <div className="w-1/6 truncate">
                <p className="text-base text-gray-600">{seeker?.stuId || "N/A"}</p>
            </div>
            <div className="w-1/6 truncate">
                <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${seeker?.isAssignedToLecturer ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <p className={`text-sm font-semibold ${seeker?.isAssignedToLecturer ? 'text-green-500' : 'text-yellow-500'}`}>
                        {seeker?.isAssignedToLecturer ? 'In Class' : 'Pending'}
                    </p>
                </div>
            </div>
            <div className="w-1/6 text-center">
                <p className="text-blue-600 font-semibold">{seeker?.appliedJobs?.length || 0}</p>
                <span className="text-xs text-gray-600">Jobs Applied</span>
            </div>
            {user?.accountType === "lecture" && (
                <div className="w-1/6 text-center">
                    <CustomButton
                        onClick={removeSeekerFromLecturer}
                        title="Clear"
                        containerStyles="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-600 hover:to-red-800 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    />
                </div>
            )}
        </div>
    );
};

export default SeekerCard;