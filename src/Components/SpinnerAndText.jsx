import React from "react";

import Spinner from "react-bootstrap/Spinner";

const SpinnerAndText = (props) => {
  return (
    <React.Fragment>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <Spinner animation="grow" variant="info" />
        <p style={{ color: "var(--info)", padding: "20px" }}>{props.text}</p>
      </div>
    </React.Fragment>
  );
};

export default SpinnerAndText;
