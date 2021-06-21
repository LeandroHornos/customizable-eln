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

import React from "react";

const JournalSection = (props) => {
  return <React.Fragment></React.Fragment>;
};

export default JournalSection;
