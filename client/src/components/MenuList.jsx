import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { AiOutlineLogout } from 'react-icons/ai'
import { Link, useNavigate } from "react-router-dom";

import { NoProfile } from '../assets'

import { useDispatch } from "react-redux";
import { cmpData } from "../redux/companySlice";
import { logout } from "../redux/userSlice";
import { apiRequest } from "../utils";
import { seekerData } from "../redux/seekerSlice";
import { ltData } from "../redux/lecturerSlice";
import { adData } from "../redux/adminSlice";
import { toast } from "react-toastify";

const MenuList = ({ user, position }) => {
  const [profile, setprofile] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchCompany = async () => {
    let cmpID = user.id;
    const result = await apiRequest({
      url: `/companies/get-company/${cmpID}`,
      method: "GET",
      token: user.token
    })
    if (result.status === 200) {
      setprofile(result.data.data.profileUrl)
      dispatch(cmpData(result.data.data))
    }
    else {
      console.log(result)
      toast.error("Error Occured")
    }
  }
  const fetchUser = async () => {
    const result = await apiRequest({
      url: `/user/get-user`,
      method: "GET",
      token: user.token
    })
    if (result.status === 200) {
      setprofile(result.data.user.profileUrl)
      dispatch(seekerData(result.data.user))
    }
    else {
      console.log(result)
      toast.error("Error Occured")
    }
  }
  const fetchAdmin = async () => {
    let adID = user.id;
    const result = await apiRequest({
      url: `/admin/get-admin/${adID}`,
      method: "GET",
      token: user.token
    })
    if (result.status === 200) {
      setprofile(result.data.data.profileUrl)
      dispatch(adData(result.data.data))
    }
    else {
      console.log(result)
      toast.error("Error Occured")
    }
  }

  const fetchLecturer = async () => {
    let lectureID = user.id;
    const result = await apiRequest({
      url: `/lecturer/get-lecturer/${lectureID}`,
      method: "GET",
      token: user.token
    })
    if (result.status === 200) {
      setprofile(result.data.data.profileUrl)
      dispatch(ltData(result.data.data))
    }
    else {
      console.log(result)
      toast.error("Error Occurred")
    }
  }
  // checking token is expired or not
  const tokenValidity = async () => {

    const response = await apiRequest({
      url: 'token/checkToken',
      method: 'GET',
      token: user.token,
    });
    if (response.error) {
      dispatch(logout()); // Trigger logout action
      console.log(response.error);
    }
  };
  useEffect(() => {
    tokenValidity();
    if (user.accountType === 'seeker') {
      fetchUser();
    } else if (user.accountType === 'admin') {
      fetchAdmin();
    } else if (user.accountType === 'lecture') {
      fetchLecturer();
    } else {
      fetchCompany();
    }
  }, [])
  const handleLogOut = () => {
    dispatch(logout())
    navigate('/user-auth')
  };
  return (
    <div>
      <Menu as="div" className="inline-block text-left">
        <div className="flex">
          <Menu.Button className="inline-flex gap-2 w-full rouned-md bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-opacity-20">
            <div className="leading[80px] flex flex-col items-start">
              <p className="text-sm font-semibold">
                {user?.name}
              </p>
              <span className="text-sm text-[#a52a2a]">
                {user?.email}
              </span>
            </div>
            <img
              src={profile || NoProfile} alt='profile'
              className="w-10 h-10 rounded-full object-cover" />
            <BiChevronDown
              className="h-10 w-9  "
              aria-hidden='true' />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          {/* divide= border-bottom */}
          <Menu.Items className={`${position} z-50 right-2 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg focus:outline-none`}>
            <div className="p-1">
              <Menu.Item>
                {
                  ({ active }) => (

                    // here "active" is a destructured prop from the Menu.Item were It's a boolean value that indicates whether the current menu item is selected or active.
                    <Link
                      to={`${user?.accountType === 'seeker'
                        ? 'user-profile'
                        : user?.accountType === 'admin'
                          ? 'admin-profile'
                          : user?.accountType === 'lecture'
                            ? 'lecturer-profile'
                            : 'company-profile'}`}
                      className={`${active ? 'bg-blue-500 text-white' : "text-gray-900 "} group flex w-full items-center rounded-md p-2 text-sm`}
                    >
                      <CgProfile
                        className={`${active ? 'text-white' : 'text-gray-600'} mr-2 h-5 w-5`}
                        aria-hidden='true'
                      />
                      {user?.accountType === 'seeker'
                        ? "User Profile"
                        : user?.accountType === 'admin'
                          ? "Admin Profile"
                          : user?.accountType === 'lecture'
                            ? "Lecturer Profile"
                            : "Company Profile"}
                    </Link>
                  )
                }
              </Menu.Item>
              <Menu.Item>
                {
                  ({ active }) => (
                    <button
                      onClick={handleLogOut}
                      className={`${active ? 'bg-blue-500 text-white' : "text-gray-900 "} group flex w-full items-center rounded-md p-2 text-sm`}
                    >
                      <AiOutlineLogout
                        className={`${active ? 'text-white' : 'text-gray-600'} mr-2 h-5 w-5`}
                        aria-hidden='true'
                      />
                      Log Out
                    </button>
                  )
                }
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default MenuList;
