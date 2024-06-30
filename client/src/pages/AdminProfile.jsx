import React, { useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall, FiEdit3 } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { CustomButton, AdminForm } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { adData } from "../redux/adminSlice";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.user);
  const { adminInfo } = useSelector(state => state.ad);
  const [openForm, setOpenForm] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  const fetchAdminById = async () => {
    const result = await apiRequest({
      url: `/admin/get-admin/${id}`,
      method: "GET",
      token: user.token
    });

    if (result.status === 200) {
      dispatch(adData(result.data.data));
    } else {
      console.log(result);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    id && fetchAdminById();
  }, [id]);

  // Redirect or show error if user is not admin
  if (user?.accountType !== 'admin') {
    return <div>Access Denied. Only admins can view this page.</div>;
  }

  return (
    <div className='container mx-auto p-5'>
      <div>
        <div className='w-full flex flex-col md:flex-row gap-3 justify-between'>
          <h2 className='text-gray-600 text-xl font-semibold'>
            Welcome, {adminInfo?.name ?? user.name}
          </h2>

          <div className='flex items-center justify-center py-5 md:py-0 gap-4'>
            <CustomButton
              onClick={() => setOpenForm(true)}
              iconRight={<FiEdit3 />}
              containerStyles={`py-1.5 px-3 md:px-5 focus:outline-none bg-blue-600 hover:bg-blue-700 text-white rounded text-sm md:text-base border border-blue-600`}
            />
          </div>
        </div>

        <div className='w-full flex flex-col md:flex-row justify-start md:justify-between mt-4 md:mt-8 text-base'>
          <p className='flex gap-1 items-center px-3 py-1 text-slate-600'>
            <HiLocationMarker /> {adminInfo?.location ?? "No Location"}
          </p>
          <p className='flex gap-1 items-center px-3 py-1 text-slate-600'>
            <AiOutlineMail /> {adminInfo?.email ?? user.email}
          </p>
          <p className='flex gap-1 items-center px-3 py-1 text-slate-600'>
            <FiPhoneCall /> {adminInfo?.contact ?? "No Contact"}
          </p>
        </div>

        {adminInfo?.about && 
          <div>
            <p className="text-base text-slate-600 py-2.5 px-5 my-3.5 md:mx-auto w-full md:w-8/12 text-justify break-all border-dashed border-2 border-[#c9b7b7] rounded-xl">
              {adminInfo?.about}
            </p>
          </div>
        }
      </div> 

      <AdminForm open={openForm} setOpen={setOpenForm} />
    </div>
  );
};

export default AdminProfile;