import React from "../web_modules/react.js";
import ReactDOM from "../web_modules/react-dom.js";
import styled from "../web_modules/styled-components.js";
const Center = styled.div`
  position: absolute;
  left: 10px;
  top: 10px;
`;
const Test = () => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Center, null, /* @__PURE__ */ React.createElement("p", null, "Hola!")));
};
ReactDOM.render(/* @__PURE__ */ React.createElement(Test, null), document.getElementById("ui"));
