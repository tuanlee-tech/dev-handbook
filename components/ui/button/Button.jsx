import "./button.css";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  ...props
}) => {
  const buttonClass = `ui-button ui-button-${variant} ui-button-${size} ${
    loading ? "ui-button-loading" : ""
  } ${className}`;

  return (
    <button
      className={buttonClass}
      disabled={loading || props.disabled}
      {...props}
    >
      {icon && !loading && icon}
      {children}
    </button>
  );
};
