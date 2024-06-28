import { useEffect, useState } from "react";
import {useSelector} from 'react-redux'
import { CustomButton, JobCard, JobTypes, TextInput } from "../components";


import * as yup from 'yup'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiRequest } from "../utils";
import { toast } from "react-toastify";


const UploadJob = () => {

  const {user} = useSelector(state=>state.user);
  const {companyInfo} = useSelector(state=>state.cmp);

  const schema = yup.object().shape({
    jobTitle:yup.string().required(),
    salary:yup.string().required(),

    vacancies:yup.number()
    .typeError('Vacancies must be a number')
    .positive('Vacancies must be a positive number')
    .integer('Vacancies must be an integer')
    .required(),

    experience: yup.string().required(),
    location:yup.string().required(),
    description:yup.string().required(),
    requirements:yup.string().required()
  })

  const {register,handleSubmit,formState: { errors , isSubmitSuccessful}, reset } = useForm({
    mode: "onChange",
    defaultValues: {},
    resolver:yupResolver(schema)
  });

  const [jobType, setJobType] = useState("Full-Time");
  const [recentJobs, setRecentJobs] = useState([])


  const onSubmit = async (data) => {

    let newData = {...data,jobType}
    
    const result = await apiRequest({
      url: '/jobs/upload-job',
      token: user.token,
      data:newData,
      method:'POST'
    })

    if(result.status === 200){
      // console.log(result)
      toast.success(result.data.message)
    }
    else{
      console.log(result)
      toast.error("Error Occured")
    }
  };




  const getRecentJobs = async()=>{

    const id = user.id;

    const result = await apiRequest({
      url:'/companies/get-company/' + id,
      token:user.token,
      method:"GET"
    })

    result.status === 200 ? (

      setRecentJobs(result.data.data.jobPosts) ) : 

      console.log(result)

  }

   // clear form data after successfull submission
   useEffect(()=>{

    if(isSubmitSuccessful){

      reset()
    }
    getRecentJobs()
  },[isSubmitSuccessful])
 

  return (
    <div className=' mx-auto flex flex-col md:flex-row gap-8 2xl:gap-14 bg-[#f7fdfd] px-5'>
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
              placeholder='eg. Software Engineer'
              type='text'
              required={true}
              register={register("jobTitle")}
              error={errors.jobTitle && errors.jobTitle?.message }
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
                  error={errors.salary && errors.salary?.message }
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
                  error={errors.vacancies && errors.vacancies?.message }
                />
              </div>

              <div className='w-full sm:w-1/2'>
                <TextInput
                  name='experience'
                  label='Years of university study'
                  placeholder='0 - 2'
                  type='text'
                  register={register("experience")}
                  error={errors.experience && errors.experience?.message }
                />
              </div>
            </div>

            <TextInput
              name='location'
              label='Job Location'
              placeholder='eg. New York'
              type='text'
              register={register("location")}
              error={errors.location && errors.location?.message }
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
                title='Sumbit'
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

            return<JobCard data={data}  key={job._id}/>;
          })}
        </div>
      </div>
    </div>
  );
};

export default UploadJob;
