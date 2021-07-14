/* KEKULE COMPOSER COMPONENT
Author: Leandro Hornos
V: 0.1
Last update: Dec 2020.

A component that makes it easier to incorporate Kekule Js Composer to a react application.

 Before making a build for deployment you have to manually set the some mangle configs for webpack. 
 In the node_modules/react-scripts/config/webpack.config.js, 
 please add a line of code in after line 271:

optimization: {
  ...
  minimizer: [
    ...
    new TerserPlugin({
      ...
      mangle: {
        safari10: true,   // line 234
        reserved: ['$super', '$origin']    // add this line of code
      }
      ...
    })
    ...
  ]
  ...
}



*/

import React, { useEffect, useState } from "react";
import Kekule from "kekule";

const KekuleComposer = () => {
  const composerCont = React.createRef();

  const [composer, setComposer] = useState(null);

  const getContent = () => {
    return null;
  };

  const renderContent = () => {
    return null;
  };

  const getSelected = () => {
    return null;
  };

  const getMolecules = () => {
    return null;
  };

  useEffect(() => {
    const showComposer = () => {
      const comp = new Kekule.Editor.Composer(composerCont.current);
      comp.setCommonToolButtons([
        "newDoc",
        "loadData",
        "saveData",
        "undo",
        "redo",
        "copy",
        "cut",
        "paste",
        "zoomIn",
        "reset",
        "zoomOut",
        "config",
        "objInspector",
      ]); // create all default common tool buttons
      comp.setDimension("90%", "90vh");

      setComposer(comp);
    };

    showComposer();
  }, []);
  return (
    <div style={styles.composerContainer}>
      <div ref={composerCont} />
    </div>
  );
};

const styles = {
  composerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "white",
  },
};

export default KekuleComposer;
