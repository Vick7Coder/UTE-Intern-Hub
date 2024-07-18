import React, { useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall, FiEdit3 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { CustomButton, JobCard, CompanyForm } from "../components";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { cmpData } from "../redux/companySlice";
import { toast } from "react-toastify";

const CompanyProfile = () => {
  const { user } = useSelector((state) => state.user);
  const { companyInfo } = useSelector((state) => state.cmp);
  const navigate = useNavigate();
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
  const deleteCompany = async () => {
    const companyId = id || user?.id;
    if (!companyId) {
      toast.error("Company ID is not available");
      return;
    }

    if (window.confirm("Do you want to delete this company account?")) {
      try {
        const result = await apiRequest({
          url: `/companies/delete-recruiter/${companyId}`,
          method: "DELETE",
          token: user?.token,
        });

        if (result?.status === 200) {
          toast.success(result.data.message);
          if (user?.accountType === "company") {
            // If the company is deleting their own account
            dispatch(logout());
            navigate("/user-auth", { replace: true });
          } else if (user?.accountType === "admin") {
            // If admin is deleting the company account
            navigate("/companies", { replace: true });
          }
        } else {
          toast.error(result?.data?.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error deleting company:", error);
        toast.error("An error occurred while deleting the company");
      }
    }
  };
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
          {((user?.accountType === 'company' && (id ? id === user.id : true)) || user?.accountType === 'admin') && (
            <div className='flex items-center justifu-center py-5 md:py-0 gap-4'>
              {user?.accountType === 'company' && (
                <>
                  <CustomButton
                    onClick={() => setOpenForm(true)}
                    iconRight={<FiEdit3 />}
                    containerStyles={`py-1.5 px-3 md:px-5 focus:outline-none bg-blue-600  hover:bg-blue-700 text-white rounded text-sm md:text-base border border-blue-600`}
                  />
                  <Link to='/upload-job'>
                    <CustomButton
                      title='Upload Job'
                      containerStyles={`text-blue-600 py-1.5 px-3 md:px-5 focus:outline-none  rounded text-sm md:text-base border border-blue-600`}
                    />
                  </Link>
                </>
              )}
              <CustomButton
                title='Delete Account'
                onClick={deleteCompany}
                containerStyles={`text-white py-1.5 px-3 md:px-5 focus:outline-none bg-red-600 hover:bg-red-700 rounded text-sm md:text-base border border-red-600`}
              />
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
      <br /><br /> <br /><br /><br /><br />
      <CompanyForm open={openForm} setOpen={setOpenForm} currentCompanyData={companyInfo} />
    </div>
  );
};

export default CompanyProfile;