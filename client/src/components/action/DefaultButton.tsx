interface DefaultButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  styleType?: 'error' | 'subtle' | 'default';
  children: string;
}

const DefaultButton = ({
  styleType = 'default',
  children,
  onClick,
  ...props
}: DefaultButtonProps) => {
  return (
    <button
      className={`c-default-button c-default-button--${styleType}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default DefaultButton;
