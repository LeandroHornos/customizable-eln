const templateSchema = {
  title: "", // El nombre de la plantilla
  sections: [], // Las secciones a mostrar, con la data para renderizarlas
  creatorId: "", // Quien creó la plantilla - Admin
  creationDate: new Date(), // Cuando fue creada
  lastModifield: new Date(), // Ultima vez que se guardaron cambios
  teams: [], // Para compartir la plantilla con un grupo
};

export default templateSchema;
