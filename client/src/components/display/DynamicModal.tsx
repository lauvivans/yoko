interface DynamicModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

const DynamicModal = ({
  children,
  className,
  ref,
  ...rest
}: DynamicModalProps) => {
  return (
    <div className={`c-dynamic-modal ${className ?? ''}`} ref={ref} {...rest}>
      {children}
    </div>
  );
};

export default DynamicModal;
