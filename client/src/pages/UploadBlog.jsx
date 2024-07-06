import React from "react";
import { useSelector } from 'react-redux';
import { CustomButton, TextInput } from "../components";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";

const UploadBlog = () => {
    const { user } = useSelector(state => state.user);

    // Schema for form validation
    const schema = yup.object().shape({
        title: yup.string().required("Tiêu đề blog là bắt buộc"),
        content: yup.string().required("Nội dung blog là bắt buộc"),
    });

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    // Function to handle form submission
    const onSubmit = async (data) => {
        try {
            const newData = {
                ...data,
                recruiter: user.id // Assuming user.id is the recruiter's ID
            };

            // API request to upload blog
            const result = await apiRequest({
                url: '/blogs/upload-blog',
                method: 'POST',
                data: newData,
                token: user.token,
            });

            if (result.status === 201) {
                toast.success(result.data.message);
                reset(); // Clear form after successful submission
            } else {
                toast.error("Error Occurred");
                console.log(result);
            }
        } catch (error) {
            console.error("Error creating blog:", error.message);
            toast.error("Failed to create blog. Please try again later.");
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='w-full max-w-2xl bg-white px-5 py-10 md:px-10 shadow-md'>
                <p className='text-gray-500 font-semibold text-2xl mb-6 text-center'>Blog Post</p>

                <form
                    className='w-full mt-2 flex flex-col gap-3.5 sm:gap-6'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <TextInput
                        name='title'
                        label='Title Blog'
                        placeholder='eg. What is IT?'
                        type='text'
                        required={true}
                        register={register("title")}
                        error={errors.title && errors.title.message}
                    />

                    <div className='flex flex-col'>
                        <label className='text-gray-600 text-sm mb-1'>
                            Content Blog
                        </label>
                        <textarea
                            className='rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none'
                            rows={8}
                            {...register("content")}
                        />
                        {errors.content && (
                            <span className='text-xs text-red-500 mt-0.5'>
                                {errors.content.message}
                            </span>
                        )}
                    </div>

                    <div className='mt-6'>
                        <CustomButton
                            type='submit'
                            containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                            title='Submit'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadBlog;
