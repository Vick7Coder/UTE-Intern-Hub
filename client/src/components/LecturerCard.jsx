import React from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";

const LecturerCard = ({ lec }) => {
  return (
    <div className="w-full h-16 flex gap-4 items-center justify-between bg-white shadow-md rounded">
      <Link to={`/lecturer-profile/${lec?._id}`}>
        <div className="w-3/4 md:w-2/4 flex gap-4 items-center pl-3">
          <img
            src={lec?.profileUrl ?? NoProfile}
            alt={lec?.name}
            className="w-8 md:w-12 h-8 md:h-12 rounded"
          />

          <div className="h-full flex flex-col">
            <p className="text-base md:text-lg font-semibold text-gray-600 truncate">
              {lec?.name}
            </p>
            <span className="text-sm text-blue-600">{lec?.email}</span>
          </div>
        </div>
      </Link>

      <div className="hidden w-1/4 h-full md:flex items-center">
        <p className="text-base text-start">{lec?.location}</p>
      </div>

      <div className="max-[340px]:hidden w-1/4 h-full md:flex flex-col items-center md:mt-[20px] text-center">
        <p className="text-blue-600 font-semibold">{lec?.studentLists?.length}</p>
        <span className="text-xs md:text-base font-normal text-gray-600">
          Students
        </span>
      </div>
    </div>
  );
};

export default LecturerCard;