import React from "react";

import NavigationBar from "./NavigationBar";

const Tutorial = () => {
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10" style={{ overflowX: "hidden" }}>
          <h1>Tutorial</h1>
          <p>
            Hola! este es el tutorial de LeanEln, en el cual aprenderás los
            conceptos básicos que te permitirán adaptar la aplicación a tus
            necesidades
          </p>
          <h2>¿Qué es LeanEln?</h2>
          <p>
            Las siglas ELN significan Electronic Lab Notebook, es decir,
            cuaderno de laboratorio electrónico. Bajo esta denominación se
            agrupan un conjunto de variadas aplicaciones que actuan como una
            versión digital del clásico cuaderno de laboratorio.
          </p>
          <p>
            Este tipo de aplicaciones permiten digitalizar los registros
            generados en un laboratorio, almacenando la información en una base
            de datos en lugar de usar papel.
          </p>
          <h2>¿Que tiene de especial LeanELN?</h2>
          <p>
            LeanELN es una aplicación web, lo que significa que no requiere
            instalación y puede usarse en cualquier dispositivo mediante el
            navegador.
          </p>
          <p>
            LeanELN está enfocado principalmente a laboratorios de investigación
            y desarrollo que se especialicen en Ciencias Químicas, Biológicas y
            otras disciplinas relacionadas.
          </p>
          <h2>¿Cómo se organiza la información?</h2>
          <p>
            La aplicación tiene una estructura minimalista y muy simple, donde
            la información se organiza en tres niveles de jerarquía.
          </p>
          <h3>Grupos de trabajo</h3>
          <p>
            Los grupos de trabajo reunen la información compartida por un equipo
            de colaboradores. Dentro de un grupo de trabajo la información se
            agrupa en Proyectos. Un proyecto a su vez se compone de reportes.
            Cada reporte pertenece a un único proyecto y cada proyecto pertenece
            a un único grupo de trabajo.
          </p>
          <p>
            Cuando se crea un nuevo grupo, el mismo comienza con un único
            usuario, que es la persona que creó el grupo. Este usuario tiene
            acceso completo a la información dentro del grupo, es decir, puede
            crear proyectos, reportes y plantillas.
          </p>
          <p>
            Luego, quien creó el grupo puede agregar otros usuarios al mismo.
            Sólo existen dos niveles de acceso: usuario completo e invitado. Un
            usuario completo tiene los mismos permisos que quien creó el grupo,
            mientras que una cuenta de invitado sólo permite visualizar la
            información. Sólo los usuarios incorporados al grupo podrán verlo en
            la lista de grupos.
          </p>
          <p>
            Queda a criterio del usuario cómo organizar los grupos. Una
            posiblidad es crear un único grupo para toda la compañía, crear un
            grupo para cada sector o equipo de trabajo, o incluso crear un grupo
            para cada proyecto en el que se vaya a trabajar, si se quiere
            restringir el acceso a cada proyecto en particular.
          </p>
          <h3>Proyectos</h3>
          <p>
            Cada grupo de trabajo contiene proyectos. Un proyecto puede ser de
            cualquier tipo dependiendo de la actividad que desarrolle el grupo
            de trabajo, aunque está especialemte orientado a proyectos de
            investigación y desarrollo.
          </p>
          <p>
            La información recopilada en los proyectos se recopila como una
            serie de reportes. Los reportes se utilizan para registrar un
            trabajo en concreto, por ejemplo, las observaciones y resultados de
            un experimento.
          </p>
          <h3>Reportes</h3>
          <p>
            Un reporte es un registro de un trabajo concreto, por ejemplo un
            experimento. La estructura de un reporte queda definida por una
            plantilla creada por el usuario, la cual determina cómo se registra
            la información recolectada en el reporte.
          </p>
          <p>
            Un reporte se compone de secciones, cada una diseñada
            específicamente para recopilar un tipo determinado de información.
            Las secciones se definen al crear una plantilla
          </p>
          <h2>Plantillas</h2>
          <p>
            Las plantillas determinan la estructura de un reporte. Para definir
            una plantilla, se elijen las secciones que conformarán el reporte y
            la estructura que tendrán dichas secciones. Cada sección se
            corresponde con un componente. Los tipos de componentes disponibles
            son:
            <ul>
              <li>
                <strong>Cuadro de texto: </strong> Esta sección permite ingresar
                un bloque de texto sin formato. Es ideal para registrar textos
                cortos, como puede ser el objetivo del experimento o las
                conclusiones a las que se llegó luego de realizarlo.
              </li>
              <li>
                <strong>Formulario: </strong> Esta sección provee un conjunto de
                campos donde se puede ingresar texto o números. Al crear esta
                sección se la plantilla, debes indicar las etiquetas de cada
                campo y el tipo de dato que será registrado. Para aquellos
                campos que contienen números, se puede agregar una unidad de
                medida asociada.
              </li>
              <li>
                <strong>Tabla: </strong> La sección de tabla es conceptualmente
                similar al componente de formulario. Al crear esta sección
                dentro de la plantilla podrás definir los datos que se registran
                en cada columna de la tabla.
              </li>
              <li>
                <strong>Caja de enlaces: </strong> La caja de enlaces permite
                asociar al reporte documentos almacenandos en la nube mediante
                su url. Este componente es útil para reunir en un sólo lugar
                todos los archivos relacionados al reporte. Si lo deseas, puedes
                crear un reporte sólo cómo una caja de enlaces, y registrar toda
                la información en archivos externos a la aplicación, actuando el
                reporte como un índice de los archivos que lo componen.
              </li>
            </ul>
          </p>
        </div>
        <div className="col-md-1"></div>
      </div>
    </React.Fragment>
  );
};

export default Tutorial;
