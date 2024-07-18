import React, { useEffect, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall, FiEdit3 } from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CustomButton, SeekerCard, LecturerForm } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { ltData } from "../redux/lecturerSlice";
import { NoProfile } from "../assets";
import { logout } from "../redux/userSlice";
import { toast } from "react-toastify";

const LecturerProfile = () => {
  const { user } = useSelector((state) => state.user);
  const { lecturerInfo } = useSelector((state) => state.lt);
  const [openForm, setOpenForm] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchLecturerById = async () => {
    const result = await apiRequest({
      url: `/lecturer/get-lecturer/${id}`,
      method: "GET",
      token: user.token
    });

    if (result.status === 200) {
      dispatch(ltData(result.data.data));
    } else {
      console.log(result);
      toast.error("Error Occurred");
    }
  };

  useEffect(() => {
    id && fetchLecturerById();
  }, [id]);
  const deleteLecturer = async () => {
    const lecturerId = id || user?.id;
    if (!lecturerId) {
      toast.error("Lecturer ID is not available");
      return;
    }

    if (window.confirm("Do you want to delete this lecturer account?")) {
      try {
        const result = await apiRequest({
          url: `/lecturer/delete-lecturer/${lecturerId}`,
          method: "DELETE",
          token: user?.token,
        });

        if (result?.status === 200) {
          toast.success(result.data.message);
          if (user?.accountType === "lecture") {
            // If the lecturer is deleting their own account
            dispatch(logout());
            navigate("/user-auth", { replace: true });
          } else if (user?.accountType === "admin") {
            // If admin is deleting the lecturer account
            navigate("/lecturer", { replace: true });
          }
        } else {
          toast.error(result?.data?.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error deleting lecturer:", error);
        toast.error("An error occurred while deleting the lecturer");
      }
    }
  };
  return (
    <div className='container mx-auto p-5'>
      <div>
        <div className='w-full flex flex-col md:flex-row gap-3 justify-between items-center'>
          <div className="flex items-center gap-4">
            <img
              src={lecturerInfo?.profileUrl || NoProfile}
              alt={lecturerInfo?.name || "Lecturer"}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className='text-gray-600 text-xl font-semibold'>
                {user?.accountType === 'lecture' ? (
                  <>Welcome, {lecturerInfo?.name ?? user.name}</>
                ) : (
                  <>{lecturerInfo?.name ?? "No Name"}</>
                )}
              </h2>
              {lecturerInfo?.lecId ? (
                <p className='text-gray-500 text-sm'>
                  ID: {lecturerInfo.lecId}
                </p>
              ) : (
                <p className='text-gray-500 text-sm'>
                  ID: Not updated yet
                </p>
              )}
            </div>
          </div>

          {((user?.accountType === "lecture" && (id ? id === user.id : true)) ||
            user?.accountType === "admin") && (
              <div className="flex items-center justify-center py-5 md:py-0 gap-4">
                {user?.accountType === "lecture" && (
                  <>
                    <CustomButton
                      onClick={() => setOpenForm(true)}
                      iconRight={<FiEdit3 />}
                      containerStyles={`py-1.5 px-3 md:px-5 focus:outline-none bg-blue-600 hover:bg-blue-700 text-white rounded text-sm md:text-base border border-blue-600`}
                    />
                    <Link to="/user">
                      <CustomButton
                        title="Manage Seekers"
                        containerStyles={`text-blue-600 py-1.5 px-3 md:px-5 focus:outline-none rounded text-sm md:text-base border border-blue-600`}
                      />
                    </Link>
                  </>
                )}
                <CustomButton
                  title="Delete Account"
                  onClick={deleteLecturer}
                  containerStyles={`text-white py-1.5 px-3 md:px-5 focus:outline-none bg-red-600 hover:bg-red-700 rounded text-sm md:text-base border border-red-600`}
                />
              </div>
            )}
        </div>

        <div className='w-full flex flex-col md:flex-row justify-start md:justify-between mt-4 md:mt-8 text-base'>
          <p className='flex gap-1 items-center px-3 py-1 text-slate-600'>
            Department: {lecturerInfo?.location ?? "No Department"}
          </p>
          <p className='flex gap-1 items-center px-3 py-1 text-slate-600'>
            <AiOutlineMail /> {lecturerInfo?.email ?? "No Email"}
          </p>
          <p className='flex gap-1 items-center px-3 py-1 text-slate-600'>
            <FiPhoneCall /> {lecturerInfo?.contact ?? "No Contact"}
          </p>

          <div className='flex flex-col items-center mt-3.5 md:mt-0'>
            <span className='text-xl'>{lecturerInfo?.studentLists?.length ?? 0}</span>
            <p className='text-blue-600'>Students</p>
          </div>
        </div>

        {lecturerInfo?.about && (
          <div>
            <p className="text-base text-justify break-words whitespace-pre-wrap text-slate-600 py-2.5 px-5 my-3.5 md:mx-auto w-full  md:w-8/12 border-dashed border-2 border-[#c9b7b7] rounded-xl">
              {lecturerInfo?.about}
            </p>
          </div>
        )}
      </div>

      <div className='w-full mt-20 flex flex-col gap-2'>
        <p className="text-center sm:text-left">Managed Students</p>

        <div className='flex flex-wrap justify-center sm:justify-normal gap-6'>
          {lecturerInfo?.studentLists?.map((seeker) => (
            <SeekerCard seeker={seeker} key={seeker._id} />
          ))}
        </div>
      </div>
      <LecturerForm open={openForm} setOpen={setOpenForm} currentLecturerData={lecturerInfo} />
    </div>
  );
};

export default LecturerProfile;