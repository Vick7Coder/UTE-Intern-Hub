import React from "react";
import { Form, Button, Container, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Config from "../../config/Config.json";
import classes from "./Register.module.css";

toast.configure();

const ForgotPassword = () => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = Config.TITLE.FORGOT_PASSWORD;
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      toast.success(
        "Link has been sent to registered email!",
        { position: toast.POSITION.TOP_CENTER },
        { autoClose: 5000 }
      );
    }
  };

  const validate = () => {
    let isValid = true;
    let error = {};

    if (!inputs["email"]) {
      isValid = false;
      error["email"] = "Please enter your email address.";
    }

    if (typeof inputs["email"] !== "undefined") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(inputs["email"])) {
        isValid = false;
        error["email"] = "Please enter valid email address.";
      }
    }
    setErrors(error);

    return isValid;
  };
  return (
    <React.Fragment>
      <Container style={{ paddingTop: "40px" }}>
        <h1 className="p-3 text-center rounded" style={{ color: "#1679AB", fontSize: "32px" }}>
          Quên mật kẩu
        </h1>
        <div
          className="d-flex justify-content-center  align-items-center"
        >
          <Form
            className={`${classes.formContainer} ${classes.formWidth} rounded p-4 p-sm-3`}
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>
                Email <span style={{ color: "red" }}> *</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập Email của bạn"
                name="email"
                value={inputs.email}
                onChange={handleChange}
              />
              <p style={{ color: "red" }}> {errors.email} </p>
            </Form.Group>
            <Col className={classes.actions}>
              <Button
                onClick={handleSubmit}
                variant="success"
                className="mt-4 "
                style={{ background: "#1679AB" }}
              >Tạo lại mật khẩu
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
            </Col>
          </Form>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default ForgotPassword;
