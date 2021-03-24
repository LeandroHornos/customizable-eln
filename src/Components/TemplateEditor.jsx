import React, { useState, useEffect, useContext } from "react";

// React Bootstrap
import Button from "react-bootstrap/Button";

// Firebase
import firebaseApp from "../firebaseApp";

// Context
import { LanguageContext } from "../Lang";
import { AuthContext } from "../Auth";

// Router
import { useHistory } from "react-router-dom";

// Data structure
import sectionSchema from "../Models/sectionSchema";
import templateSchema from "../Models/templateSchema";

// Components & Subcomponents
import NavigationBar from "./NavigationBar";
import ChemSectionConfig from "./Subcomponents/ChemSectionConfig";
import FormSectionConfig from "./Subcomponents/FormSectionConfig";
import HeaderSectionConfig from "./Subcomponents/HeaderSectionConfig";
import JournalSectionConfig from "./Subcomponents/JournalSectionConfig";
import LinksBoxSectionConfig from "./Subcomponents/LinksBoxSectionConfig";
import TableSectionConfig from "./Subcomponents/TableSectionConfig";
import TextSectionConfig from "./Subcomponents/TextSectionConfig";

import Utils from "../utilities";

const TemplateEditor = () => {
  const db = firebaseApp.firestore();
  const history = useHistory();

  const { dictionary } = useContext(LanguageContext);
  const { currentUser } = useContext(AuthContext);
  const txt = dictionary.components.templateEditor;
  const gtxt = dictionary.general;

  const [templateName, setTemplateName] = useState(""); // Nombre de la plantilla
  const [title, setTitle] = useState(""); // Nombre de la plantilla
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState({
    ...sectionSchema,
    id: Utils.makeId(16),
  }); // para comenzar crea un único objeto seccion vacío en secciones, y le asigna un id

  const clearSectionForm = () => {
    setCurrentSection({
      ...sectionSchema,
      id: Utils.makeId(16),
    });
  };

  const saveNewTemplate = async () => {
    let template = {
      ...templateSchema,
      title,
      sections,
      creatorId: currentUser.uid,
    };

    console.log("vamos a grabar esta template:", template);
    try {
      await db.collection("templates").add(template);
      console.log("Nueva template creada con exito");
      console.log("Esta es la nueva plantilla:", template);
      history.push("/");
    } catch (error) {
      console.log("Ha ocurrido un error al guardar la plantilla", error);
    }
  };

  const addCurrentSectionToTemplate = (sectionData) => {
    /* Recibe el objeto de un componente de configuración
    y guarda la sección con dicho objeto en data. */

    const newSection = { ...currentSection, data: sectionData };

    // Compruebo si ya existe una seccion con el id de la actual:
    const sectionExists = sections.some(
      (section) => section.id === currentSection.id
    );

    // Si la seccion ya existe reemplazo el objeto
    if (sectionExists) {
      console.log("la seccion ya existe, actualizando");
      let updatedSections = sections.map((section) => {
        if (section.id === currentSection.id) {
          section = newSection;
        }
        return section;
      });
      setSections(updatedSections);
      console.log("se han actualizado las secciones:", updatedSections);
      console.log("hay este numero de secciones:", updatedSections.length);
    } else {
      // Si no existe el objeto agrego uno nuevo:
      console.log(
        "estas son las secciones antes de agregar una nueva:",
        sections
      );
      let updatedSections = sections;
      updatedSections.push(newSection);
      setSections(updatedSections);
      console.log("Se han actualizado las secciones", updatedSections);
      console.log("hay este numero de secciones:", updatedSections.length);
    }

    clearSectionForm();
  };

  return (
    <div>
      <NavigationBar />
      <div className="row row-custom-settings">
        <div className="col-12">
          <h1>{txt.title}</h1>
        </div>
      </div>
      <div className="row row-custom-settings">
        <div className="col-md-7">
          <div className="center-col-container ">
            <div className="template-box">
              <h2>{txt.templateName}</h2>
              <input
                value={templateName}
                type="text"
                placeholder={txt.tempNamePlaceholder}
                onChange={(e) => {
                  setTemplateName(e.target.value);
                }}
              ></input>
              <h2>{txt.templateTitle}</h2>
              <input
                value={title}
                type="text"
                placeholder={txt.tempTitlePlaceholder}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              ></input>
            </div>

            <div className="template-box">
              <h2>{txt.addNewSection}</h2>
              <div>
                <label>{txt.sectionTitle}</label>
                <input
                  value={currentSection.name}
                  type="text"
                  placeholder={txt.secTitlePlaceholder}
                  onChange={(e) => {
                    setCurrentSection({
                      ...currentSection,
                      name: e.target.value,
                    });
                  }}
                ></input>
              </div>
              <label>{txt.sectionClass}</label>
              <select
                value={currentSection.component}
                onChange={(e) => {
                  setCurrentSection({
                    ...currentSection,
                    component: e.target.value,
                  });
                }}
              >
                <option value="">{txt.secClassPlaceholder}</option>
                <option value="header-section">{txt.compNames.header}</option>
                <option value="chem-section">{txt.compNames.chem}</option>
                <option value="text-section">{txt.compNames.textBlock}</option>
                <option value="table-section">{txt.compNames.table}</option>
                <option value="journal-section">{txt.compNames.journal}</option>
                <option value="linksbox-section">
                  {txt.compNames.linksBox}
                </option>
                <option value="form-section">{txt.compNames.form}</option>
              </select>
              {currentSection.component === "table-section" && (
                <TableSectionConfig saveSection={addCurrentSectionToTemplate} />
              )}
              {currentSection.component === "form-section" && (
                <FormSectionConfig saveSection={addCurrentSectionToTemplate} />
              )}
              {currentSection.component === "text-section" && (
                <TextSectionConfig saveSection={addCurrentSectionToTemplate} />
              )}
              {currentSection.component === "chem-section" && (
                <ChemSectionConfig saveSection={addCurrentSectionToTemplate} />
              )}
              {currentSection.component === "header-section" && (
                <HeaderSectionConfig
                  saveSection={addCurrentSectionToTemplate}
                />
              )}
              {currentSection.component === "journal-section" && (
                <JournalSectionConfig
                  saveSection={addCurrentSectionToTemplate}
                />
              )}
              {currentSection.component === "linksbox-section" && (
                <LinksBoxSectionConfig
                  saveSection={addCurrentSectionToTemplate}
                />
              )}
              <div>
                <Button block variant="outline-dark" className="block-btn">
                  {gtxt.clear}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div
            className="template-box"
            style={{ backgroundColor: "rgb(50,50,50)" }}
          >
            <h2 className="text-center temp-preview-header">
              {txt.templatePreviewHeader}
            </h2>
            {(sections.length > 0 || title != "") && (
              <div
                className="section-config-box"
                style={{ backgroundColor: "white" }}
              >
                <h5 className="text-center">{title}</h5>
                {sections.map((section) => {
                  return (
                    <div>
                      <h5>{section.name}</h5>
                      <p>{section.component}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <Button
            block
            variant="success"
            className="block-btn"
            onClick={saveNewTemplate}
          >
            {txt.templateSaveButton}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
