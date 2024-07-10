import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { AdminForm } from "../components";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils";
import { adData } from "../redux/adminSlice";
import { toast } from "react-toastify";
import { NoProfile } from "../assets";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.user);
  const { adminInfo } = useSelector((state) => state.ad);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAdminById = async () => {
    const result = await apiRequest({
      url: `/admin/get-admin/${id}`,
      method: "GET",
      token: user.token,
    });

    if (result.status === 200) {
      dispatch(adData(result.data.data));
    } else {
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    if (id) {
      fetchAdminById();
    } else {
      console.error("ID param is undefined");
    }
  }, [id]);

  useEffect(() => {
    if (isDeleted) {
      window.location.reload();
    }
  }, [isDeleted]);

  if (user?.accountType !== "admin") {
    return <div>Access Denied. Only admins can view this page.</div>;
  }

  const deleteAccount = async () => {
    if (window.confirm("Do you want to delete your account?")) {
      const result = await apiRequest({
        url: `/admin/delete-admin/${user.id}`,
        token: user.token,
        method: "DELETE",
      });

      if (result.status === 200) {
        toast.success(result.data.message);
        localStorage.removeItem('user');
        setIsDeleted(true);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

 

  return (
    <div className="container mx-auto flex items-center justify-center py-10">
      <div className="w-full md:w-2/3 2xl:w-2/4 bg-white shadow-lg p-10 pb-10 rounded-lg">
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-4xl font-semibold text-slate-600 capitalize">
            {adminInfo?.name ?? user.name}
          </h1>

          <div className="w-full flex flex-wrap lg:flex-row justify-between mt-8 text-sm">
            <p className="flex gap-1 items-center justify-center px-3 py-1 text-slate-600 rounded-full">
              <HiLocationMarker /> {adminInfo?.location ?? "No Location"}
            </p>
            <p className="flex gap-1 items-center justify-center px-3 py-1 text-slate-600 rounded-full">
              <AiOutlineMail /> {adminInfo?.email ?? user.email}
            </p>
            <p className="flex gap-1 items-center justify-center px-3 py-1 text-slate-600 rounded-full">
              <FiPhoneCall /> {adminInfo?.contact ?? "No Contact"}
            </p>
          </div>
        </div>

        <hr />

        <div className="w-full py-3">
          <div className="w-full flex flex-col-reverse items-center md:flex-row gap-8 py-6">
            <div className="w-full md:w-2/3 flex flex-col gap-4 text-lg text-slate-600 mt-20 md:mt-0">
              <p className="text-[#0536e7] font-semibold text-2xl">ABOUT</p>
              <span className="text-base text-justify break-words whitespace-pre-wrap">
                {adminInfo?.about ?? "No About Found"}
              </span>
            </div>

            <div className="w-full md:w-1/3 h-44">
              <img
                src={adminInfo?.profileUrl ?? NoProfile}
                alt={adminInfo?.name ?? user?.name}
                className="w-full h-48 object-contain rounded-lg"
              />
            </div>
          </div>

          {((user?.accountType === 'admin' && (id ? id === user.id : !id))) && (
            <div className="w-full sm:flex justify-around">
              <button
                className="w-full sm:w-1/4 bg-blue-600 text-white mt-4 py-2 rounded"
                onClick={() => setOpen(true)}
              >
                Edit Profile
              </button>

              <button
                className="w-full sm:w-1/4 bg-red-600 text-white mt-4 py-2 rounded"
                onClick={deleteAccount}
              >
                Delete Account
              </button>
            </div>
          )}

         
        </div>
      </div>

      <AdminForm open={open} setOpen={setOpen} />
    </div>
  );
};

export default AdminProfile;