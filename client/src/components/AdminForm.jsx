import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { CustomButton, Loading, TextInput } from ".";

import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { apiRequest, handleFileUpload } from "../utils";
import { toast } from "react-toastify";


const AdminForm = ({ open, setOpen }) => {

    const { user } = useSelector((state) => state.user);

    const updateSchema = yup.object().shape({
        name: yup.string().min(6, 'Atleast 6 Characters').required(),
        location: yup.string().min(4, 'Atleast 4 Characters').required(),
        contact: yup.string().min(10, 'Enter a valid contact').required(),
        about: yup.string().min(80, 'Tell us about your admin').required(),
    })

    const { register, handleSubmit, formState: { errors }, } =
        useForm({
            mode: "onChange",
            defaultValues: { ...user },
            resolver: yupResolver(updateSchema)
        });



    const [profileImage, setProfileImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);



    const onSubmit = async (data) => {

        setIsLoading(true)

        const logoURL = profileImage &&

            (await handleFileUpload(profileImage))

        const updatedData = logoURL ? {
            ...data,
            profileUrl: logoURL
        } : data

        const result = await apiRequest({
            url: '/admin/update-admin',
            token: user.token,
            data: updatedData,
            method: "PUT"
        })

        if (result.status === 200) {
            setIsLoading(false)

            // console.log(result)

            toast.success(result.data.message)

            //changing local storage name value if user changes name.
            let storeData = JSON.parse(localStorage.getItem('user'))
            storeData.name = data.name;

            localStorage.setItem("user", JSON.stringify(storeData));

            setTimeout(() => {

                window.location.reload();

            }, 900);

        } else {
            console.log(result)
            setIsLoading(false)
            toast.error("error ocurred")
        }
    };

    const closeModal = () => setOpen(false);


    return (
        <>
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
                                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                    <Dialog.Title
                                        as='h3'
                                        className='text-lg font-semibold leading-6 text-gray-900'
                                    >
                                        Edit Admin Profile
                                    </Dialog.Title>

                                    <form
                                        className='w-full mt-2 flex flex-col gap-5'
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <TextInput
                                            name='name'
                                            label='Admin Name'
                                            type='text'
                                            register={register("name")}
                                            error={errors.name && errors.name.message}
                                        />

                                        <TextInput
                                            name='location'
                                            label='Location/Address'
                                            placeholder='eg. Califonia'
                                            type='text'
                                            register={register("location")}
                                            error={errors.location && errors.location.message}
                                        />

                                        <div className='w-full flex items-center gap-2'>
                                            <div className='w-1/2'>
                                                <TextInput
                                                    name='contact'
                                                    label='Contact'
                                                    placeholder='Contact'
                                                    length='10'
                                                    type='text'
                                                    register={register("contact")}
                                                    error={errors.contact && errors.contact.message}
                                                />
                                            </div>

                                            <div className='w-1/2 mt-2'>
                                                <label className='text-gray-600 text-sm mb-1'>
                                                    Admin Logo
                                                </label>
                                                <input
                                                    type='file'
                                                    onChange={(e) => setProfileImage(e.target.files[0])}
                                                />
                                            </div>
                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-gray-600 text-sm mb-1'>
                                                About Admin
                                            </label>

                                            <textarea
                                                className='ounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none'
                                                rows={4}
                                                cols={6}
                                                {...register("about")}
                                            />
                                            {errors.about && (
                                                <span className='text-xs text-red-500 mt-0.5'
                                                >
                                                    {errors.about.message}
                                                </span>
                                            )}
                                        </div>

                                        <div className='mt-4'>
                                            {
                                                isLoading ? <Loading /> :
                                                    (
                                                        <div className="flex justify-between">
                                                            <CustomButton
                                                                type='submit'
                                                                containerStyles=' rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                                                                title={"Submit"}
                                                            />
                                                            <CustomButton
                                                                type='button'
                                                                containerStyles=' rounded-md border border-transparent bg-red-600 px-8 py-2 text-sm font-medium text-white focus:outline-none '
                                                                title='Cancel'
                                                                onClick={() => setOpen(false)}
                                                            />
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
export default AdminForm;