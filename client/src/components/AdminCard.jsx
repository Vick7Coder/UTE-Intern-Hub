import React from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";

const AdminCard = ({ admin }) => {
  return (
    <div className="w-full h-16 flex gap-4 items-center justify-between bg-white shadow-md rounded">
      <Link to={`/admin-profile/${admin?._id}`}>
        <div className="w-3/4 md:w-2/4 flex gap-4 items-center pl-3">
          <img
            src={admin?.profileUrl ?? NoProfile}
            alt={admin?.name}
            className="w-8 md:w-12 h-8 md:h-12 rounded"
          />
          <div className="h-full flex flex-col">
            <p className="text-base md:text-lg font-semibold text-gray-600 truncate">
              {admin?.name || "N/A"}
            </p>
            <span className="text-sm text-blue-600">{admin?.email || "N/A"}</span>
          </div>
        </div>
      </Link>
      <div className="hidden w-1/4 h-full md:flex items-center">
        <p className="text-base text-start">{admin?.location || "N/A"}</p>
      </div>
      <div className="max-[340px]:hidden w-1/4 h-full md:flex flex-col items-center md:mt-[20px] text-center">
        <p className="text-blue-600 font-semibold">{admin?.contact || "N/A"}</p>
        <span className="text-xs md:text-base font-normal text-gray-600">
          Contact
        </span>
      </div>
    </div>
  );
};

export default AdminCard;