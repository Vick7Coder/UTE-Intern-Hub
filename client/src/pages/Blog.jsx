import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CompanyCard, CustomButton, Header, Loading, SortBox } from "../components";
import { apiRequest, updateURl } from "../utils";
// copy companies
const Blog = () => {
    const [page, setPage] = useState(1);
    const [numPage, setNumPage] = useState(1);
    const [recordsCount, setRecordsCount] = useState(0);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [cmpLocation, setCmpLocation] = useState("");
    const [sort, setSort] = useState("Newest");
    const [isFetching, setIsFetching] = useState(false);


    const navigate = useNavigate();
    const location = useLocation();



    const handleSearchSubmit = async (e) => {

        e.preventDefault();

        await fetchingBlog();
    }

    const handleShowMore = async (e) => {
        e.preventDefault();
        setPage((prev) => prev + 1)
    };


    const fetchingBlog = async () => {

        setIsFetching(true)


        const newURL = updateURl({
            pageNum: page,
            query: searchQuery,
            cmpLoc: cmpLocation,
            sort: sort,
            navigate: navigate,
            location: location,
        })

        try {


            const res = await apiRequest({
                url: newURL,
                method: "GET"
            })

            // console.log(res)
            setNumPage(res.data.numOfPage);
            setRecordsCount(res.data.total);
            setData(res.data.Blog)

            setIsFetching(false)
        }
        catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        fetchingBlog();
    }, [page, sort])

    return (
        <div className='w-full '>

            <Header
                title='Where Academic Brilliance Meets Real-World Experience!'
                type
                handleClick={handleSearchSubmit}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                location={cmpLocation}
                setLocation={setCmpLocation}
            />

            <div className='container mx-auto flex flex-col gap-5 2xl:gap-10 px-5  py-6'>
                <div className='flex items-center justify-between mb-4'>
                    <p className='text-sm md:text-base'>
                        Total number of jobs: <span className='font-semibold'>{recordsCount}</span> Blog
                        Available
                    </p>

                    <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
                        <p className='text-sm md:text-base'>Sort By:</p>

                        <SortBox sort={sort} setSort={setSort} />
                    </div>
                </div>


                <div className='w-full flex flex-col gap-6'>
                    {data?.map((cmp, index) => (

                        <CompanyCard cmp={cmp} key={index} />
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

export default Blog;
