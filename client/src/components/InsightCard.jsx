import React from "react";
import { Link } from "react-router-dom";
import removeMd from "remove-markdown";
import { format } from 'date-fns';

const InsightCard = ({ data }) => {
    // Hàm để loại bỏ Markdown và cắt ngắn nội dung
    const getPlainTextContent = (content) => {
        const plainText = removeMd(content || "");
        return plainText.length > 120 ? plainText.slice(0, 120) + "..." : plainText;
    };

    // Hàm để định dạng ngày tháng và giờ
    const formatDateTime = (date) => {
        return format(new Date(date), 'dd/MM/yyyy HH:mm');
    };

    return (
        <Link to={`/insight-details/${data?._id}`}>
            <div className="w-[17rem] xl:w-[20rem] 2xl:w-[18rem] h-[12rem] bg-white flex flex-col shadow-lg rounded-md px-3 py-5 gap-4 overflow-hidden relative">
                <div>
                    <p className="text-lg font-semibold">
                        {data?.title?.length > 20
                            ? data?.title.slice(0, 20) + "..."
                            : data?.title}
                    </p>
                </div>

                <div className="py-2 flex-grow">
                    <p className="text-sm break-all text-justify">
                        {getPlainTextContent(data?.content)}
                    </p>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                    <span>
                        {formatDateTime(data?.createdAt)}
                    </span>
                    {data?.admin?.name && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full">
                            {data.admin.name}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default InsightCard;