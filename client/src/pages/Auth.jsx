import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { F88 } from "../assets";

import { CustomButton, TextInput } from '../components';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { apiRequest } from "../utils";

import { useSelector, useDispatch } from "react-redux";
import { login } from "../redux/userSlice";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { toast } from "react-toastify";

const Auth = () => {

  const [isRegister, setIsRegister] = useState(true);
  const [accountType, setAccountType] = useState("seeker");
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let schema;

  if (isRegister) {
    schema = yup.object().shape({
      email: yup.string().email("Enter a valid email").required("Email Is Required"),
      [accountType === 'seeker' ? 'seekerName' : 'companyName']: yup.string().min(5, 'At least 5 Characters').required(),
      password: yup.string().min(8, 'Length should be at least 8').max(16, 'Length cannot exceed 16'),
    });
  } else if (isForgotPassword) {
    schema = yup.object().shape({
      email: yup.string().email("Enter a valid email").required("Email Is Required"),
    });
  } else {
    schema = yup.object().shape({
      email: yup.string().email("Enter a valid email").required("Email Is Required"),
      password: yup.string().min(8, 'Length should be at least 8').max(16, 'Length cannot exceed 16'),
    });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    let URL = null;

    if (isForgotPassword) {
      URL = accountType === 'seeker' ? '/user/forget-password' : '/companies/forgot-password';
    } else if (isRegister) {
      URL = accountType === 'seeker' ? '/user/register' : '/companies/register';
    } else {
      URL = accountType === 'seeker' ? '/user/login' : '/companies/login';
    }

    const result = await apiRequest({
      url: URL,
      data: data,
      method: "POST"
    });

    if (result.status === 200) {
      const userData = result.data;
      toast.success(userData.message);
      if (!isForgotPassword) {
        const info = { token: userData.token, ...userData.user }
        dispatch(login(info));
      }
    } else {
      console.log(result);
      toast.error(result.error);
    }
  };

  useEffect(() => {
    user?.token && navigate("/");
  }, [user]);

  return (
    <>
      <div className="flex justify-center lg:justify-around items-center h-[80vh]">
        <div className="p-4 w-[26rem] sm:w-[36rem]">
          <div className="rounded-2xl bg-white p-6 text-left shadow-xl">
            <h3 className="text-xl font-semibold text-black">
              {isForgotPassword ? "Forgot Password" : (isRegister ? "Create Account" : "Sign In")}
            </h3>

            <div className="flex items-center justify-center py-2 gap-1">
              <button
                className={`flex-1 px-1 sm:px-4 py-2 rounded text-sm outline-none ${accountType === "seeker" ? "bg-[#1d4fd862] text-blue-700 font-semibold" : "bg-white border border-blue-400"}`}
                onClick={() => setAccountType("seeker")}
              >
                User Account
              </button>

              <button
                className={`flex-1 px-1 sm:px-4 py-2 rounded text-sm outline-none ${accountType !== "seeker" ? "bg-[#1d4fd862] text-blue-900 font-semibold" : "bg-white border border-blue-400"
                  }`}
                onClick={() => setAccountType("company")}
              >
                Company Account
              </button>
            </div>

            <form className="w-full flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                name="email"
                label="Email Address"
                placeholder="email@example.com"
                type="text"
                register={register("email")}
                error={errors.email && errors.email.message}
              />

              {isRegister && (
                <div className="w-full flex gap-1 md:gap-2">
                  <div className="w-full">
                    <TextInput
                      label={accountType === "seeker" ? "Full Name" : "Company Name"}
                      name={accountType === "seeker" ? "seekerName" : "companyName"}
                      placeholder={accountType === "seeker" ? "eg. James John" : "eg. Facebook Inc"}
                      type="text"
                      register={register(accountType === "seeker" ? "seekerName" : "companyName")}
                      error={accountType === "seeker" ? errors.seekerName && errors.seekerName.message : errors.companyName && errors.companyName.message}
                    />
                  </div>
                </div>
              )}

              {!isForgotPassword && (
                <div className="w-full flex gap-1 md:gap-2">
                  <div className="w-full">
                    <TextInput
                      label="Password"
                      name="password"
                      placeholder="Password"
                      type="password"
                      register={register("password")}
                      error={errors.password && errors.password.message}
                    />
                  </div>
                </div>
              )}

              {!isForgotPassword && !isRegister && (
                <div className="text-right text-sm text-blue-600 hover:text-blue-700 cursor-pointer mt-1">
                  <span onClick={() => setIsForgotPassword(true)}>
                    Forgot Password?
                  </span>
                </div>
              )}

              <div className="mt-2">
                <CustomButton
                  type="submit"
                  containerStyles={`inline-flex justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white outline-none hover:bg-blue-800`}
                  title={isForgotPassword ? "Reset Password" : (isRegister ? "Create Account" : "Login")}
                />
              </div>
            </form>

            <div className="mt-4 text-sm">
              <p className="text-gray-700">
                {isForgotPassword ? (
                  <span
                    className="text-blue-600 ml-2 hover:text-blue-700 cursor-pointer"
                    onClick={() => setIsForgotPassword(false)}
                  >
                    Back to {isRegister ? "Create Account" : "Login"}
                  </span>
                ) : (
                  <>
                    {isRegister ? "Already have an account?" : "Don't have an account?"}
                    <span
                      className="text-blue-600 ml-2 hover:text-blue-700 cursor-pointer"
                      onClick={() => setIsRegister((prev) => !prev)}
                    >
                      {isRegister ? "Login" : "Create Account"}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <LazyLoadImage
          alt={"office"}
          effect="blur"
          className="hidden lg:block w-[40rem]"
          src={F88}
        />
      </div>
    </>
  );
};

export default Auth;