import React, { Fragment, useState, useCallback, Suspense } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from 'react-redux';
import { CustomButton, TextInput } from "../components";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";

const MDEditor = React.lazy(() => import('@uiw/react-md-editor'));

const UploadInsightForm = ({ open, setOpen }) => {
    const { user } = useSelector(state => state.user);
    const [content, setContent] = useState('');

    // Schema for form validation
    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        content: yup.string().required("Content is required"),
    });

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    // Function to handle content change
    const handleContentChange = useCallback((value) => {
        setContent(value || '');
        setValue('content', value); // This updates react-hook-form
    }, [setValue]);

    // Function to handle form submission
    const onSubmit = async (data) => {
        try {
            const newData = {
                ...data,
                content: content,
                recruiter: user.id
            };

            const result = await apiRequest({
                url: '/insights/upload-insight',
                method: 'POST',
                data: newData,
                token: user.token,
            });

            if (result.status === 201) {
                toast.success(result.data.message);
                reset();
                setContent('');
                setOpen(false);
                window.location.reload();
            } else {
                toast.error("Error Occurred");
                console.log(result);
            }
        } catch (error) {
            console.error("Error creating insight:", error.message);
            toast.error("Failed to create insight. Please try again later.");
        }
    };

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-semibold leading-6 text-gray-900 mb-4"
                                >
                                    Insight Post
                                </Dialog.Title>

                                <form
                                    className='w-full mt-2 flex flex-col gap-3.5 sm:gap-6'
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <TextInput
                                        name='title'
                                        label='Title insight'
                                        placeholder='eg. What is IT?'
                                        type='text'
                                        required={true}
                                        register={register("title")}
                                        error={errors.title && errors.title.message}
                                    />

                                    <div className='flex flex-col'>
                                        <label className='text-gray-600 text-sm mb-1'>
                                            Content Insight
                                        </label>
                                        <Suspense fallback={<div>Loading editor...</div>}>
                                            <MDEditor
                                                value={content}
                                                onChange={handleContentChange}
                                            />
                                        </Suspense>
                                        {errors.content && (
                                            <span className='text-xs text-red-500 mt-0.5'>
                                                {errors.content.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className='mt-6 flex justify-between'>
                                        <CustomButton
                                            type='submit'
                                            containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none'
                                            title='Submit'
                                        />
                                        <CustomButton
                                            type='button'
                                            containerStyles='inline-flex justify-center rounded-md border border-transparent bg-red-600 px-8 py-2 text-sm font-medium text-white focus:outline-none'
                                            title='Cancel'
                                            onClick={() => setOpen(false)}
                                        />
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default UploadInsightForm;