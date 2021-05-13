/*
Todas las secciones tienen un conjunto de campos en común
id: string que identifica al componente
name: nombre a utilizar como título de la sección
order: número que indica la posición de la sección dentro del template
component: string que indica de que tipo de componente se trata
description: String que explica de qué se trata la sección y que información ingresar
layout: contiene la información específica para generar cada componente
*/

const tableSectionSchema = {
  id: String,
  name: String,
  order: Number,
  description: String,
  component: String,
  layout: {
    columns: [
      {
        id: String, // identifica la columna dentro de la tabla
        header: String, // Nombre para mostrar como encabezado de la columna -- renombrar a header
        order: Number, // Posición de la columna dentro de la tabla
        type: String, // Tipo de dato que se almacena en la columna
        unit: String, // Si el dato es un número, unidad de medida asociada al mismo
      },
    ],
  },
};

const formSectionSchema = {
  id: String,
  name: String,
  order: Number,
  description: String,
  component: String,
  layout: {
    fields: [
      {
        id: String, // identifica la columna dentro de la tabla
        label: String, // Nombre para identificar el campo
        order: Number, // Número que identifica la posición del campo en el formulario
        type: String, // El tipo de dato que almacena el campo
        unit: String, // Si el dato es un número, la unidad asociada al dato
      },
    ],
  },
};

const textSectionSchema = {
  id: String,
  name: String,
  order: Number,
  component: String,
  layout: {
    maxChars: Number, // Indica el número máximo de caracteres que puede contener el campo
    rows: Number, // El número de filas que tiene el textarea
  },
};
