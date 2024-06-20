import React from "react";

import { Link, useNavigate, NavLink } from "react-router-dom";
import classes from "./Navigation.module.css";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authToken = localStorage.getItem("token");
  const redAuthToken = jwtDecode(authToken);

  const logoutHandler = () => {
    dispatch({ type: "CLEARAUTHTOKEN" });
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        {/* Container wrapper */}
        <div className="container">
          {/* Navbar brand */}
          <NavLink className="navbar-brand" to="/dashboard">
            <img
              src={"/images/logo.svg"}
              alt="logo"
              style={{ width: "160px", height: "40px" }}
            />
          </NavLink>
          {/* Toggle button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars" />
          </button>
          {/* Collapsible wrapper */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* Left links */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {redAuthToken.role === "Admin" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/manage-users"
                      activeClassName="active"
                    >
                      Người dùng
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/manage-jobs"
                      activeClassName="active"
                    >
                      Công việc
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/reports"
                      activeClassName="active"
                    >
                      Tài liệu
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/blog"
                      activeClassName="active"
                    >
                      Blog
                    </NavLink>
                  </li>
                </>
              )}
              {redAuthToken.role === "Job Provider" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/manage-applicants"
                      activeClassName="active"
                    >
                      Applicant
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/manage-jobs"
                      activeClassName="active"
                    >
                      Jobs
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/provider-report"
                      activeClassName="active"
                    >
                      Reports
                    </NavLink>
                  </li>
                </>
              )}
              {redAuthToken.role === "User" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/dashboard"
                      activeClassName="active"
                    >
                      Việc làm
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/appliedJobs"
                      activeClassName="active"
                    >
                      Việc đã nộp
                    </NavLink>
                  </li>
                </>
              )}
              <li className="nav-item dropdown">
              <Nav>
  <Dropdown align={"end"} className={classes.dropDown}>
    <Dropdown.Toggle
      className={`nav-link dropdown-toggle ${classes.user} btn-light`}
      id="navbarDropdownMenuLink"
      role=""
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      
        <i className="bi bi-person-circle"></i> {redAuthToken.userName}
     
    </Dropdown.Toggle>
    <Dropdown.Menu className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
      <Link to="/change-password" className={`dropdown-item ${classes.changePassword}`}>
        Đổi mật khẩu
      </Link>
      <Dropdown.Divider />
      <Dropdown.Item
        as={"button"}
        onClick={logoutHandler}
        className={`dropdown-item ${classes.changePassword}`}
      >
        Đăng xuất
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
</Nav>
              </li>
            </ul>
            {/* Left links */}
          </div>
          {/* Collapsible wrapper */}
        </div>
        {/* Container wrapper */}
      </nav>
      {/* Navbar */}
    </>
  );
};

export default Navigation;