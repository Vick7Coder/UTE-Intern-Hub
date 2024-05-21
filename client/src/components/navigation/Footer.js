import React from "react"

const Footer = () => <footer className="page-footer font-small blue pt-4">
    <hr />
    <div className="container-fluid text-center text-md-left">
        <div className="row">
            <div className="col-md-6 mt-md-0 mt-3">
                <h5 className="text-uppercase"> <b>UTEINTERNHUB</b> - Discover Your Path To Success</h5>
                <p>Đến với chúng tôi là đến với sự nghiệp của bạn!</p>
            </div>

            <hr className="clearfix w-100 d-md-none pb-0" />

            <div className="col-md-3 mb-md-0 mb-3">
                <h5 className="text-uppercase">MENU</h5>
                <ul className="list-unstyled">
                    <li><a href="#!">Việc làm</a></li>
                    <li><a href="#!">Công ty</a></li>
                    <li><a href="#!">Hồ sơ</a></li>
                </ul>
            </div>

            <div className="col-md-3 mb-md-0 mb-3">
                <h5 className="text-uppercase">Links</h5>
                <ul className="list-unstyled">
                    <li><a href="#!">Tạo CV miễn phí</a></li>
                    <li><a href="#!">Việc làm IT</a></li>
                    <li><a href="#!">Việc làm nước ngoài</a></li>
                </ul>
            </div>
        </div>
    </div>

    <div className="footer-copyright text-center py-3">© 2024 Copyright:
        <a href="https://mdbootstrap.com/"> UTEINTERNHUB</a>
    </div>

</footer>

export default Footer