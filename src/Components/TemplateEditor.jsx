import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";

import sectionSchema from "../Models/sectionSchema";

const TemplateEditor = () => {
  const [name, setName] = useState(""); // Nombre de la plantilla
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(sectionSchema);
  const [sectionIsComplete, setSectionIsComplete] = useState(false);
  const clearSectionForm = () => {
    setCurrentSection(sectionSchema);
  };

  useEffect(() => {
    const { name, component } = currentSection;
    if (name !== "" && component !== "") {
      setSectionIsComplete(true);
    }
  }, [currentSection]);

  useEffect(() => {
    console.log("se ha agregado una nueva seccion", sections);
  }, [sections]);

  return (
    <div>
      <div className="row row-custom-settings">
        <div className="col-12">
          <h1>Template Editor</h1>
        </div>
      </div>
      <div className="row row-custom-settings">
        <div className="col-md-6">
          <div className="center-col-container">
            <h4>Add a new section to the template</h4>
            <div>
              <label>Section title</label>
              <input
                value={currentSection.name}
                type="text"
                placeholder="Choose a name for the section"
                onChange={(e) => {
                  setCurrentSection({
                    ...currentSection,
                    name: e.target.value,
                  });
                }}
              ></input>
            </div>
            <div>
              <label>Section Component</label>
              <select
                value={currentSection.component}
                onChange={(e) => {
                  setCurrentSection({
                    ...currentSection,
                    component: e.target.value,
                  });
                }}
              >
                <option value="">Select a section class</option>
                <option value="header-section">Header</option>
                <option value="text-section">Text block</option>
                <option value="table-section">Table</option>
                <option value="journal-section">Journal</option>
                <option value="form-section">Form</option>
              </select>
            </div>
            <Button
              className="block-btn"
              onClick={() => {
                console.log("Nueva seccion", currentSection);
                if (sectionIsComplete) {
                  setSections([...sections, currentSection]);
                }
                clearSectionForm();
              }}
            >
              Add Section
            </Button>
            <Button className="block-btn">Clear</Button>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Template Preview</h4>
          <div className="template-preview-cont">
            <h4>Hola don pepito</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
