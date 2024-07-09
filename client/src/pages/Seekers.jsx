import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SeekerCard, CustomButton, Header, Loading, SortBox } from "../components";
import { apiRequest, updateURl } from "../utils";
import { ltData } from "../redux/lecturerSlice";
import { useDispatch, useSelector } from "react-redux";

const Seekers = () => {
    const { user } = useSelector((state) => state.user);
    const [page, setPage] = useState(1);
    const [numPage, setNumPage] = useState(1);
    const [recordsCount, setRecordsCount] = useState(0);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [seekerLocation, setSeekerLocation] = useState("");
    const [sort, setSort] = useState("Newest");
    const [isFetching, setIsFetching] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setPage(1);
        await fetchingSeekers(1, sort);
    };

    const handleShowMore = async (e) => {
        e.preventDefault();
        setPage((prev) => prev + 1);
    };

    const fetchingSeekers = async (pageNum = page, sortOption = sort) => {
        setIsFetching(true);

        const newURL = updateURl({
            pageNum: pageNum,
            query: searchQuery,
            cmpLoc: seekerLocation,
            sort: sortOption,
            navigate: navigate,
            location: location,
        });

        try {
            const res = await apiRequest({
                url: newURL,
                token: user.token,
                method: "GET"
            });

            if (pageNum === 1) {
                setData(res.data.seekers);
            } else {
                setData((prev) => [...prev, ...res.data.seekers]);
            }
            setNumPage(res.data.numOfPage);
            setRecordsCount(res.data.total);
            setIsFetching(false);
        }
        catch (err) {
            console.log(err);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchingSeekers(page, sort);
    }, [page, sort]);

    return (
        <div className='w-full'>
            <Header
                title='Discover Talented Job Seekers!'
                type
                handleClick={handleSearchSubmit}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                location={seekerLocation}
                setLocation={setSeekerLocation}
            />

            <div className='container mx-auto flex flex-col gap-5 2xl:gap-10 px-5 py-6'>
                <div className='flex items-center justify-between mb-4'>
                    <p className='text-sm md:text-base'>
                        Total number of seekers: <span className='font-semibold'>{recordsCount}</span> Seekers
                        Available
                    </p>

                    <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
                        <p className='text-sm md:text-base'>Sort By:</p>

                        <SortBox sort={sort} setSort={setSort} />
                    </div>
                </div>

                <div className='w-full flex flex-col gap-6'>
                    {data?.map((seeker, index) => (
                        <SeekerCard seeker={seeker} key={index} />
                    ))}

                    <p className='text-sm text-right'>
                        {data?.length} records out of {recordsCount}
                    </p>
                </div>

                {isFetching && (
                    <div className='py-10'>
                        <Loading />
                    </div>
                )}

                {numPage > page && (
                    <div className='w-full flex items-center justify-center pt-16'>
                        <CustomButton
                            onClick={handleShowMore}
                            title='Load More'
                            containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Seekers;