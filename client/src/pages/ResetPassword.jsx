import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";


const ResetPassword = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .required("Required")
                .min(6, "Too Short!"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                .required("Required"),
        }),
        onSubmit: async (values) => {
            const { newPassword } = values;
            const token = window.location.pathname.split("/").pop();
            const decodedToken = jwtDecode(token);
            const usertype = decodedToken.userType;
            try {
                const response = await apiRequest({
                    url: `${usertype}/reset-password/${token}`,
                    data: { newPassword },
                    method: "POST",
                });
                if (response && response.status === 200) {
                    toast.success(response.data.message);
                    setTimeout(() => {
                        window.close();
                    }, 5000);
                } else {
                    toast.error(response.error || "An error occurred"); // Xử lý lỗi từ apiRequest
                }
            } catch (error) {
                toast.error("Your link has expired or an error occurred."); // Xử lý lỗi nếu có
            }
        },
    });

    return (
        <div className="flex justify-center lg:justify-around items-center h-[80vh]">
            <div className="p-4 w-[26rem] sm:w-[36rem]">
                <div className="rounded-2xl bg-white p-6 text-left shadow-xl">
                    <h3 className="text-xl font-semibold text-black text-center mb-6">
                        Reset Password
                    </h3>

                    <form className="w-full flex flex-col gap-1" onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                {...formik.getFieldProps("newPassword")}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.newPassword && formik.errors.newPassword ? "border-red-500" : ""
                                    }`}
                            />
                            {formik.touched.newPassword && formik.errors.newPassword ? (
                                <p className="text-red-500 text-xs italic">{formik.errors.newPassword}</p>
                            ) : null}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...formik.getFieldProps("confirmPassword")}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""
                                    }`}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <p className="text-red-500 text-xs italic">{formik.errors.confirmPassword}</p>
                            ) : null}
                        </div>

                        <div className="mt-2">
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white outline-none hover:bg-blue-800"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;