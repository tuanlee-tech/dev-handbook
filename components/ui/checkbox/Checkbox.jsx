import { forwardRef } from "react";
import "./checkbox.css";

export const Checkbox = forwardRef(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className="ui-checkbox-wrapper">
        <input
          ref={ref}
          type="checkbox"
          className={`ui-checkbox-input ${className}`}
          {...props}
        />
        {label && <span className="ui-checkbox-label">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
