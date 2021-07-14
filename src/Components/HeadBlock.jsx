import React from "react";

const HeadBlock = (props) => {
  return (
    <div className="row page-head">
      <div className="col-12" style={{ padding: "0px" }}>
        <div className="row">
          <div className="col-md-1"></div>
          <div
            className="col-md-10"
            style={{ overflowX: "hidden", padding: "0px" }}
          >
            {props.children}
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  );
};

export default HeadBlock;
