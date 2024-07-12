import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { CustomButton, SearchInput } from "./";

const HeaderNoLocation = ({
    title,
    type,
    handleClick,
    searchQuery,
    setSearchQuery
}) => {
    return (
        <div className="bg-[#f7fdfd]">
            <div
                className={`container mx-auto px-5 ${type ? "h-[300px]" : "h-[200px]"} flex items-center relative`}
            >
                <div className="w-full z-10 mb-4">
                    <div className="mb-6">
                        <p className="text-slate-700 font-bold text-4xl sm:w-[64%] lg:w-full"
                            style={{ color: "#0047AB", textAlign: "center", textTransform: "uppercase" }}>{title}</p>
                    </div>

                    <div className="w-full flex items-center justify-around bg-white px-2 md:px-5 py-2.5 md:py-6 shadow-2xl rounded-full">
                        <SearchInput
                            placeholder="Enter your keywords"
                            icon={<AiOutlineSearch className="text-gray-600 text-2xl" />}
                            value={searchQuery}
                            setValue={setSearchQuery}
                        />

                        <div>
                            <CustomButton
                                onClick={handleClick}
                                title="Search"
                                containerStyles={
                                    "text-white py-2 md:py3 px-3 md:px-10 focus:outline-none transition ease-in-out duration-500 bg-blue-400 hover:bg-blue-900 rounded-full md:rounded-md text-sm md:text-base"
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderNoLocation;