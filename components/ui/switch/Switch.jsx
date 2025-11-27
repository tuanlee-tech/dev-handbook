import { forwardRef } from "react";
import "./switch.css";

export const Switch = forwardRef(({ label, className = "", ...props }, ref) => {
  return (
    <label className="ui-switch-wrapper">
      <input
        ref={ref}
        type="checkbox"
        className={`ui-switch-input ${className}`}
        {...props}
      />
      {label && <span className="ui-switch-label">{label}</span>}
    </label>
  );
});

Switch.displayName = "Switch";
