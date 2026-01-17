import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
}) => {
  return (
    <button
      type={type}
      className={`ui-btn ui-btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="ui-btn-spinner"></span>
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon && <span className="ui-btn-icon">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
