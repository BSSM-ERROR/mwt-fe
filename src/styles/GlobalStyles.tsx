"use client";

import { Global, css } from "@emotion/react";

const style = css`
  html,
  body {
    padding: 0;
    margin: 0;
    background-color: #f5f5f5;
  }

  * {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const GlobalStyles = () => {
    return <Global styles={style} />;
};

export default GlobalStyles;
