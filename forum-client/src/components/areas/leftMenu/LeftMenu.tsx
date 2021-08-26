import React, { useEffect, useState } from "react";
import { useWindowDimension } from "../../../hooks/useWindowDimensions";
import "./LeftMenu.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/AppState";
import Category from "../../../models/Category";

const LeftMenu = () => {
  const categoriesState = useSelector((state: AppState) => state.categories);
  const { width } = useWindowDimension();
  const [categories, setCategories] = useState<JSX.Element>(
    <div>Left Menu</div>
  );

  useEffect(() => {
    if (categoriesState) {
      console.log(categoriesState);
      const cats = categoriesState.map((cat: Category) => {
        return (
          <li key={cat.id}>
            <Link to={`/categorythreads/${cat.id}`}>{cat.name}</Link>
          </li>
        );
      });
      setCategories(<ul className="category">{cats}</ul>);
    }
  }, [categoriesState]);

  if (width <= 768) {
    return null;
  }
  return <div className="leftmenu">{categories}</div>;
};

export default LeftMenu;
