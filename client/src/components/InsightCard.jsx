import React from "react";
import { Link } from "react-router-dom";

const InsightCard = ({ data }) => {
    return (
        <Link to={`/insight-details/${data?._id}`}>
            <div className="w-[17rem] xl:w-[20rem] 2xl:w-[18rem] h-[12rem] bg-white flex flex-col shadow-lg rounded-md px-3 py-5 gap-4 overflow-hidden">
                <div className="flex gap-5">

                    <div>
                        <p className="text-lg font-semibold">
                            {data?.title?.length > 20
                                ? data?.title.slice(0, 20) + "..."
                                : data?.title}
                        </p>
                    </div>
                </div>

                <div className="py-2">
                    <p className="text-sm break-all text-justify">
                        {data?.content?.slice(0, 120) + "..."}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default InsightCard;
