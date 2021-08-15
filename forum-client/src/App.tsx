import React from "react";
import "./App.css";
import Nav from "./components/Nav";
import LeftMenu from "./components/areas/leftMenu/LeftMenu";
import Main from "./components/Main";
import SideBar from "./components/SideBar";
import RightMenu from "./components/RightMenu";

function App() {
  return (
    <div className="App">
      <Nav />
      <SideBar />
      <LeftMenu />
      <Main />
      <RightMenu />
    </div>
  );
}

export default App;
