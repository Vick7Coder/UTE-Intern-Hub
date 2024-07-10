import React, { useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { MenuList } from "./";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { user } = useSelector((state) => state.user);

  const [isOpen, setIsOpen] = useState(false); // navbar display - mobile size
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // user dropdown visibility
  const [selectedUserType, setSelectedUserType] = useState("User"); // selected user type

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // localStorage change detecting and logging out the user
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("localStorage change detected!");
      dispatch(logout());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev);
  };

  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type);
    setIsUserDropdownOpen(false);
    setIsOpen(false);
    if (type === "Company") {
      navigate("/companies");
    }
    if (type === "Student") {
      navigate("/user");
    }
    if (type === "Lecturer") {
      navigate("/lecturer");
    }
    if (type === "Admin") {
      navigate("/admin");
    }
  };

  return (
    <div className="relative bg-[#f7fdfd] z-50">
      <nav className="container mx-auto flex items-center justify-between p-5">
        <div>
          <Link to="/" className="font-bold text-3xl">
            <span className="text-[#303796]">UTE</span>
            <span className="text-black">INTERN</span>
            <span className="text-[#ec2129]">HUB</span>
          </Link>
        </div>

        <ul className="hidden lg:flex gap-10 text-md font-bold">
          {user?.token && (
            <>
              {user?.accountType === "seeker" && (
                <>
                  <li>
                    <Link to="/">Find Jobs</Link>
                  </li>
                  <li>
                    <Link to="/companies">Companies</Link>
                  </li>
                  <li>
                    <Link to="/insights">Insights</Link>
                  </li>
                  <li>
                    <Link to="/applied-jobs">Applied Jobs</Link>

                  </li>
                </>
              )}
              {user?.accountType === "company" && (
                <>
                  <li>
                    <Link to="/">Jobs</Link>
                  </li>
                  <li>
                    <Link to="/upload-job">Upload Job</Link>
                  </li>
                  <li>
                    <Link to="/insights">Insights</Link>
                  </li>
                </>
              )}
              {user?.accountType === "admin" && (
                <>
                  <li>
                    <Link to="/">Jobs</Link>
                  </li>
                  <li>
                    <Link to="/insights">Insights</Link>
                  </li>
                  <li>
                    <Link to="/upload-insight">Upload Insight</Link>
                  </li>
                  <li className="relative">
                    <button onClick={toggleUserDropdown} className="focus:outline-none">
                      {selectedUserType}
                    </button>
                    {isUserDropdownOpen && (
                      <ul className="absolute bg-white shadow-lg rounded-lg mt-2">
                        <li>
                          <button className="block px-4 py-2" onClick={() => handleUserTypeSelect("Student")}>
                            Student
                          </button>
                        </li>
                        <li>
                          <button className="block px-4 py-2" onClick={() => handleUserTypeSelect("Company")}>
                            Company
                          </button>
                        </li>
                        <li>
                          <button className="block px-4 py-2" onClick={() => handleUserTypeSelect("Lecturer")}>
                            Lecturer
                          </button>
                        </li>
                        <li>
                          <button className="block px-4 py-2" onClick={() => handleUserTypeSelect("Admin")}>
                            Admin
                          </button>
                        </li>
                      </ul>
                    )}
                  </li>
                </>
              )}
              {user?.accountType === "lecture" && (
                <>
                  <li>
                    <Link to="/">Find Jobs</Link>
                  </li>
                  <li>
                    <Link to="/companies">Companies</Link>
                  </li>
                  <li>
                    <Link to="/insights">Insights</Link>
                  </li>
                  <li>
                    <Link to="/user">Student</Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/about-us">About us</Link>
              </li>
            </>
          )}
        </ul>

        {/* Right side of the navbar */}
        <div className="hidden lg:flex items-center">
          {!user?.token ? (
            <div className="text-red-700 font-semibold">
              @The system requires an account to use the services!
            </div>
          ) : (
            <MenuList user={user} position="absolute" />
          )}
        </div>

        {/* Hamburger and close icon */}
        <button
          className="block lg:hidden text-slate-900"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
        </button>
      </nav>

      {/* Mobile size navbar */}
      <div
        className={`${isOpen ? "absolute flex bg-[#f7fdfd]" : "hidden"
          } w-full mx-auto lg:hidden flex-col pl-8 gap-3 py-5`}
      >
        {user?.token && (
          <>
            {user?.accountType === "seeker" && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)}>
                  Find Jobs
                </Link>
                <Link to="/companies" onClick={() => setIsOpen(false)}>
                  Companies
                </Link>
                <Link to="/insights" onClick={() => setIsOpen(false)}>
                  Insights
                </Link>
                <Link to="/applied-jobs" onClick={() => setIsOpen(false)}>
                  Applied Jobs
                </Link>
              </>
            )}
            {user?.accountType === "recruiter" && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)}>
                  Jobs
                </Link>
                <Link to="/upload-job" onClick={() => setIsOpen(false)}>
                  Upload Job
                </Link>
                <Link to="/insights" onClick={() => setIsOpen(false)}>
                  Insights
                </Link>
              </>
            )}
            {user?.accountType === "admin" && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)}>
                  Jobs
                </Link>
                <Link to="/insights" onClick={() => setIsOpen(false)}>
                  Insights
                </Link>
                <Link to="/upload-insight" onClick={() => setIsOpen(false)}>
                  Upload Insight
                </Link>
                <div className="relative">
                  <button onClick={toggleUserDropdown} className="block focus:outline-none">
                    {selectedUserType}
                  </button>
                  {isUserDropdownOpen && (
                    <ul className="absolute bg-white shadow-lg rounded-lg mt-2">
                      <li>
                        <button className="block px-4 py-2" onClick={() => handleUserTypeSelect("Student")}>
                          Student
                        </button>
                      </li>
                      <li>
                        <button className="block px-4 py-2" onClick={() => handleUserTypeSelect("Company")}>
                          Company
                        </button>
                      </li>
                      <li>
                        <button className="block px-4 py-2" onClick={() => handleUserTypeSelect("Lecturer")}>
                          Lecturer
                        </button>
                      </li>
                      <li>
                        <button className="block px-4 py-2" onClick={() => handleUserTypeSelect("Admin")}>
                          Admin
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </>
            )}
            {user?.accountType === "lecture" && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)}>
                  Find Jobs
                </Link>
                <Link to="/companies" onClick={() => setIsOpen(false)}>
                  Companies
                </Link>
                <Link to="/insights" onClick={() => setIsOpen(false)}>
                  Insights
                </Link>
                <Link to="/students" onClick={() => setIsOpen(false)}>
                  Student
                </Link>
              </>
            )}
            <Link to="/about-us" onClick={() => setIsOpen(false)}>
              About us
            </Link>
          </>
        )}

        <div className="my-5">
          {!user?.token ? (
            <div className="text-red-700 font-semibold">
              @The system requires an account to use the services!
            </div>
          ) : (
            <MenuList user={user} position="relative" />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;