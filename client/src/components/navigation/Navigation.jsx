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
    <Navbar
      fixed="top"
      variant="dark"
      expand="md"
      bg="white"
      className={classes.nav}

    >
      <Container fluid>

        <NavLink
          className={classes.brand}
          to="/dashboard"
        >
          <img src={"/images/logo.svg"} alt="logo" style={{ width: "160px", height: "40px" }} />
        </NavLink>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          {redAuthToken.role === "Admin" && (
            <Nav className={`me-auto ${classes.pageLinks}`}>
              <NavLink
                style={{ color: "black" }}
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/manage-users"
              >
                Người dùng
              </NavLink>
              <NavLink style={{ color: "black" }}
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/manage-jobs"
              >
                Công việc
              </NavLink>
              <NavLink style={{ color: "black" }}
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/reports"
              >
                Tài liệu
              </NavLink>
              <NavLink style={{ color: "black" }}
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/blog"
              >
                Blog
              </NavLink>
            </Nav>
          )}
          {redAuthToken.role === "Job Provider" && (
            <Nav className={`me-auto ${classes.pageLinks}`}>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/manage-applicants"
              >
                ỨNG VIÊN
              </NavLink>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/manage-jobs"
              >
                QUẢN LÝ CÔNG VIỆC
              </NavLink>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/provider-report"
              >
                TÀI LIỆU
              </NavLink>
            </Nav>
          )}
          {redAuthToken.role === "User" && (
            <Nav className={`me-auto ${classes.pageLinks}`}>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/dashboard"
              >
                CÔNG VIỆC
              </NavLink>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/blog"
              >
                BLOG
              </NavLink>
              <NavLink
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
                to="/appliedJobs"
              >
                CÔNG VIỆC ĐÃ ỨNG TUYỂN
              </NavLink>
            </Nav>
          )}
          <Nav>
            <Dropdown align={"end"} className={classes.dropDown}>
              <Dropdown.Toggle className={classes.user} style={{ border: "none", backgroundColor: "#fff", fontFamily: "sans-serif" }}>
                <span className={classes.username}>
                  <span className={classes.userLogo}>
                    <i className="bi bi-person-circle"></i>
                  </span>
                  {redAuthToken.userName}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ marginRight: "-6px", marginTop: "10px" }}>
                {/* <Link to="/change-password" className={classes.changePassword} style={{ fontFamily: "sans-serif", letterSpacing: "-3px;" }}>
                  ĐỔI MẬT KHẨU
                </Link>
                <Dropdown.Divider /> */}
                <Dropdown.Item
                  as={"button"}
                  onClick={logoutHandler}
                  className={classes.changePassword}
                >
                  Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
