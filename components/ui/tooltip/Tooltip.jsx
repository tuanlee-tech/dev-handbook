import "./tooltip.css";

export const Tooltip = ({ children, content }) => {
  return (
    <div className="ui-tooltip-wrapper">
      {children}
      <div className="ui-tooltip-content">{content}</div>
    </div>
  );
};
