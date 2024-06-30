import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ data }) => {
    return (
        <Link to={`/blog-details/${data?._id}`}>
            <div className="max-[600px] w-full w-[17rem] xl:w-[20rem] 2xl:w-[18rem] bg-white flex flex-col shadow-lg rounded-md px-3 py-5 gap-4">
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

export default BlogCard;
