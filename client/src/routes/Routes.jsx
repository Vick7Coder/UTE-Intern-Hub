// File: src/routes/AppRoutes.js
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import { Footer, NavBar } from "../components";
import {
  About,
  Auth,
  Companies,
  CompanyProfile,
  FindJobs,
  JobDetails,
  UploadJob,
  UserProfile,
  ResetPassword,
  AdminProfile,
  InsightDetails,
  FindInsights,
  Applicants,
  AppliedJobs,
  LecturerProfile,
  Seekers,
  Lecturers,
  Admins
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
        <Route element={<Layout />}>
          <Route path="/" element={<FindJobs />} />

          <Route
            path="/user"
            element={(user?.accountType === "lecture" || user?.accountType === "admin") && <Seekers />}
          />

          <Route
            path="/lecturer"
            element={(user?.accountType == "admin") && <Lecturers />}
          />
          <Route
            path="/admin"
            element={(user?.accountType == "admin") && <Admins />}
          />

          <Route
            path="/Companies"
            element={user?.accountType !== "company" && <Companies />}
          />
          <Route path="/insights" element={<FindInsights />} />
          <Route path={"/insight-details/:id"} element={<InsightDetails />} />

          <Route
            path={
              user?.accountType === "seeker"
                ? "/user-profile"
                : "/user-profile/:id"
            }
            element={<UserProfile />}
          />

          <Route
            path="/lecturer-profile"
            element={user?.accountType === "lecture" ? <LecturerProfile /> : <Navigate to="/" replace />}
          />
          <Route
            path="/lecturer-profile/:id"
            element={user?.accountType === "admin" ? <LecturerProfile /> : <Navigate to="/" replace />}
          />

          <Route
            path={
              user?.accountType === "seeker" || user?.accountType === "lecture" || user?.accountType === "admin"
                ? "/company-profile/:id"
                : "/company-profile"
            }
            element={<CompanyProfile />}
          />

          <Route
            path={"/upload-job"}
            element={user?.accountType !== "seeker" && <UploadJob />}
          />
          <Route path={"/job-details/:id"} element={<JobDetails />} />

          {/* New route for displaying applied jobs */}
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path={"/applicants/:id"} element={<Applicants />} />
          <Route path="/admin-profile">
            <Route
              index
              element={
                user?.accountType === "admin" ? <AdminProfile /> : <Navigate to="/" replace />
              }
            />
            <Route
              path=":id"
              element={
                user?.accountType === "admin" ? <AdminProfile /> : <Navigate to="/" replace />
              }
            />
          </Route>
        </Route>

        <Route path="/about-us" element={<About />} />
        <Route path="/user-auth" element={<Auth />} />
        <Route path=":userType/reset-password/:token" element={<ResetPassword />} />
      </Routes>

      {user && <Footer />}
    </main>
  );
};

export default AppRoutes;
