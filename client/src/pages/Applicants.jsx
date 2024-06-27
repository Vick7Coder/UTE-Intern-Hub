import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../utils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { NoProfile } from "../assets";
import { JobCard } from "../components";


const Applicants = () => {
  const { id } = useParams();

  const { user } = useSelector((state) => state.user);

  const [jobData, setJobData] = useState(null);
  const [similarJobPost, setSimilarJobPost] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [applicantData, setApplicantData] = useState([]);

  const getJobData = async () => {
    const result = await apiRequest({
      url: `/jobs/get-job-detail/${id}`,
      method: "GET",
    });

    if (result.status === 200) {
      setJobData(result.data.data);
      setApplicants(result.data.data.applicants);
      setSimilarJobPost(result.data.similarJobs);
    } else {
      console.log(result);
      toast.error("Something Went Wrong! ");
    }
  };

  const userProfile = async () => {
    try {
      //here using map with async functions, we end up with an array of promises.
      //so we need to await them all together to get the results.
      //thats why we  are use Promise.all

      let profile = await Promise.all(
        applicants.map(async (userId) => {
          return await apiRequest({
            url: `/user/get-user-profile/${userId}`,
            token: user.token,
            method: "GET",
          });
        })
      );
    
      setApplicantData(profile);
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    getJobData();
  }, [id]);

  useEffect(() => {
   
      userProfile();
  }, [applicants]);

  return (
    <div className="container mx-auto">
      <div className="w-full flex flex-col md:flex-row gap-8 md:gap-7">
        {jobData && applicantData && (
          <div className="w-full h-fit md:w-2/3 2xl:w-2/4 bg-white px-5 py-8 md:px-10  shadow-md ">
              <div className="w-full flex items-center justify-between">
                <div className="w-3/4 flex gap-2">
                  <img
                    src={jobData.company.profileUrl ?? NoProfile}
                    alt={jobData.company.name}
                    className="w-20 h-20 md:w-24 md:h-20 rounded"
                  />
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold text-gray-600">
                      {jobData.jobTitle}
                    </p>
                    <span className="text-base">{jobData.location}</span>
                    <span className="text-base text-blue-600">
                      {jobData.company.name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {moment(jobData.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="">
                  <AiOutlineSafetyCertificate className="text-3xl text-blue-500" />
                </div>
              </div>
              <div className="w-full flex flex-wrap md:flex-row gap-x-2 gap-y-7 items-center justify-center md:justify-between mt-10 mb-6">
                <div className="bg-[#bdf4c8] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm">Full Gross</span>
                  <p className="text-lg font-semibold text-gray-700 uppercase">
                  {jobData.salary.includes("-")
                    ? `${jobData.salary} VND`
                    : `${jobData.salary} VND`}
                  </p>
                </div>
                <div className="bg-[#bae5f4] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm">Job Type</span>
                  <p className="text-lg font-semibold text-gray-700">
                    {jobData.jobType}
                  </p>
                </div>
                <div className="bg-[#cecdff] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm">No. of Vacancies</span>
                  <p className="text-lg font-semibold text-gray-700">
                    {jobData.vacancies}
                  </p>
                </div>
                <div className="bg-[#c2c387bf] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm">Experience</span>
                  <p className="text-lg font-semibold text-gray-700 capitalize">
                    {jobData.experience}
                  </p>
                </div>
              </div>
        

            <p className="text-gray-500 font-semibold my-3">Applicants </p>
            <div className='w-full flex flex-col gap-6'>
            {
              applicantData.map((profile)=>(

                profile?.data && (

                  <div className="w-full h-16 flex gap-4 items-center justify-between bg-white shadow-md rounded px-3" key={profile.data.user._id}>

                  <Link to={`/user-profile/${profile.data.user._id}`}>
                  <div className="w-3/4 md:w-2/4 flex gap-4 items-center ">
                    <img
                      src={profile.data.user.profileUrl ?? NoProfile}
                      alt={profile.data.user.name}
                      className="w-8 md:w-12 h-8 md:h-12 rounded"
                    />
                  
                  <div className="h-full flex flex-col">
          
                    <p
                      className="text-base md:text-lg font-semibold text-gray-600 truncate capitalize"
                    >
                      {profile.data.user.name} </p>
                   
                    <span className="text-sm text-blue-600">{profile.data.user.email}</span>
                  </div>
                </div>
                  </Link>

                  <div className="hidden sm:block text-center">
                    <p>{profile.data.user.headLine ?? "No Headline"}</p>
                  </div>

                  <div>
                  <p className='max-[360px]:hidden bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-1.5 rounded font-semibold text-sm'> {moment(profile.data.user.createdAt).fromNow()}</p>
                  </div>
              </div>

                )
              ))
            }
  </div>

          </div>
          
        )}

          <div className="w-full md:w-1/3 2xl:w-2/4 md:h-[60rem] md:overflow-y-scroll md:no-scrollbar ">
            <div className=" px-5 md:py-5 md:pr-5 ">
              <p className="text-gray-500 font-semibold mb-2">
                Similar Job Post
              </p>

              <div className="w-full flex flex-wrap gap-4">
                {similarJobPost?.slice(0, 6).map((job) => {
                  const data = {
                    name: job.company.name,
                    logo: job.company.profileUrl,
                    ...job,
                  };
                  return<JobCard data={data} key={job._id} user={true}/>;
                })}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Applicants;
