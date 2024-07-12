import React from "react";
import { Link } from "react-router-dom";
import removeMd from "remove-markdown";
import { format } from 'date-fns';

const InsightCard = ({ data }) => {
    const getPlainTextContent = (content) => {
        let plainText = removeMd(content || "");
        plainText = plainText.replace(/\S+\.(jpg|jpeg|png|gif|bmp|webp)\b/gi, '');
        plainText = plainText.replace(/\s+/g, ' ').trim();
        return plainText.length > 100 ? plainText.slice(0, 100) + "..." : plainText;
    };

    const formatDateTime = (date) => {
        return format(new Date(date), 'dd/MM/yyyy HH:mm');
    };

    return (
        <Link to={`/insight-details/${data?._id}`}>
            <div className="w-[17rem] xl:w-[20rem] 2xl:w-[18rem] h-[12rem] bg-white flex flex-col shadow-lg rounded-md px-3 py-3 overflow-hidden">
                <div className="mb-2">
                    <p className="text-lg font-semibold truncate">
                        {data?.title}
                    </p>
                </div>

                <div className="flex-grow overflow-hidden">
                    <p className="text-sm text-gray-600 line-clamp-3">
                        {getPlainTextContent(data?.content)}
                    </p>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2">
                    <span>
                        {formatDateTime(data?.createdAt)}
                    </span>
                    {data?.admin?.name && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full truncate max-w-[50%]">
                            {data.admin.name}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default InsightCard;