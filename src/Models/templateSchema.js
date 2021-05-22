const templateSchema = {
  category: String,
  creationDate: Date, // uando fue creada
  creatorId: String, // Quien creó la plantilla - Admin
  id: String,
  keywords: [String], // Identifica el template Dejo que lo genere firebase
  lastModified: Date, // Ultima vez que se guardaron cambios
  privacy: String,
  sections: Array, // Las secciones del template
  status: String,
  templateName: String, // El nombre de la plantilla
  title: String, // Titulo que se muestra al principio de la plantilla
};

export default templateSchema;
