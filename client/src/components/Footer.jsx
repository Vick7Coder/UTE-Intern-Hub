import { Link } from "react-router-dom";
import { FaLinkedinIn } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";


const Footer = () => {
  return (
    <footer className='text-white relative w-full bg-[#3586ff] min-h-[100px] py-6 mt-40'>


      <div>
        <div className="wave" id="wave1"></div>
        <div className="wave" id="wave2"></div>
        <div className="wave" id="wave3"></div>
        <div className="wave" id="wave4"></div>
      </div>


      <div >
        <ul className="flex justify-center gap-5 text-xl flex-wrap list-none">

          <li className=" hover:scale-125 transition ease-in-out duration-300  border p-1 rounded">
            <Link to={"https://www.linkedin.com"} target="_blank" ><FaLinkedinIn /></Link>
          </li>
          <li className="hover:scale-125 transition ease-in-out duration-300  border p-1 rounded">
            <Link to={"https://github.com"} target="_blank"><IoLogoGithub /></Link>
          </li>
          <li className="hover:scale-125 transition ease-in-out duration-300 border p-1 rounded ">
            <Link to={"https://www.instagram.com"} target="_blank"><FiInstagram /></Link>
          </li>
          <li className=" hover:scale-125  transition ease-in-out duration-300 border p-1 rounded ">
            <Link> <FaXTwitter /> </Link>
          </li>
        </ul>

        <ul className="flex justify-center gap-5 text-md flex-wrap list-none my-5 [&>*]:opacity-100 [&>*:hover]:opacity-75">
          {/* we use [&>*], so we can target childrens */}
          <li>
            <Link to={'/'}>Home</Link>
          </li>
          <li>
            <Link to={'/about-us'}>About Us</Link>
          </li>
          <li>
            <Link to={'/'}>Services</Link>
          </li>
          <li>
            <Link to={'/'}>Contact</Link>
          </li>
          <li>
            <Link to={'/'}>Feedback</Link>
          </li>
        </ul>

        <p className="text-md text-center">&copy; 2024 UteInternHub - All Rights Reserved</p>
      </div>


    </footer>
  )
}

export default Footer