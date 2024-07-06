import React, { useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { MenuList } from "./";

const NavBar = () => {
  const { user } = useSelector((state) => state.user);

  const [isOpen, setIsOpen] = useState(false); // navbar display - mobile size

  const dispatch = useDispatch();

  // localStorage change detecting and logging out the user
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("localStorage change detected!");
      dispatch(logout());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

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
              <li>
                <Link to="/">
                  {user?.accountType === "seeker" ? "Find Jobs" : "Jobs"}
                </Link>
              </li>
              {user?.accountType === "seeker" ? (
                <li>
                  <Link to="/companies">Companies</Link>
                </li>
              ) : (
                <li>
                  <Link to="/upload-job">Upload Job</Link>
                </li>
              )}
            </>
          )}

          {user?.accountType === "seeker" ? (
            <>
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
<<<<<<< Updated upstream
              <li>
                <Link to="/applied-jobs">Applied</Link>
              </li>
=======
              <li><Link to="/applied-jobs">Applied Jobs</Link></li>

>>>>>>> Stashed changes
            </>

          ) : (
            <>
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li>
                <Link to="/upload-blog">Upload Blog</Link>
              </li>
            </>
          )}

          <li>
            <Link to="/about-us">About us</Link>
          </li>
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
            <Link to="/" onClick={() => setIsOpen(false)}>
              {user?.accountType === "seeker" ? "Find Jobs" : "Jobs"}
            </Link>
            {user?.accountType === "seeker" ? (
              <Link to="/companies" onClick={() => setIsOpen(false)}>Companies</Link>
            ) : (
              <Link to="/upload-job" onClick={() => setIsOpen(false)}>Upload Job</Link>
            )}
          </>
        )}

        {user?.accountType == "seeker" ? (
          <Link to="/blogs" onClick={() => setIsOpen(false)}>Blogs </Link>
        ) : (
          <Link to="/upload-blog" onClick={() => setIsOpen(false)}>Upload Blog</Link>
        )}

        <Link to="/about-us" onClick={() => setIsOpen(false)}>About</Link>

        {user?.token && (
          <div className="w-full py-10">
            <MenuList user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;