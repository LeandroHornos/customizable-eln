/*
Todas las secciones tienen un conjunto de campos en común
*/

const tableSectionSchema = {
  id: String,
  name: String,
  order: Number,
  component: String,
  data: {
    columns: [
      {
        id: String,
        name: String,
        order: Number,
        type: String,
        unit: String,
      },
    ],
  },
};

const formSectionSchema = {
  id: String,
  name: String,
  order: Number,
  component: String,
  data: {
    columns: [
      {
        id: String,
        name: String,
        order: Number,
        type: String,
        unit: String,
      },
    ],
  },
};
