import { GoLocation } from "react-icons/go";
import moment from "moment"; //job posted time
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";

const JobCard = ({ data, user }) => {

  return (
    <Link to={user ? `/applicants/${data?._id}` : `/job-details/${data?._id}`} >
      <div className=' relative w-[17rem] xl:w-[20rem] 2xl:w-[18rem] h-[16rem] bg-white flex flex-col shadow-lg rounded-md px-3 py-5 gap-4 overflow-hidden' >
        <div className='flex gap-6'>
          <img
            src={data?.logo ?? NoProfile}
            alt={data?.name}
            className='w-14 h-14'
          />
          <div >
            <p className='text-lg font-semibold'>{data?.jobTitle?.length > 20 ? data?.jobTitle.slice(0, 20) + "..." : data?.jobTitle}</p>
            <span className='flex gap-2 items-center break-words'>
              <GoLocation className='text-slate-900 text-sm' />
              {data?.location}
            </span>
          </div>
        </div>

        <div className='py-2'>
          <p className='text-base gap-2 break-words'> {data?.detail?.description?.slice(0, 120) + "..."}  </p>
        </div>

        <div className='absolute bottom-2 left-2'>
          <p className='bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-1.5 rounded font-semibold text-sm'>
            {data?.jobType}
          </p>
        </div>
        <div className='absolute bottom-2 right-2'>
          <span className='text-gray-500 text-sm'>
            {moment(data?.createdAt).fromNow()}
          </span>
        </div>

      </div>
    </Link>
  )
};

export default JobCard;
