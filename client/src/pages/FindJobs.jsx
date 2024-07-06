import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { experience, jobTypes } from "../utils/data";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import { Header, SortBox, JobCard, CustomButton, Loading } from '../components';
import { apiRequest, updateURl } from '../utils';


const FindJobs = () => {

  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [filterExp, setFilterExp] = useState([]);

  const [isFetching, setIsFetching] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();




  const filterJobs = (val) => {

    // we are checking, if the value is already exists in the state,and if we click again the ckeckbox (un tick), it removes it
    if (filterJobTypes?.includes(val)) {
      setFilterJobTypes(filterJobTypes.filter((el) => el != val));
    }

    else {
      setFilterJobTypes([...filterJobTypes, val]);
    }
  };




  const filterExperience = (val) => {
    if (filterExp?.includes(val)) {
      setFilterExp(filterExp.filter((el) => el != val));
    }

    else {
      setFilterExp([...filterExp, val]);
    }
  };

  const handleSearchSubmit = async (e) => {

    e.preventDefault();

    await fetchJobs();
  }

  const handleShowMore = async (e) => {

    e.preventDefault();

    setPage((prev) => prev + 1)
  }



  const fetchJobs = async () => {


    setIsFetching(true)

    const newURl = updateURl({
      pageNum: page,
      query: searchQuery,
      cmpLoc: jobLocation,
      sort: sort,
      navigate: navigate,
      location: location,
      jType: filterJobTypes,
      exp: filterExp

    })

    const result = await apiRequest({
      url: '/jobs/find-jobs' + newURl,
      method: "GET"
    })

    // console.log(result);

    if (result.status === 200) {

      setNumPage(result.data.numOfPage)
      setRecordCount(result.data.totalJobs)
      setData(result.data.data)
      setIsFetching(false)
    }

    else {
      console.log(result);
      setIsFetching(false)
      toast.error("Something Went Wrong")
    }
  }

  useEffect(() => {
    fetchJobs();
  },
    [sort, filterExp, filterJobTypes, page])



  return (
    <>
      <Header
        title='Where Academic Brilliance Meets Real-World Experience!'
        type='Home'
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={jobLocation}
        setLocation={setJobLocation}

      />

      <div className="container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 ">

        <div className="hidden md:flex flex-col w-1/6 h-fit bg-white shadow-xl px-3 rounded-md">
          <p className="text-lg font-semibold text-slate-600">Filter Search</p>

          <div className="py-2">
            <div className="flex justify-between mb-3">
              <p className="flex items-center gap-2 font-semibold">
                <BiBriefcaseAlt2 />
                Job Type
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {jobTypes.map((jType, index) => (
                <div key={index} className="flex gap-2 text-sm md:text-base items-center">
                  <input
                    type="checkbox"
                    value={jType}
                    className="w-4 h-4"
                    onChange={(e) => filterJobs(e.target.value)}
                  />
                  <span>{jType}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}

          <div className="py-2 mt-4">
            <div className="flex justify-between mb-3">
              <p className="flex items-center gap-2 font-semibold break-alls">
                <BsStars />
                Years of university study
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {experience.map(({ title, value }, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    value={value}
                    className="w-4 h-4"
                    onChange={(e) => filterExperience(e.target.value)}
                  />
                  <span>{title}</span>

                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-5/6 px-5 md:px-0">

          <div className="flex items-center justify-between flex-col sm:flex-row mb-4">
            <p className="text-base">
              Total number of jobs: <span className="font-semibold">{recordCount}</span> Jobs
              Available
            </p>

            <div className="flex gap-2 items-center ">
              <p className="text-base mt-[6px]">Sort By:</p>

              <SortBox sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-4 max-[600px]:justify-center">
            {data.map((job) => {

              let jobData = {
                name: job.company.name,
                logo: job.company.profileUrl,
                ...job
              }

              return <JobCard data={jobData} key={job._id} />
            })}
          </div>

          {isFetching && (
            <div className='py-10'>
              <Loading />
            </div>
          )}

          {numPage > page && (
            <div className="w-full flex items-center justify-center pt-16">
              <CustomButton
                onClick={handleShowMore}
                title="Load More"
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>

      </div>




    </>
  )
}

export default FindJobs