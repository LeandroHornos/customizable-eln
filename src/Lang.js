import React, { useState, createContext, useContext } from "react";

import { languageOptions, dictionaryList } from "./Languages";

// create the language context with default selected language
export const LanguageContext = createContext({
  userLanguage: "es",
  dictionary: dictionaryList.es,
});

export const LanguageProvider = ({ children }) => {
  const defaultLanguage = window.localStorage.getItem("rcml-lang");
  const [userLanguage, setUserLanguage] = useState(defaultLanguage || "es");

  const provider = {
    userLanguage,
    dictionary: dictionaryList[userLanguage],
    userLanguageChange: (selected) => {
      const newLanguage = languageOptions[selected] ? selected : "es";
      setUserLanguage(newLanguage);
      window.localStorage.setItem("rcml-lang", newLanguage);
      console.log("cambio el lenguaje a", newLanguage);
    },
  };

  // get text according to id & current language
  return (
    <LanguageContext.Provider value={provider}>
      {children}
    </LanguageContext.Provider>
  );
};

export function Text({ tid }) {
  const languageContext = useContext(LanguageContext);

  return languageContext.dictionary[tid] || tid;
}
