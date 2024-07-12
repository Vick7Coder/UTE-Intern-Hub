import { useEffect, useState, Fragment } from "react";
import { useSelector } from 'react-redux'
import { CustomButton, JobCard, JobTypes, TextInput } from "../components";
import { Listbox, Transition } from "@headlessui/react";
import { BsCheck2, BsChevronExpand } from "react-icons/bs";

import * as yup from 'yup'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";

const experienceOptions = [
  { title: "1 Year", value: "1" },
  { title: "2 Year", value: "2" },
  { title: "3 Year", value: "3" },
  { title: "4 Year", value: "4" },
  { title: "Fresh graduate", value: "5" },
];

const UploadJob = () => {
  const { user } = useSelector(state => state.user);
  const { companyInfo } = useSelector(state => state.cmp);

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
  })

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm({
    mode: "onChange",
    defaultValues: {},
    resolver: yupResolver(schema)
  });

  const [jobType, setJobType] = useState("Hybrid");
  const [experience, setExperience] = useState(experienceOptions[0]);
  const [recentJobs, setRecentJobs] = useState([])

  const onSubmit = async (data) => {
    let newData = { ...data, jobType, experience: experience.value }

    const result = await apiRequest({
      url: '/jobs/upload-job',
      token: user.token,
      data: newData,
      method: 'POST'
    })

    if (result.status === 200) {
      toast.success(result.data.message)
    }
    else {
      console.log(result)
      toast.error("Error Occurred")
    }
  };

  const getRecentJobs = async () => {
    const id = user.id;

    const result = await apiRequest({
      url: '/companies/get-company/' + id,
      token: user.token,
      method: "GET"
    })

    result.status === 200 ? (
      setRecentJobs(result.data.data.jobPosts)) :
      console.log(result)
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
    getRecentJobs()
  }, [isSubmitSuccessful])

  return (
    <div className='mx-auto flex flex-col md:flex-row gap-8 2xl:gap-14 bg-[#f7fdfd] px-5'>
      <div className='w-full h-fit md:w-2/3 2xl:w-2/4 bg-white px-5 py-10 md:px-10 shadow-md'>
        <div>
          <p className='text-gray-500 font-semibold text-2xl'>Job Post</p>

          <form
            className='w-full mt-2 flex flex-col gap-3.5 sm:gap-6'
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name='jobTitle'
              label='Job Title'
              placeholder='eg. Java Intern'
              type='text'
              required={true}
              register={register("jobTitle")}
              error={errors.jobTitle && errors.jobTitle?.message}
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
                  placeholder='eg: 10.000.000VND  or Agreement'
                  type='text'
                  register={register("salary")}
                  error={errors.salary && errors.salary?.message}
                />
              </div>
            </div>

            <div className='w-full sm:flex gap-4'>
              <div className='w-full sm:w-1/2'>
                <TextInput
                  name='vacancies'
                  label='No. of Vacancies'
                  placeholder='vacancies'
                  type='text'
                  register={register("vacancies")}
                  error={errors.vacancies && errors.vacancies?.message}
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
              placeholder='eg. Thu Duc'
              type='text'
              register={register("location")}
              error={errors.location && errors.location?.message}
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

            <div className='mt-2'>
              <CustomButton
                type='submit'
                containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                title='Submit'
              />
            </div>
          </form>
        </div>
      </div>

      <div className='w-full md:w-1/3 2xl:w-2/4 p-5'>
        <p className='text-gray-500 font-semibold mb-4'>Recent Job Post</p>

        <div className='w-full flex flex-wrap gap-6'>
          {recentJobs.slice(0, 4).map((job) => {
            const data = {
              name: companyInfo?.name,
              email: companyInfo?.email,
              logo: companyInfo?.profileUrl,
              ...job,
            };

            return <JobCard data={data} key={job._id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default UploadJob;