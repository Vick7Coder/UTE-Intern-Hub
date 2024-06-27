import React from "react";
import { JobImg } from "../assets";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const About = () => {
  return (
    <div className='container mx-auto flex flex-col gap-5 2xl:gap-14 py-6 '>

      <div className='w-full flex flex-col-reverse md:flex-row gap-10 items-center px-5 pt-5'>
        <div className='w-full md:w-2/3 2xl:w-2/4'>
          <h3 className='text-3xl text-blue-600 font-bold mb-5'>Discover your path to success</h3>
          <p className='text-justify leading-7'>
            In today's competitive job market, finding the right internship or job opportunity can feel like navigating a dense jungle. UTEInternHUB is here to be your compass, guiding Ho Chi Minh City University of Technology and Education (HCMUTE) students like you towards a successful career path. We understand the challenges you face: information overload from endless job boards, the lack of experience required for many entry-level positions, and the uncertainty of choosing the right career path.
          </p>
        </div>

        <LazyLoadImage
          alt={'About'}
          effect="blur"
          src={JobImg}
          className="w-auto md:w-[56rem] h-[180px] sm:h-[260px]" />
      </div>

      <div className='leading-8 px-5 text-justify'>
        <p>
          That's where we come in. UTEInternHUB cuts through the noise and provides you with a clear path forward. We handpick high-quality internships and entry-level jobs specifically for HCMUTE students, saving you time and effort. Our internships offer real-world experience, allowing you to apply your knowledge and build valuable skills. We also provide career guidance resources and tools to help you identify your strengths, explore different paths, and make informed decisions about your future. Plus, our supportive community of fellow students and alumni is always there to offer advice and encouragement.
          <br />Join us on this journey and discover your path to success!
          <br /> <strong>Thank you!</strong><br />
          <strong>UTEInternHUB - Your Compass in the Job Search Jungle</strong>
        </p>
      </div>
    </div>
  );
};

export default About;
