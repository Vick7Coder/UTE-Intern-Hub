import React from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets"; // Make sure this import is correct

const SeekerSquareCard = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
      <div className="w-24 h-24">
        <img
          src={data.profileUrl || NoProfile}
          alt={data.name}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <h3 className="mt-2 text-lg font-semibold">{data.name}</h3>
      <p className="text-gray-600">{data.email}</p>
      <p className="text-gray-600">{data.location}</p>
      <div className="mt-4 text-center">
        <span className="text-xl">{data.appliedJobs?.length || 0}</span>
        <p className="text-blue-600">Jobs Applied</p>
      </div>
    </div>
  );
};

export default SeekerSquareCard;