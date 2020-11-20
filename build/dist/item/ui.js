import React from "../../web_modules/react.js";
import ReactDOM from "../../web_modules/react-dom.js";
import styled from "../../web_modules/styled-components.js";
const Ui = ({callbacks}) => {
  const [data, setData] = React.useState({});
  const [index, setIndex] = React.useState(0);
  const descRef = React.useRef();
  React.useEffect(() => {
    const data2 = callbacks.init();
    setData(data2);
    descRef.current.innerHTML = data2.description;
  }, []);
  function openWebsite() {
    const popup = window.open(data.more);
    popup.focus();
  }
  console.log(index);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Wrapper, null, /* @__PURE__ */ React.createElement(Header, null, /* @__PURE__ */ React.createElement(Title, null, data.title || ""), /* @__PURE__ */ React.createElement(Icon, {
    onClick: () => callbacks.unfocus(),
    src: "/icons/close.png"
  })), /* @__PURE__ */ React.createElement("p", {
    ref: descRef
  }), data.more ? /* @__PURE__ */ React.createElement(SeeMore, {
    onClick: openWebsite
  }, "Ver m\xE1s") : null), data.video ? /* @__PURE__ */ React.createElement(VideoPlayer, {
    controls: true,
    src: data.video,
    autoplay: true
  }) : null, data.elements ? /* @__PURE__ */ React.createElement(ElementsContainer, null, data.elements.map((element, i) => /* @__PURE__ */ React.createElement(Element, {
    key: i,
    src: element.src,
    index: i,
    selected: index
  })), /* @__PURE__ */ React.createElement(Left, {
    onClick: () => setIndex((i) => i == 0 ? data.elements.length - 1 : i - 1)
  }), /* @__PURE__ */ React.createElement(Right, {
    onClick: () => setIndex((i) => i == data.elements.length - 1 ? 0 : i + 1)
  }), /* @__PURE__ */ React.createElement(Dots, null, data.elements.map((_, i) => /* @__PURE__ */ React.createElement(Dot, {
    key: i,
    selected: index == i,
    onClick: () => setIndex(i)
  })))) : null);
};
export default function(callbacks) {
  this.element = document.createElement("DIV");
  document.getElementById("ui").insertAdjacentElement("beforeend", this.element);
  const newCallbacks = callbacks && Object.keys(callbacks).reduce((acc, key) => {
    return {
      ...acc,
      [key]: callbacks[key].bind(this.element)
    };
  }, {});
  ReactDOM.render(/* @__PURE__ */ React.createElement(Ui, {
    parent: this.element,
    callbacks: newCallbacks
  }), this.element);
  this.element.close = function() {
    ReactDOM.unmountComponentAtNode(this);
    this.remove();
  };
  return this.element;
}
const Wrapper = styled.div`
  position: absolute;

  left: 10vw;
  width: 35vw;
  top: 10vw;

  padding: 12px;

  background-color: #000000AA;
  color: white;

  & h1 {
    margin-bottom: 12px;
    margin-top: 12px;
  }

`;
const Header = styled.div`
  display: flex;
  align-items: center;
`;
const Icon = styled.img`
  width: 26px;
  height: 26px;

  padding: 6px;
`;
const SeeMore = styled.a`
  padding: 12px 16px;
  background-color: white;
  border-radius: 50px;
  color: #444;
  display: inline-block;
  text-decoration: none;

  &:hover {
    background-color: #DDD;
    cursor: pointer;
  }
`;
const VideoPlayer = styled.video`
  position: absolute;

  right: 10vw;
  width: 40vw;
  height: 23vw;
  top: calc(50vh - 11.5vw);
`;
const ElementsContainer = styled.div`
  position: absolute;
  top: calc(50vh - 15vw);
  height: 30vw;
  width: 40vw;
  right: 10vw;
  display: flex;
`;
const Element = styled.img`
  height: 100%;

  position: absolute;

  transition: transform 300ms, filter 300ms;

  ${(p) => p.index == p.selected ? `
      transform: translateX(50%);
      z-index: ${100 - Math.abs(p.index - p.selected)};
      ` : `
      z-index: ${100 - Math.abs(p.index - p.selected)};
      transform: translateX(50%) translateX(${300 * Math.tanh((p.index - p.selected) * 0.3)}px) scale(${1 / Math.cosh(p.index - p.selected)});
      filter: brightness(0.3);
    
    `}
  /*opacity: 0.8; */
`;
const Left = styled.div`
  height: 100%;
  width: 50%;
  position: absolute;
  z-index: 101;

`;
const Title = styled.h1`
  display: flex;
  flex: 1;
`;
const Right = styled.div`
  height: 100%;
  width: 50%;
  position: absolute;
  z-index: 101;
  right: 0px;
`;
const Dots = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: -50px;
`;
const Dot = styled.div`
  width: 14px;
  height: 14px;
  margin: 0px 4px;

  border-radius: 50px;
  box-sizing: border-box;
  border: solid 2px #ffffffad;

  &:after {
    content: " ";
    transition: clip-path 500ms;
    position: absolute;

    width: 14px;
    height: 14px;

    margin-left: -2px;
    margin-top: -2px;
    background-color: #ffffffad;
    border-radius: 50px;

    clip-path: circle(${(p) => p.selected ? 100 : 0}%);
  }

`;
