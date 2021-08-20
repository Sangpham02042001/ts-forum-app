import React from "react";
import { useWindowDimension } from "../../../hooks/useWindowDimensions";

export default function RightMenu() {
  const { width } = useWindowDimension();
  if (width <= 768) {
    return null;
  }
  return <div className="rightmenu">Right Menu</div>;
}
