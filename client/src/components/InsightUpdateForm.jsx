import React, { Fragment, useState, useCallback, Suspense, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from 'react-redux';
import { CustomButton, TextInput, Loading } from "../components";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiRequest, handleFileUpload } from "../utils";
import { toast } from "react-toastify";

import MDEditor, { commands as defaultCommands } from '@uiw/react-md-editor';

const InsightUpdateForm = ({ open, setOpen, insightDetails, onUpdate }) => {
    const { user } = useSelector((state) => state.user);
    const [initialData, setInitialData] = useState(null);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        content: yup.string().required("Content is required"),
    });

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    const handleContentChange = useCallback((value) => {
        setContent(value || '');
        setValue('content', value);
    }, [setValue]);

    useEffect(() => {
        if (open && insightDetails) {
            setInitialData(insightDetails);
            setValue('title', insightDetails.title);
            setContent(insightDetails.content);
            setValue('content', insightDetails.content);
        }
    }, [open, insightDetails, setValue]);

    const resetForm = () => {
        if (initialData) {
            setValue('title', initialData.title);
            setContent(initialData.content);
            setValue('content', initialData.content);
        } else {
            reset();
            setContent('');
        }
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const newData = {
                ...data,
                content: content,
            };

            const result = await apiRequest({
                url: `/insights/update-insight/${insightDetails._id}`,
                method: 'PUT',
                data: newData,
                token: user.token,
            });

            if (result.status === 200) {
                toast.success(result.data.message);
                setInitialData({ ...data, content }); // Cập nhật initialData
                onUpdate();
                setOpen(false);
            } else {
                toast.error("Error Occurred");
                console.log(result);
            }
        } catch (error) {
            console.error("Error updating insight:", error.message);
            toast.error("Failed to update insight. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const imageUploadCommand = {
        name: 'custom-image-upload',
        keyCommand: 'custom-image-upload',
        buttonProps: { 'aria-label': 'Upload and insert image' },
        icon: (
            <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
        ),
        execute: async (state, api) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const imageUrl = await handleFileUpload(file);
                        if (imageUrl) {
                            const imageMarkdown = `![${file.name}](${imageUrl})`;
                            api.replaceSelection(imageMarkdown);
                        }
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        toast.error("Failed to upload image. Please try again.");
                    }
                }
            };
            input.click();
        },
    };

    const allCommands = [
        ...defaultCommands.getCommands(),
        imageUploadCommand
    ];

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
                                    Edit Insight Post
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
                                                commands={allCommands}
                                            />
                                        </Suspense>
                                        {errors.content && (
                                            <span className='text-xs text-red-500 mt-0.5'>
                                                {errors.content.message}
                                            </span>
                                        )}
                                    </div>

                                    {isLoading ? <Loading /> : (
                                        <div className='mt-6 flex justify-between'>
                                            <CustomButton
                                                type='submit'
                                                containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none'
                                                title='Update'
                                            />
                                            <CustomButton
                                                type='button'
                                                containerStyles='inline-flex justify-center rounded-md border border-transparent bg-red-600 px-8 py-2 text-sm font-medium text-white focus:outline-none'
                                                title='Cancel'
                                                onClick={() => setOpen(false)}
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

export default InsightUpdateForm;