import React, { useEffect, useState } from "react";

import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall, FiEdit3 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { CustomButton, JobCard, CompanyForm } from "../components";


import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { cmpData } from "../redux/companySlice";


const CompanyProfile = () => {

  const { user } = useSelector((state) => state.user);

  const { companyInfo } = useSelector(state => state.cmp);


  const [openForm, setOpenForm] = useState(false);


  const { id } = useParams();

  const dispatch = useDispatch();



  const fetchCompanyById = async () => {


    const result = await apiRequest({
      url: `/companies/get-company/${id}`,
      method: "GET",
      token: user.token
    })


    if (result.status === 200) {
      dispatch(cmpData(result.data.data))

    }


    else {
      console.log(result)
      toast.error("Error Occured")

    }
  }

  useEffect(() => {

    id && fetchCompanyById();
  }, [id])


  return (
    <div className='container mx-auto p-5'>
      <div>
        <div className='w-full flex flex-col md:flex-row gap-3 justify-between'>
          <h2 className='text-gray-600 text-xl font-semibold'>
            {user?.accountType === 'company' ? (
              <>
                Welcome, {companyInfo?.name ?? user.name}
              </>
            )
              : (
                <>{companyInfo?.name}</>
              )
            }
          </h2>
          {((user?.accountType === 'company' && (id ? id === user.id : !id))) && (
            <div className='flex items-center justifu-center py-5 md:py-0 gap-4'>
              <CustomButton
                onClick={() => setOpenForm(true)}
                iconRight={<FiEdit3 />}
                containerStyles={`py-1.5 px-3 md:px-5 focus:outline-none bg-blue-600  hover:bg-blue-700 text-white rounded text-sm md:text-base border border-blue-600`}
              />

              {user?.accountType === 'company' && (
                <Link to='/upload-job'>
                  <CustomButton
                    title='Upload Job'
                    containerStyles={`text-blue-600 py-1.5 px-3 md:px-5 focus:outline-none  rounded text-sm md:text-base border border-blue-600`}
                  />
                </Link>
              )}
            </div>
          )}

        </div>

        <div className='w-full flex flex-col md:flex-row justify-start md:justify-between mt-4 md:mt-8 text-base'>
          <p className='flex gap-1 items-center   px-3 py-1 text-slate-600 '>
            <HiLocationMarker /> {companyInfo?.location ?? "No Location"}
          </p>
          <p className='flex gap-1 items-center   px-3 py-1 text-slate-600 '>
            <AiOutlineMail /> {companyInfo?.email ?? user.email}
          </p>
          <p className='flex gap-1 items-center  px-3 py-1 text-slate-600'>
            <FiPhoneCall /> {companyInfo?.contact ?? "No Contact"}
          </p>

          <div className='flex flex-col items-center mt-3.5 md:mt-0'>
            <span className='text-xl'>{companyInfo?.jobPosts?.length ?? 0}</span>
            <p className='text-blue-600 '>Job Post</p>
          </div>
        </div>

        {companyInfo?.about &&
          <div>
            <p className="text-base text-justify break-words whitespace-pre-wrap text-slate-600 py-2.5 px-5 my-3.5 md:mx-auto w-full  md:w-8/12 border-dashed border-2 border-[#c9b7b7] rounded-xl">

              {companyInfo?.about}

            </p>
          </div>
        }


      </div>

      <div className='w-full mt-20 flex flex-col gap-2'>
        <p className="text-center font-bold text-xl uppercase mb-4"> Jobs Posted</p>

        <div className='flex flex-wrap justify-center gap-6'>


          {companyInfo?.jobPosts?.map((job) => {

            const data = {
              name: companyInfo?.name,
              email: companyInfo?.email,
              logo: companyInfo?.profileUrl,
              ...job,
            };

            return <JobCard data={data} key={job._id} />;
          })}
        </div>
      </div>

      <CompanyForm open={openForm} setOpen={setOpenForm} />
    </div>
  );
};

export default CompanyProfile;