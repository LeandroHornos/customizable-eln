import React, { useContext } from "react";

import { languageOptions } from "../Languages";
import { LanguageContext } from "../Lang";

const LangSelector = () => {
  const { userLanguage, userLanguageChange } = useContext(LanguageContext);

  // set selected language by calling context method
  const handleLanguageChange = (e) => userLanguageChange(e.target.value);

  return (
    <select onChange={handleLanguageChange} value={userLanguage}>
      {Object.entries(languageOptions).map(([id, name]) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default LangSelector;
