import React from "react";

import Spinner from "react-bootstrap/Spinner";

const ButtonSpinner = (props) => {
  return (
    <React.Fragment>
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
      <span >Guardando...</span>
    </React.Fragment>
  );
};

export default ButtonSpinner;
