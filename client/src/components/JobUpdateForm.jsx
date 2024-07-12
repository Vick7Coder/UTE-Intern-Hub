import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { useSelector } from 'react-redux';
import { BsCheck2, BsChevronExpand } from "react-icons/bs";

import { CustomButton, TextInput, Loading, JobTypes } from "../components";
import { apiRequest } from "../utils";

import * as yup from 'yup'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const experienceOptions = [
  { title: "1 Year", value: "1" },
  { title: "2 Year", value: "2" },
  { title: "3 Year", value: "3" },
  { title: "4 Year", value: "4" },
  { title: "Fresh graduate", value: "5" },
];

const JobUpdateForm = ({ open, setOpen, jobDetails, currentJobData }) => {
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();

  const schema = yup.object().shape({
    jobTitle: yup.string().required(),
    salary: yup.string().required(),
    vacancies: yup.number()
      .typeError('Vacancies must be a number')
      .positive('Vacancies must be a positive number')
      .integer('Vacancies must be an integer')
      .required(),
    location: yup.string().required(),
    description: yup.string().required(),
    requirements: yup.string().required()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [jobType, setJobType] = useState(currentJobData?.jobType || "Full-Time");
  const [experience, setExperience] = useState(experienceOptions[0]);

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      jobTitle: currentJobData?.jobTitle || "",
      salary: currentJobData?.salary || "",
      vacancies: currentJobData?.vacancies || "",
      location: currentJobData?.location || "",
      description: currentJobData?.detail?.description || "",
      requirements: currentJobData?.detail?.requirements || "",
    }
  });

  useEffect(() => {
    if (currentJobData) {
      setValue("jobTitle", currentJobData.jobTitle);
      setValue("salary", currentJobData.salary);
      setValue("vacancies", currentJobData.vacancies);
      setValue("location", currentJobData.location);
      setValue("description", currentJobData.detail?.description);
      setValue("requirements", currentJobData.detail?.requirements);
      setJobType(currentJobData.jobType);
      setExperience(experienceOptions.find(opt => opt.value === currentJobData.experience) || experienceOptions[0]);
    }
  }, [currentJobData, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true)

    let updatedData = { ...data, jobType, experience: experience.value }

    const result = await apiRequest({
      url: `/jobs/update-job/${id}`,
      token: user.token,
      data: updatedData,
      method: 'PUT'
    })

    if (result.status === 200) {
      toast.success(result.data.message)
      setIsLoading(false)
    }
    else {
      console.log(result)
      setIsLoading(false)
      toast.error("Something Went Wrong!")
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
      jobDetails();
      setOpen(false);
    }
  }, [isSubmitSuccessful])

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
                <Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-semibold leading-6 text-gray-900'
                  >
                    Edit Job Post
                  </Dialog.Title>

                  <form
                    className='w-full mt-2 flex flex-col gap-3.5 sm:gap-6'
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <TextInput
                      name='jobTitle'
                      label='Job Title'
                      placeholder='eg. Software Engineer'
                      type='text'
                      required={true}
                      register={register("jobTitle")}
                      error={errors.jobTitle && errors.jobTitle.message}
                    />

                    <div className='w-full sm:flex gap-4'>
                      <div className={`w-full sm:w-1/2 mt-[0.45rem]`}>
                        <label className='text-gray-600 text-sm mb-1'>Job Type</label>
                        <JobTypes jobType={jobType} setJobType={setJobType} />
                      </div>

                      <div className='w-full sm:w-1/2'>
                        <TextInput
                          name='salary'
                          label='Salary'
                          placeholder='eg: 1 - 2 LPA  or 15000'
                          type='text'
                          register={register("salary")}
                          error={errors.salary && errors.salary.message}
                        />
                      </div>
                    </div>

                    <div className='w-full sm:flex  gap-4'>
                      <div className='w-full sm:w-1/2'>
                        <TextInput
                          name='vacancies'
                          label='No. of Vacancies'
                          placeholder='vacancies'
                          type='text'
                          register={register("vacancies")}
                          error={errors.vacancies && errors.vacancies.message}
                        />
                      </div>

                      <div className='w-full sm:w-1/2'>
                        <label className='text-gray-600 text-sm mb-1'>Years of university study</label>
                        <Listbox value={experience} onChange={setExperience}>
                          <div className='relative mt-1'>
                            <Listbox.Button className='relative w-full cursor-default rounded border border-gray-400 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm'>
                              <span className='block truncate'>{experience.title}</span>
                              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                                <BsChevronExpand
                                  className='h-5 w-5 text-gray-400'
                                  aria-hidden='true'
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave='transition ease-in duration-100'
                              leaveFrom='opacity-100'
                              leaveTo='opacity-0'
                            >
                              <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                                {experienceOptions.map((option, optionIdx) => (
                                  <Listbox.Option
                                    key={optionIdx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                      }`
                                    }
                                    value={option}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                            }`}
                                        >
                                          {option.title}
                                        </span>
                                        {selected ? (
                                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600'>
                                            <BsCheck2 className='h-5 w-5' aria-hidden='true' />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                    </div>

                    <TextInput
                      name='location'
                      label='Job Location'
                      placeholder='eg. New York'
                      type='text'
                      register={register("location")}
                      error={errors.location && errors.location.message}
                    />
                    <div className='flex flex-col'>
                      <label className='text-gray-600 text-sm mb-1'>
                        Job Description
                      </label>
                      <textarea
                        className='rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none'
                        rows={4}
                        cols={6}
                        {...register("description")}
                      />
                      {errors.description && (
                        <span className='text-xs text-red-500 mt-0.5'>
                          {errors.description?.message}
                        </span>
                      )}
                    </div>

                    <div className='flex flex-col'>
                      <label className='text-gray-600 text-sm mb-1'>
                        Requirements
                      </label>
                      <textarea
                        className='rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none'
                        rows={4}
                        cols={6}
                        {...register("requirements")}
                      />
                      {errors.requirements && (
                        <span className='text-xs text-red-500 mt-0.5'>
                          {errors.requirements.message}
                        </span>
                      )}
                    </div>

                    {
                      isLoading ? <Loading /> :
                        (
                          <div className='mt-2 flex justify-between'>
                            <CustomButton
                              type='submit'
                              containerStyles='rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                              title='Submit'
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

export default JobUpdateForm