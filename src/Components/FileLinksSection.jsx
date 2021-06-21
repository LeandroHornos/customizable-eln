import React, { useState, useEffect } from "react";

import Table from "react-bootstrap/Table"

const FileLinksSection = (props) => {
  const { saveSection } = props; // Actualiza la tabla en la base de datos
  const section = JSON.parse(props.section);
  let { name, description, data } = section;

  return (
    <React.Fragment>
      <h3 className="color-2">{name}</h3>
      <p>{description}</p>
      <Table>
          <thead>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Link</th>
          </thead>
          <tbody>
              <tr>
              <td><img src="/img/icons/xls.png" alt="" srcset="" height="60px" /></td>
              <td>Tabla de reactivos.xls</td>
              <td>http...</td>
              </tr>
              <tr>
              <td><img src="/img/icons/pdf.png" alt="" srcset="" height="60px" /></td>
              <td>Tabla de reactivos.xls</td>
              <td>http...</td>
              </tr>
              <tr>
              <td><img src="/img/icons/zip.png" alt="" srcset="" height="60px" /></td>
              <td>Tabla de reactivos.xls</td>
              <td>http...</td>
              </tr>
          </tbody>
      </Table>
    </React.Fragment>
  );
};

export default FileLinksSection;
