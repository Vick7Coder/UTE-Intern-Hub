import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminCard, CustomButton, Header, Loading, SortBox, AdminRegisterForm, StyledButton } from "../components";
import { apiRequest, updateURl } from "../utils";

const Admins = () => {
    const [page, setPage] = useState(1);
    const [numPage, setNumPage] = useState(1);
    const [recordsCount, setRecordsCount] = useState(0);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [adminLocation, setAdminLocation] = useState("");
    const [sort, setSort] = useState("Newest");
    const [isFetching, setIsFetching] = useState(false);
    const [openRegisterForm, setOpenRegisterForm] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setPage(1);  // Reset page to 1
        await fetchingAdmins();
    };

    const handleShowMore = async (e) => {
        e.preventDefault();
        setPage((prev) => prev + 1);
    };

    const fetchingAdmins = async () => {
        setIsFetching(true);

        const newURL = updateURl({
            pageNum: page,
            query: searchQuery,
            cmpLoc: adminLocation,
            sort: sort,
            navigate: navigate,
            location: location,
        });

        try {
            const res = await apiRequest({
                url: newURL,
                method: "GET",
            });
            console.log(res);

            setNumPage(res.data.numOfPage);
            setRecordsCount(res.data.total);

            // Always replace the entire data set
            setData(res.data.admins);

            setIsFetching(false);
        } catch (err) {
            console.log(err);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchingAdmins();
    }, [page]);

    useEffect(() => {
        if (page !== 1) {
            setPage(1);
        } else {
            fetchingAdmins();
        }
    }, [sort]);

    return (
        <div className='w-full'>
            <Header
                title='Our Administrative Team'
                type
                handleClick={handleSearchSubmit}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                location={adminLocation}
                setLocation={setAdminLocation}
            />

            <div className='container mx-auto flex flex-col gap-5 2xl:gap-10 px-5 py-6'>
                <div className='flex items-center justify-between mb-4'>
                    <p className='text-sm md:text-base'>
                        Total number of admins: <span className='font-semibold'>{recordsCount}</span> Available
                    </p>
                    <StyledButton
                        onClick={() => setOpenRegisterForm(true)}
                        title='+ New'
                        containerStyles=""
                    />

                    <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
                        <p className='text-sm md:text-base'>Sort By:</p>
                        <SortBox sort={sort} setSort={setSort} />
                    </div>
                </div>



                <div className='w-full flex flex-col gap-6'>
                    {data && data.length > 0 ? (
                        data.map((admin, index) => (
                            <AdminCard admin={admin} key={admin._id || index} />
                        ))
                    ) : (
                        <p>No admins available</p>
                    )}
                    <p className='text-sm text-right'>
                        {data?.length} records out of {recordsCount}
                    </p>
                </div>

                {isFetching && (
                    <div className='py-10'>
                        <Loading />
                    </div>
                )}

                {numPage > page && !isFetching && (
                    <div className='w-full flex items-center justify-center pt-16'>
                        <CustomButton
                            onClick={handleShowMore}
                            title='Load More'
                            containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
                        />
                    </div>
                )}
            </div>

            <AdminRegisterForm open={openRegisterForm} setOpen={setOpenRegisterForm} />
        </div>
    );
};

export default Admins;