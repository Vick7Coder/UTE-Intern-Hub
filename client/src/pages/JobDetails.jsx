import React, { useEffect, useState } from "react";
import moment from "moment"; //for the job posted time

import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CustomButton, JobCard, JobUpdateForm } from "../components";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { NoProfile } from "../assets";

import { toast } from "react-toastify";

const JobDetails = () => {

  const { id } = useParams();

  const { user } = useSelector((state) => state.user);

  const [jobData, setJobData] = useState(null);

  const [selected, setSelected] = useState("0");
  const [similarJobs, setSimilarJobs] = useState([]);
  const [openForm, setOpenForm] = useState(false)



  const getJobDetails = async () => {
    const result = await apiRequest({
      url: `/jobs/get-job-detail/${id}`,
      method: "GET",
    });

    if (result.status === 200) {
      setJobData(result.data.data);
      setSimilarJobs(result.data.similarJobs);
    }
    else {
      console.log(result)
      toast.error('Something Went Wrong')
    }
  };

  //job apply
  const handleJobApply = async () => {

    const result = await apiRequest({
      url: `/user/apply-job/${id}`,
      token: user.token,
      method: "POST"
    })

    if (result.status === 200) {
      toast.success(result.data.message);

      setTimeout(() => {
        window.location.reload();
      }, 800);

    } else {
      console.log(result.data.error);
    }
  }

  useEffect(() => {

    getJobDetails();

  }, [id]);

  const navigate = useNavigate();

  const handleDeleteJobPost = async () => {
    if (window.confirm("Delete Job Post ? ")) {
      const result = await apiRequest({
        url: `/jobs/delete-job/${jobData._id}`,
        token: user.token,
        method: "DELETE",
      });


      if (result.status === 200) {
        toast.error(result.data.message);
        navigate("/");
      } else {
        console.log(result.data.error);
      }
    }
  };



  return (
    <div className="container mx-auto">
      <div className="w-full flex flex-col md:flex-row gap-10">
        {jobData && <>

          <div className="w-full h-fit md:w-2/3 2xl:w-2/4 bg-white px-5 py-10 md:px-10 shadow-md">
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

              {(jobData.company._id === user.id || user.accountType === "admin") && (
                <Link to={`/applicants/${id}`} title="View the applicants">
                  <div className="bg-[#fed0ab] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-sm">View Applicants</span>
                    <p className="text-lg font-semibold text-gray-700">
                      {jobData.applicants.length}
                    </p>
                  </div>
                </Link>
              )}


              <div className="bg-[#cecdff] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                <span className="text-sm">No. of Vacancies</span>
                <p className="text-lg font-semibold text-gray-700">
                  {jobData.vacancies}
                </p>
              </div>

              <div className="bg-[#c2c387bf] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
                <span className="text-sm">College experience</span>
                <p className="text-lg font-semibold text-gray-700 capitalize">
                  {jobData.experience}
                </p>
              </div>
            </div>

            <div className="w-full flex gap-4 py-5">
              <CustomButton
                onClick={() => setSelected("0")}
                title="Job Description"
                containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${selected === "0"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
                  }`}
              />

              <CustomButton
                onClick={() => setSelected("1")}
                title="Company"
                containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${selected === "1"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
                  }`}
              />
            </div>

            <div className="my-6">
              {selected === "0" ? (
                <>
                  <p className="text-xl font-semibold">Job Decsription</p>

                  <span className="text-base text-justify break-words whitespace-pre-wrap">
                    {jobData.detail.description}
                  </span>

                  {jobData.detail.requirements && (
                    <>
                      <p className="text-xl font-semibold mt-8">Requirements</p>
                      <span className="text-base text-justify break-words whitespace-pre-wrap">
                        {jobData.detail.requirements}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6 flex flex-col">
                    <p className="text-xl text-blue-600 font-semibold">
                      {jobData.company.name}
                    </p>
                    <span className="text-base">
                      {jobData.company.location}
                    </span>
                    <span className="text-sm">{jobData.company.email}</span>
                  </div>

                  <p className="text-xl font-semibold">About Company</p>
                  <span className="text-base text-justify break-words whitespace-pre-wrap">{jobData.company.about}</span>
                </>
              )}
            </div>
            {user.accountType === "seeker" ? (
              jobData.applicants.includes(user.id) ? (
                <div className="w-1/4 flex justify-center items-center gap-1 text-green-600 py-3 px-5 rounded-full text-lg mx-auto">
                  <IoIosCheckmarkCircle />
                  <p>Applied</p>
                </div>
              ) : (
                <CustomButton
                  title="Apply Now"
                  onClick={handleJobApply}
                  containerStyles={`w-44 justify-center text-white bg-black py-3 px-5 outline-none rounded-full text-base`}
                />
              )
            ) : (
              <>
                {(jobData.company._id === user.id || user.accountType === "admin") && (
                  <CustomButton
                    title="Edit Job"
                    onClick={() => setOpenForm(true)}
                    containerStyles={`w-full flex items-center justify-center text-white bg-lime-700 py-3 px-5 outline-none rounded-full text-base mb-3 sm:mb-0`}
                  />
                )}
                {jobData.company._id === user.id && (
                  <CustomButton
                    title="Delete Job"
                    onClick={handleDeleteJobPost}
                    containerStyles={`w-full flex items-center justify-center text-white bg-red-900 py-3 px-5 outline-none rounded-full text-base mt-3`}
                  />
                )}
              </>
            )}
          </div>

          <JobUpdateForm open={openForm} setOpen={setOpenForm} jobDetails={getJobDetails} />
        </>
        }

        {/* right side */}
        <div className="w-full md:w-1/3 2xl:w-2/4 md:h-[60rem] md:overflow-y-scroll md:no-scrollbar">
          <div className=" p-5 md:mt-0 ">
            <p className="text-gray-500 font-semibold mb-2">
              Similar Job Post
            </p>

            <div className="w-full flex flex-wrap gap-4">
              {similarJobs?.slice(0, 6).map((job) => {
                const data = {
                  name: job.company.name,
                  logo: job.company.profileUrl,
                  ...job,
                };
                return <JobCard data={data} key={job._id} />;
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default JobDetails;

