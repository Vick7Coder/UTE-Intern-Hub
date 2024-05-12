// import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Container, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import classes from "./Register.module.css";
import {
  NumberInput,
  SelectInput,
  TextInput,
} from "../../components/dashboard/ManageUsers/AddUsersFormik/fields/FieldInputs";
import SpinnerComponent from "../../components/UI/SpinnerComponent";

const Register = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();

  let initialValues = {
    name: "",
    email: "",
    password: "",
    mobile: "",
    age: "",
    gender: "",
    qualification: "",
    experience: "",
    role: "User",
  };

  const formSubmitHandler = (values, setSubmitting) => {
    setShowSpinner(true);
    axios
      .post(`http://localhost:8080/auth/register`, { ...values })
      .then((res) => {
        setShowSpinner(false);
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/login", { replace: true });
      })
      .catch((err) => {
        setShowSpinner(false);
        toast.error("Oops something went wrong", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log(err);
      });
  };
  return (
    <React.Fragment>
      <Container style={{ paddingTop: "40px" }}>
        <h1 className="p-3 text-center rounded" style={{ color: "#1679AB", fontSize: "32px" }}>
          Đăng ký tài khoản cho người mới tại đây !
        </h1>
        {showSpinner && <SpinnerComponent />}
        <Row className="mb-5">
          <Col
            lg={7}
            md={6}
            sm={12}
            className={`${classes.formContainer} p-5 m-auto shadow-sm rounded-lg`}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                name: Yup.string()
                  .min(4, "Name should be more than 4 characters")
                  .max(25, "Name should be less than 25 characters")
                  .required("Name is a required field"),
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Email is a required field"),
                password: Yup.string()
                  .min(6, "Password must be minimum 6 characters")
                  .required("Password is a required field"),
                mobile: Yup.string()
                  .required("Phone number is required")
                  .matches(/^[0-9]+$/, "Must be only digits")
                  .min(10, "Must be exactly 10 digits")
                  .max(10, "Must be exactly 10 digits"),
                gender: Yup.string().required("Gender Required"),
                age: Yup.number()
                  .max(60, "Age should be less than or equal to 60")
                  .min(18, "Age should be greater than or equal to 18")
                  .required("Age Required"),
                qualification: Yup.string().required("Qualification Required"),
                experience: Yup.string(),
                role: Yup.string(),
              })}
              onSubmit={(values, { setSubmitting }) => {
                const editedValues = { ...props.userInfo, ...values };
                formSubmitHandler(editedValues, setSubmitting);
              }}
            >
              {(formik) => (
                <div className={classes.main}>
                  <Form>
                    <div className={classes.formInputs}>
                      <TextInput
                        label="Tên tài khoản"
                        id="name"
                        name="name"
                        placeholder="Nhập tên cá nhân hoặc tên tổ chức (nếu là tổ chức)"
                        mandatory={"true"}
                      />
                    </div>
                    <div className={classes.formInputs}>
                      <TextInput
                        label="Tài khoản"
                        id="email"
                        name="email"
                        placeholder="Nhập Email"
                        mandatory={"true"}
                      />
                    </div>
                    <div className={classes.formInputs}>
                      <TextInput
                        label="Mật khẩu"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        mandatory={"true"}
                      />
                    </div>
                    <div className={classes.formInputs}>
                      <TextInput
                        label="Liên hệ"
                        id="mobile"
                        name="mobile"
                        placeholder="Nhập số điện thoại"
                        mandatory={"true"}
                      />
                    </div>
                    <div className={classes["formInputs__side"]}>
                      <div
                        className={`${classes["formInputs__side__inner"]} ${classes.age}`}
                      >
                        <NumberInput
                          label="Tuổi"
                          name="age"
                          id="age"
                          placeholder="Nhập tuổi của bạn / công ty"
                          mandatory={"true"}
                        />
                      </div>
                      <div className={classes["formInputs__side__inner"]}>
                        <label>
                          Giới tính<span className="text-danger">*</span>
                        </label>
                        <div className={classes.gender}>
                          <div>
                            <Field
                              type="radio"
                              value="Male"
                              name="gender"
                              id="Male"
                            />
                            <label htmlFor="Male">Nam</label>
                          </div>
                          <div>
                            <Field
                              type="radio"
                              value="Female"
                              name="gender"
                              id="Female"
                            />
                            <label htmlFor="Female">Nữ</label>
                          </div>
                        </div>
                        {formik.errors.gender && (
                          <div className="error">{formik.errors.gender}</div>
                        )}
                      </div>
                    </div>
                    <div className={classes["formInputs__side"]}>
                      <div className={classes["formInputs__side__inner"]}>
                        <SelectInput
                          name="qualification"
                          id="qualification"
                          label="Trình độ chuyên môn"
                          mandatory={"true"}
                        >
                          <option value="">Lựa chọn</option>
                          <option value="Student">Chưa tốt nghiệp</option>
                          <option value="Graduate">Đã tốt nghiệp</option>
                          <option value="business">Doanh nghiệp</option>
                        </SelectInput>
                      </div>
                      <div className={classes["formInputs__side__inner"]}>
                        <SelectInput
                          name="experience"
                          id="experience"
                          label="Kinh nghiệm làm việc"
                        >
                          <option value="">Lựa chọn</option>
                          <option value="0-1"> Dưới 1 năm</option>
                          <option value="1-3">Từ 1 - 3 năm</option>
                          <option value="3-6">Từ 3 - 6 năm</option>
                          <option value="6-50">Hơn 6 năm</option>
                        </SelectInput>
                      </div>
                    </div>
                    <div className={classes.formInputs}>
                      <SelectInput name="role" id="role" label="Tạo tài khoản với vai trò">
                        <option value="User">Người tìm việc</option>
                        <option value="Job Provider">Nhà tuyển dụng</option>
                      </SelectInput>
                    </div>
                    <Button variant="success" type="submit" className="mt-4 " style={{ background: "#1679AB" }}>
                      Đăng ký
                    </Button>
                    <Link to="/Login">
                      <span
                        variant="primary"
                        type="submit"
                        className="mt-4 float-end"
                        style={{ marginLeft: "10px" }}
                      >
                        Quay lại trang đăng nhập?
                      </span>
                    </Link>
                  </Form>
                </div>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Register;
