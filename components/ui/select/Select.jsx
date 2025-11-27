import { forwardRef } from "react";
import "./select.css";

export const Select = forwardRef(
  ({ label, options = [], className = "", ...props }, ref) => {
    return (
      <div className="ui-select-wrapper">
        {label && <label className="ui-select-label">{label}</label>}
        <select ref={ref} className={`ui-select ${className}`} {...props}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
