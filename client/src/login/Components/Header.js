import React from "react";
import { Navbar, Container } from "react-bootstrap";

function Header() {
  return (
    <div className="App">
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Container>
          <Navbar.Brand className=" text-primary font-italic " href="/login">
            <img src={"/images/logo.svg"} alt="logo" style={{ width: "160px", height: "40px" }} />
          </Navbar.Brand>
          <Navbar.Toggle
          />
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
