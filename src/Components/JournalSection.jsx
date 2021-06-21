/*
Journal Section

<ReportEditor />
        |
        -- <JournalSection />

Esta sección aporta un editor de entradas de texto a forma
de bitácora. Cada entrada se identifica por la hora de creación.
Puede contener información adicional además de textos cortos.

Sirve para registrar observaciones a lo largo del tiempo, por ejemplo
los eventos de un experimento.

Props: 

section: objeto JSON
        contiene la información correspondiente a la sección.
        En section.layout está la información para dibujar el componente
        (no en este caso)
        En section.data se almacena la información ingresada por el usuario.

saveSection(sectionObject): función
        función que toma la sección actualizada y la guarda
        dentro del documento correspondiente en la base de datos.
*/

import React, { useState, useEffect } from "react";

const JournalSection = (props) => {
  const { saveSection } = props;
  const section = JSON.parse(props.section);
  let { name, description, data } = section;
  if (data === undefined) {
    data = { entries: [] };
  } else if (!("entries" in data)) {
    data = { ...data, entries: [] };
  }

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
      Reinicio el state cuando entran nuevas props.
      Evita permanencia del texto al cambiar entre solapas 
      con el mismo componente
      */
    setLoading(false);
  }, [props]);

  return (
    <React.Fragment>
      <h3 className="color-2">{name}</h3>
      <p>{description}</p>
      <div></div>
    </React.Fragment>
  );
};

export default JournalSection;
