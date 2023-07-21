import { useState, useEffect, useRef } from "react";
import Card from "../Card/Card";

import styles from "./Dropdown.module.css";

export default function Dropdown({ className, renderTrigger, menu }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleOpen() {
    setIsOpen((v) => !v);
  }

  // only 1 open dropdown at the time
  useEffect(() => {
    function callback(e) {
      if (e.target.closest(".dropdown") !== dropdownRef.current)
        setIsOpen(false);
    }

    window.addEventListener("click", callback);

    return () => window.removeEventListener("click", callback);
  }, []);

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      {renderTrigger(handleOpen)}

      {isOpen && (
        <Card className={styles.menu}>
          {menu.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </Card>
      )}
    </div>
  );
}
