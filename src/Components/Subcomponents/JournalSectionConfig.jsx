import React, { useContext } from "react";

// React Bootstrap
import Button from "react-bootstrap/Button";

import Utils from "../../utilities";

// Context
import { LanguageContext } from "../../Lang";

const JournalSectionConfig = (props) => {
  const { dictionary } = useContext(LanguageContext);
  const txt = dictionary.subcomponents.JournalSectionConfig;

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
            entries: [],
          });
        }}
      >
        {txt.saveSection}
      </Button>
    </div>
  );
};

export default JournalSectionConfig;

