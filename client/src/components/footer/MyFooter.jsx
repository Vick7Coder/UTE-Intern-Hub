import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

import './MyFooter.module.css';
const MyFooter = () => {
    return (
        <>
  <div>
  <div className="container p-4 bg-white"></div>
    {/* Footer */}
    <footer
      className="text-center text-lg-start text-white"
      style={{ backgroundColor: "#1c2331" }}
    >
      {/* Section: Social media */}
      <section
        className="d-flex justify-content-between p-2"
        style={{ backgroundColor: "#2387F9" }}
      >
        {/* Left */}
        <div className="me-5">
          <span>&emsp; Theo dõi chúng tôi trên mạng xã hội nhé!</span>
        </div>
        {/* Left */}
        {/* Right */}
        <div>
          <a href="" className="text-white me-4">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="" className="text-white me-4">
            <i className="fab fa-twitter" />
          </a>
          <a href="" className="text-white me-4">
            <i className="fab fa-google" />
          </a>
          <a href="" className="text-white me-4">
            <i className="fab fa-instagram" />
          </a>
          <a href="" className="text-white me-4">
            <i className="fab fa-linkedin" />
          </a>
          <a href="" className="text-white me-4">
            <i className="fab fa-github" />
          </a>
        </div>
        {/* Right */}
      </section>
      {/* Section: Social media */}
      {/* Section: Links  */}
      <section className="">
        <div className="container text-center text-md-start mt-5">
          {/* Grid row */}
          <div className="row mt-3">
            {/* Grid column */}
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              {/* Content */}
              <img src={"/images/logo.svg"} alt="logo" style={{ width: "160px", height: "40px" }} />
              <hr
                className="mb-4 mt-0 d-inline-block mx-auto"
                style={{ width: 60, backgroundColor: "#7c4dff", height: 2 }}
              />
              <p>
              Cầu nối vững chắc giữa sinh viên HCMUTE tài năng và doanh nghiệp uy tín, mở ra cánh cửa đến với những cơ hội thực tập giá trị, kiến tạo tương lai nghề nghiệp vững vàng.
              </p>
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              {/* Links */}
              <h6 className="text-uppercase fw-bold">Công việc</h6>
              <hr
                className="mb-4 mt-0 d-inline-block mx-auto"
                style={{ width: 60, backgroundColor: "#7c4dff", height: 2 }}
              />
              <p>
                <a href="#!" className="text-white">
                  Việc làm
                </a>
              </p>
              <p>
                <a href="#!" className="text-white">
                  Blogs
                </a>
              </p>
          
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              {/* Links */}
              <h6 className="text-uppercase fw-bold">Cá nhân</h6>
              <hr
                className="mb-4 mt-0 d-inline-block mx-auto"
                style={{ width: 60, backgroundColor: "#7c4dff", height: 2 }}
              />
              <p>
                <a href="#!" className="text-white">
                  Tài khoản
                </a>
              </p>
              <p>
                <a href="#!" className="text-white">
                  Công việc đã nộp
                </a>
              </p>
              <a className='text-white' href="mailto:vick7784@yahoo.com">Báo lỗi</a>
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              {/* Links */}
              <h6 className="text-uppercase fw-bold">Liên lạc</h6>
              <hr
                className="mb-4 mt-0 d-inline-block mx-auto"
                style={{ width: 60, backgroundColor: "#7c4dff", height: 2 }}
              />
              <p>
                <i className="fas fa-home mr-3" /> Số 1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh
              </p>
              <p>
                <i className="fas fa-envelope mr-3" /> vick7784@yahoo.com
              </p>
              <p>
                <i className="fas fa-phone mr-3" /> 0339018739
              </p>
            </div>
            {/* Grid column */}
          </div>
          {/* Grid row */}
        </div>
      </section>
      {/* Section: Links  */}
      {/* Copyright */}
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2024 Copyright:&nbsp;
        <a className="text-white" href="https://mdbootstrap.com/">
          UTE-INTERN-HUB
        </a>
      </div>
      {/* Copyright */}
    </footer>
    {/* Footer */}
  </div>
  {/* End of .container */}
</>


      );


};
export default MyFooter;