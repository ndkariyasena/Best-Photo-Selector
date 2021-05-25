import React from 'react';

import PropTypes from 'prop-types';

import { Navbar, Nav } from 'react-bootstrap';

const Basic = (props) => {

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home">PhotoBook</Navbar.Brand>
        <Nav activeKey={window.location.pathname} className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/top-photos">Selection</Nav.Link>
        </Nav>
      </Navbar>
      
      {props.children}
    </>
  )

}

Basic.propTypes = {
  component: PropTypes.elementType,
  location: PropTypes.object,
};

export default Basic;

