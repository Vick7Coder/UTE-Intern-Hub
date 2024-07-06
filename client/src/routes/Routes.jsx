import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import { Footer, NavBar } from "../components";
import {
  About,
  Applicants,
  Auth,
  Companies,
  CompanyProfile,
  FindJobs,
  JobDetails,
  UploadJob,
  UserProfile,
  ResetPassword,
  AdminProfile,
  BlogDetails,
  FindBlogs,
  UploadBlog,
  AppliedJobs,
} from "../pages";
import { useSelector } from "react-redux";

function Layout() {
  const { user } = useSelector((state) => state.user);

  return user && user.token ? (
    <Outlet />
  ) : (
    <Navigate to="/user-auth" replace={true} />
  );
}

const AppRoutes = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <main>
      <NavBar />

      <Routes>
        {/* if user is authenticated he can access these routes         */}

        <Route element={<Layout />}>

          <Route path="/" element={<FindJobs />} />

          <Route
            path="/companies"
            element={user?.accountType !== "company" && <Companies />}
          />
          <Route path="/blogs" element={<FindBlogs />} />
          <Route path={"/blog-details/:id"} element={<BlogDetails />} />

          <Route
            path={
              user?.accountType === "seeker"
                ? "/user-profile"
                : "/user-profile/:id"
            }
            element={<UserProfile />}
          />

          <Route
            path={
              user?.accountType === "seeker"
                ? "/company-profile/:id"
                : "/company-profile"
            }
            element={<CompanyProfile />}
          />

          <Route
            path={"/upload-job"}
            element={user?.accountType !== "seeker" && <UploadJob />}
          />
          <Route
            path={"/upload-blog"}
            element={user?.accountType !== "seeker" && <UploadBlog />}
          />
          <Route path={"/job-details/:id"} element={<JobDetails />} />
          <Route path={"/applicants/:id"} element={<Applicants />} />

          <Route path="/admin-profile">
            <Route index element={user?.accountType === "admin" ? <AdminProfile /> : <Navigate to="/" replace />} />
            <Route path=":id" element={user?.accountType === "admin" ? <AdminProfile /> : <Navigate to="/" replace />} />
          </Route>
        </Route>
        {/* and if not authenticated he can only access these routes */}

        <Route path="/about-us" element={<About />} />
        <Route path="/user-auth" element={<Auth />} />
        <Route path=":userType/reset-password/:token" element={<ResetPassword />} />

        <Route path="/applied-jobs" element={<AppliedJobs />} />

      </Routes>

      {user && <Footer />}
    </main>
  );
};

export default AppRoutes;
