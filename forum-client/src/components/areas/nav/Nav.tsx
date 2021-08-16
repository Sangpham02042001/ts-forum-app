import React, { useState } from "react";
import { useWindowDimension } from "../../../hooks/useWindowDimensions";
import ReactModal from "react-modal";
import SideBarMenu from "../sidebar/SideBarMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Nav.css";

export default function Nav() {
  const { width } = useWindowDimension();
  const [showMenu, setShowMenu] = useState(false);
  const getMobileMenu = () => {
    if (width <= 768) {
      return (
        <FontAwesomeIcon
          icon={faBars}
          onClick={onClickToggle}
          size="lg"
          className="nav-mobile-menu"
        />
      );
    }
    return null;
  };

  const onClickToggle = (e: React.MouseEvent<Element, MouseEvent>) => {
    setShowMenu(!showMenu);
  };

  const onRequestClose = (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => {
    setShowMenu(false);
  };

  return (
    <>
      <ReactModal
        className="modal-menu"
        isOpen={showMenu}
        onRequestClose={onRequestClose}
        shouldCloseOnOverlayClick={true}
      >
        <SideBarMenu />
      </ReactModal>
      <nav>
        {getMobileMenu()}
        <strong>SuperForum</strong>
      </nav>
    </>
  );
}
