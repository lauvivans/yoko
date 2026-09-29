interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'default';
}

const ToggleButton = ({
  children,
  size = 'default',
  ...rest
}: ToggleButtonProps) => {
  return (
    <button className={`c-toggle-button c-toggle-button--${size}`} {...rest}>
      {children}
    </button>
  );
};

export default ToggleButton;
