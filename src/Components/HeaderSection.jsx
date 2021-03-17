import React from "react";

const HeaderSection = (props) => {
  return (
    <div>
      <h1>{props.name}</h1>
      <p> Esta es la sección de encabezado</p>
    </div>
  );
};

export default HeaderSection;
