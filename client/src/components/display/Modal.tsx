import CloseIcon from './icons/Close';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  handleClose: () => void;
}

const Modal = ({ ref, children, handleClose }: ModalProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal-overlay__modal" ref={ref}>
        {children}
        <div className="modal-overlay__modal__close-btn-wrapper">
          <button onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
