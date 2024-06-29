"use client";
import React, { useEffect, useRef, useState } from "react";
import classes from "@/reusables/Button/Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className,
}) => {
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (loading) {
      buttonRef.current?.setAttribute("disabled", "true");
    } else {
      buttonRef.current?.removeAttribute("disabled");
    }
  }, [loading]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={`${classes.button} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
