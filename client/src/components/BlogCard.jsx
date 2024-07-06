import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ data }) => {
    return (
        <Link to={`/blog-details/${data?._id}`}>
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
                <div className="py-2 flex-1">
                    <p className="text-sm break-words text-justify overflow-hidden overflow-ellipsis h-full">
                        {data?.content?.slice(0, 120) + "..."}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
