import { useState } from "react";
import Card from "../Card/Card";
import "./Dropdown.scss";

export default function Dropdown({ className, renderTrigger, menu }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen((v) => !v);
  }

  return (
    <div className={`dropdown ${className}`}>
      {renderTrigger(handleOpen)}

      {isOpen && (
        <Card className="dropdown__menu">
          {menu.map((item, index) => (
            <li key={index} className="dropdown__item">
              {item}
            </li>
          ))}
        </Card>
      )}
    </div>
  );
}
