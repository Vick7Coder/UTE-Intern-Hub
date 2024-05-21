import React from "react";
import { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import Jobitem from "./Job_item";
import ApplyModal from "./ApplyModal";
import Config from "../config/Config.json";
import Carousel from 'react-bootstrap/Carousel';
let jobsData = [];
const Jobs = () => {
  const [modal, setModal] = useState(false);
  const [action, setAction] = useState(false);
  const [jobSet, setjobSet] = useState("");
  const [jobs, setJobs] = useState([]);

  const closeModalHandler = () => {
    setModal(false);
  };

  const jobApply = (applyData) => {
    setModal(true);
    setjobSet(applyData);
  };

  const jobSearchHandler = (event) => {
    event.preventDefault();
    setJobs(
      jobsData.filter((job) =>
        job.title.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    axios
      .get(`${Config.SERVER_URL + "user/jobsAvailable"}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        jobsData = response.data.jobs;
        setJobs(response.data.jobs);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [action]);

  return (
    <div>

      <Container>
        <Row style={{ marginTop: "20px", marginLeft: "80px" }}>
          <Col sm={3}></Col>
          <Col sm={5}>
            <input
              style={{ borderRadius: "20px" }}
              className="form-control"
              type="search"
              onChange={jobSearchHandler}
              placeholder="Tìm kiếm công viêc của bạn ở đây"
            />
          </Col>
        </Row>

      </Container><br />
      <Container fluid>
        {jobs.map((jobItem, index) => (
          <Row key={index} style={{ marginBottom: '20px' }}>
            <Col></Col>
            <Col sm={10}>
              <div style={{ border: '1px solid #ccc', borderRadius: '10px' }}>
                <Jobitem style={{ display: 'inline-block' }} item={jobItem} jobApply={jobApply} />
              </div>
            </Col>
            <Col></Col>
          </Row>
        ))}
      </Container>
      {/* Top công ty nổi bật - 3 <br /> */}<br /><br />
      <Carousel data-bs-theme="dark">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://i.ytimg.com/vi/wSL0IopvwO4/maxresdefault.jpg"
            alt="First slide"
            style={{ objectFit: 'cover', height: '200px', borderRadius: '20px' }}
          />
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://i.ytimg.com/vi/wSL0IopvwO4/maxresdefault.jpg"
            alt="Second slide"
            style={{ objectFit: 'cover', height: '200px', borderRadius: '20px' }}
          />
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://i.ytimg.com/vi/wSL0IopvwO4/maxresdefault.jpg"
            alt="Third slide"
            style={{ objectFit: 'cover', height: '200px', borderRadius: '20px' }}
          />
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      {/* <span style={{ textAlign: "center" }}>Ước mơ của bạn đang nằm ngay trước mặt, hãy nhanh chóng nắm bắt cơ hội.</span> */}
      <br /><br />

      {modal && (
        <ApplyModal
          job={jobSet}
          onOpen={modal}
          onClose={closeModalHandler}
          changes={setAction}
        />
      )}
    </div>

  );
};

export default Jobs;
