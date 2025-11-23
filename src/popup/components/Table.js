import React, { useState, useRef, useEffect } from "react";
import { t } from "../../shared/utils/i18n";
 
const Table = ({ data, onUpdate }) => {
  const [editingKey, setEditingKey] = useState(null);
  const editingButtonRef = useRef(null);
 
  // Focus the button when editing starts
  useEffect(() => {
    if (editingKey && editingButtonRef.current) {
      editingButtonRef.current.focus();
    }
  }, [editingKey]);
 
  const handleKeyDown = (e, actionKey) => {
    e.preventDefault();
    e.stopPropagation();
 
    // Cancel on Escape
    if (e.code === "Escape") {
      setEditingKey(null);
      return;
    }
 
    // Ignore modifier keys
    if (["Shift", "Control", "Alt", "Meta"].some(mod => e.key.startsWith(mod))) {
      return;
    }
 
    onUpdate(actionKey, e.code);
    setEditingKey(null);
  };
 
  return (
    <table className="table-fill styled-table">
      <thead>
        <tr>
          <th className="text-left">{t("key")}</th>
          <th className="text-left">{t("action")}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          const isEditing = editingKey === row.actionKey;
          return (
            <tr key={row.actionKey}>
              <td>
                <button
                  ref={isEditing ? editingButtonRef : null}
                  className={`hotkey-button ${isEditing ? "is-editing" : ""}`}
                  onClick={() => setEditingKey(row.actionKey)}
                  onKeyDown={(e) => isEditing && handleKeyDown(e, row.actionKey)}
                  onBlur={() => setEditingKey(null)}
                >
                  {isEditing ? t("press_key") : row.key}
                </button>
              </td>
              <td className="text-left">{row.action}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default Table;
