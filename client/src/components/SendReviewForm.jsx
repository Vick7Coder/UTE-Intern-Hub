import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { CustomButton, Loading } from ".";

import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { apiRequest, handleFileUpload } from "../utils";
import { toast } from "react-toastify";

const SendReviewForm = ({ open, setOpen, seekerInfo }) => {
    const { user } = useSelector((state) => state.user);

    // Kiểm tra xem người dùng có phải là company không
    if (user.accountType !== 'company') {
        return null; // Không render form nếu không phải company
    }

    const schema = yup.object().shape({
        confirmObjective: yup.boolean()
            .oneOf([true], "You must confirm that this review is objective")
            .required(),
        confirmFair: yup.boolean()
            .oneOf([true], "You must confirm that this review is fair and unbiased")
            .required(),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema)
    });

    const [reviewFile, setReviewFile] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);

        const reviewURL = reviewFile && (await handleFileUpload(reviewFile));

        if (!reviewURL) {
            toast.error("Failed to upload review file.");
            setIsLoading(false);
            return;
        }

        const result = await apiRequest({
            url: '/user/upload-review',
            token: user.token,
            data: { review: reviewURL, seekerId: seekerInfo._id },
            method: "PUT"
        });

        if (result.status === 200) {
            setIsLoading(false);
            toast.success("Review uploaded successfully!");
            setOpen(false);
        } else {
            console.log(result);
            setIsLoading(false);
            toast.error("Error occurred while uploading review");
        }
    };

    const closeModal = () => setOpen(false);

    return (
        <>
            <Transition appear show={open ?? false} as={Fragment}>
                <Dialog as='div' className='relative z-10' onClose={closeModal}>
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
                                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                    <Dialog.Title
                                        as='h3'
                                        className='text-lg font-semibold leading-6 text-gray-900'
                                    >
                                        Upload Review
                                    </Dialog.Title>
                                    <form
                                        className='w-full mt-2 flex flex-col gap-5'
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <div className='w-full'>
                                            <label className='text-gray-600 text-sm mb-1'>
                                                Review File
                                            </label>
                                            <input
                                                type='file'
                                                onChange={(e) => setReviewFile(e.target.files[0])}
                                                required
                                                className='w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100'
                                            />
                                        </div>

                                        <div className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                id='confirmObjective'
                                                {...register('confirmObjective')}
                                                className='mr-2'
                                            />
                                            <label htmlFor='confirmObjective' className='text-sm text-gray-700'>
                                                I confirm that this review is objective
                                            </label>
                                        </div>
                                        {errors.confirmObjective && (
                                            <p className='text-red-500 text-xs'>{errors.confirmObjective.message}</p>
                                        )}

                                        <div className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                id='confirmFair'
                                                {...register('confirmFair')}
                                                className='mr-2'
                                            />
                                            <label htmlFor='confirmFair' className='text-sm text-gray-700'>
                                                I confirm that this review is fair and unbiased
                                            </label>
                                        </div>
                                        {errors.confirmFair && (
                                            <p className='text-red-500 text-xs'>{errors.confirmFair.message}</p>
                                        )}

                                        <div className='mt-4'>
                                            {isLoading ? (
                                                <Loading />
                                            ) : (
                                                <div className='flex justify-between'>
                                                    <CustomButton
                                                        type='submit'
                                                        containerStyles='rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none'
                                                        title='Submit'
                                                    />
                                                    <CustomButton
                                                        type='button'
                                                        containerStyles='rounded-md border border-transparent bg-red-600 px-8 py-2 text-sm font-medium text-white focus:outline-none'
                                                        title='Cancel'
                                                        onClick={closeModal}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default SendReviewForm;