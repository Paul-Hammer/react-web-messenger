import useCloseModal from '@hooks/useCloseModal';
import { IModalMessageContextMenuProps } from '@interfaces/IModalMessageContextMenuProps';



const MessageContextMenuModal = ({
  closeModal,
  modalPosition,
  children,
}: IModalMessageContextMenuProps) => {
  useCloseModal(closeModal);

  return (
    <div
      style={{
        position: 'absolute',
        top: modalPosition.top + 'px',
        left: modalPosition.left + 'px',
      }}
      className="z-20 w-screen h-screen bg-transparent pointer-events-none"
    >
      {children}
    </div>
  );
};

export default MessageContextMenuModal;