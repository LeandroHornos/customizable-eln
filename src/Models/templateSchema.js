const templateSchema = {
  id: String, // Identifica el template Dejo que lo genere firebase 
  templateName: String,  // El nombre de la plantilla
  title: String, // Titulo que se muestra al principio de la plantilla
  sections: Array, // Las secciones del template
  creatorId: String, // Quien creó la plantilla - Admin
  creationDate: Date, // uando fue creada
  lastModified: Date, // Ultima vez que se guardaron cambios
};

export default templateSchema;
