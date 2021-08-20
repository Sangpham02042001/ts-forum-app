import React, { FC } from "react";
import Category from "../../../models/Category";

interface MainHeaderProp {
  category?: Category;
}

const MainHeader: FC<MainHeaderProp> = ({ category }) => {
  return (
    <div className="main-header">
      <div
        className="title-bar"
        style={{ marginBottom: ".25em", paddingBottom: 0 }}
      >
        <strong>{category?.name || "Placeholder"}</strong>
      </div>
    </div>
  );
};

export default MainHeader;
