import { forwardRef } from "react";
import "./input.css";

export const Input = forwardRef(
  ({ label, error, helperText, icon, className = "", ...props }, ref) => {
    return (
      <div className="ui-input-wrapper">
        {label && <label className="ui-input-label">{label}</label>}
        <div className="ui-input-container">
          {icon && <span className="ui-input-icon">{icon}</span>}
          <input
            ref={ref}
            className={`ui-input ${icon ? "has-icon" : ""} ${
              error ? "error" : ""
            } ${className}`}
            {...props}
          />
        </div>
        {error && <span className="ui-input-error">{error}</span>}
        {helperText && !error && (
          <span className="ui-input-helper">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
