import React from "react";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const NavigationBar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" className="navigation-bar">
      <Navbar.Brand href="/">
        LEAN<span style={{ color: "red" }}>ELN</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Inicio</Nav.Link>
          <Nav.Link href="/guia">Guia</Nav.Link>
          <Nav.Link href="/composer">Editor</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link href="/exit">Sign Out</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
