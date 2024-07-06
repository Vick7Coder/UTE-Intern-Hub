// src/components/BlogUpdateForm.jsx
import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from 'react-redux';
import { CustomButton, TextInput, Loading } from "../components";
import { apiRequest } from "../utils";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BlogUpdateForm = ({ open, setOpen, blogDetails }) => {
    const { user } = useSelector((state) => state.user);
    const { id } = useParams();

    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        content: yup.string().required("Content is required"),
    });

    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);

        const result = await apiRequest({
            url: `/blogs/update-blog/${id}`,
            token: user.token,
            data: data,
            method: 'PUT'
        });

        if (result.status === 200) {
            toast.success(result.data.message);
            setIsLoading(false);
        } else {
            console.log(result);
            setIsLoading(false);
            toast.error("Something went wrong!");
        }
    };

    // Clear form data after successful submission
    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
            blogDetails();
            setOpen(false);
        }
    }, [isSubmitSuccessful]);

    const closeModal = () => setOpen(false);

    return (
        <Transition appear show={open ?? false} as={Fragment}>
            <Dialog as='div' className='relative z-50' onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black bg-opacity-25' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                <Dialog.Title as='h3' className='text-lg font-semibold leading-6 text-gray-900'>
                                    Edit Blog Post
                                </Dialog.Title>

                                <form className='w-full mt-2 flex flex-col gap-3.5 sm:gap-6' onSubmit={handleSubmit(onSubmit)}>
                                    <TextInput
                                        name='title'
                                        label='Title'
                                        placeholder='Enter the title'
                                        type='text'
                                        required={true}
                                        register={register("title")}
                                        error={errors.title && errors.title.message}
                                    />

                                    <div className='flex flex-col'>
                                        <label className='text-gray-600 text-sm mb-1'>
                                            Content
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

                                    {isLoading ? <Loading /> : (
                                        <div className='mt-2 flex justify-between'>
                                            <CustomButton
                                                type='submit'
                                                containerStyles='rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                                                title='Submit'
                                            />
                                            <CustomButton
                                                type='button'
                                                containerStyles='rounded-md border border-transparent bg-red-600 px-8 py-2 text-sm font-medium text-white focus:outline-none '
                                                title='Cancel'
                                                onClick={closeModal}
                                            />
                                        </div>
                                    )}
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default BlogUpdateForm;
