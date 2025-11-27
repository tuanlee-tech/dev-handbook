import "./card.css";

export const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`ui-card ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Header = ({ children, className = "" }) => (
  <div className={`ui-card-header ${className}`}>{children}</div>
);

Card.Title = ({ children, className = "" }) => (
  <h3 className={`ui-card-title ${className}`}>{children}</h3>
);

Card.Subtitle = ({ children, className = "" }) => (
  <p className={`ui-card-subtitle ${className}`}>{children}</p>
);

Card.Content = ({ children, className = "" }) => (
  <div className={`ui-card-content ${className}`}>{children}</div>
);

Card.Footer = ({ children, className = "" }) => (
  <div className={`ui-card-footer ${className}`}>{children}</div>
);
