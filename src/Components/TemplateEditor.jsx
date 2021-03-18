import React from "react";

import Button from "react-bootstrap/Button";

const TemplateEditor = () => {
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
                type="text"
                placeholder="Choose a name for the section"
              ></input>
            </div>
            <div>
              <label>Section class</label>
              <select>
                <option value="">Header</option>
                <option value="">Text block</option>
                <option value="">Table</option>
                <option value="">Journal</option>
                <option value="">Form</option>
              </select>
            </div>
            <Button className="block-btn">Add Section</Button>
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
