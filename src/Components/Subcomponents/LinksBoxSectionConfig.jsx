import React, { useContext } from "react";

// React Bootstrap
import Button from "react-bootstrap/Button";

import Utils from "../../utilities";

// Context
import { LanguageContext } from "../../Lang";

const LinksBoxSectionConfig = (props) => {
  const { dictionary } = useContext(LanguageContext);
  const txt = dictionary.subcomponents.LinksBoxSectionConfig;

  return (
    <div className="section-config-box">
      <h3>{txt.title}</h3>
      <p>{txt.explanation}</p>
      <Button
        block
        variant="success"
        className="block-btn"
        onClick={() => {
          props.saveSection({
            id: Utils.makeId(16),
            info: "",
            links: [],
          });
        }}
      >
        {txt.saveSection}
      </Button>
    </div>
  );
};

export default LinksBoxSectionConfig;
