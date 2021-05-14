import React from "react";

// React Bootstrap Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// Components
import NavigationBar from "./NavigationBar";

const TemplateEditor = () => {
  const handleSubmit = () => {
    console.log("Submit");
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-2 col-lg-3"></div>
        <div className="col-md-8 col-lg-6">
          <h1 className="text-center">Template Editor</h1>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h2 className="text-center">Información general</h2>

            <Form.Group>
              <Form.Label>Nombre de la plantilla</Form.Label>
              <Form.Control></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control></Form.Control>
            </Form.Group>
            {/* -------------- SECTIONS EDITOR -------------------- */}
            <h2 className="text-center">Secciones</h2>
            <h3>Nueva Sección</h3>
            <Form.Group>
              <Form.Label>Componente</Form.Label>
              <Form.Control as="select">
                <option>Elije una opción</option>
                <option>Bloque de texto</option>
                <option>Tabla</option>
                <option>Formulario</option>
              </Form.Control>
            </Form.Group>

            <Button block type="submit">
              Guardar Plantilla
            </Button>
          </Form>
        </div>
        <div className="col-md-2 col-lg-3"></div>
      </div>
    </React.Fragment>
  );
};

const SectionEditorSwitch = (props) => {
  const { component } = props;
  return;
};

export default TemplateEditor;
