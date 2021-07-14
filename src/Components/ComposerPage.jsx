import React from "react";

import KekuleComposer from "./KekuleComposer";
import NavigationBar from "./NavigationBar";
import AppFooter from "./AppFooter";
import HeadBlock from "./HeadBlock";

const ComposerPage = () => {
  return (
    <React.Fragment>
      <NavigationBar />
      <HeadBlock>
        <h1>Editor de moléculas</h1>
        <p>
          <small>powered by Kekule.js</small>
        </p>
      </HeadBlock>
      <KekuleComposer />
      <AppFooter />
    </React.Fragment>
  );
};

export default ComposerPage;
