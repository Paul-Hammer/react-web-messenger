import React, { FC } from 'react';

import sprite from '@assets/sprite.svg';
import { handleDeleteMessage } from '@utils/messages/handleDeleteMessage';
import useChatStore from '@zustand/store';
import { useTranslation } from 'react-i18next';

interface IDeleteButtonProps {
  textContent?: boolean;
  color: string;
}

const DeleteButton: FC<IDeleteButtonProps> = ({
  textContent = true,
  color,
}) => {
  const { t } = useTranslation();

  const currentUserUID = useChatStore(state => state.currentUser.uid);
  const { chatUID, userUID } = useChatStore(state => state.currentChatInfo);

  const selectedDocDataMessage = useChatStore(
    state => state.selectedDocDataMessage
  );
  const resetSelectedMessages = useChatStore(
    state => state.resetSelectedMessages
  );

  return (
    <button
      className="flex items-center justify-between w-full px-8 py-2 text-white hover:cursor-pointer hover:bg-hoverGray hover:rounded-md"
      onClick={() =>
        handleDeleteMessage(
          selectedDocDataMessage,
          chatUID,
          currentUserUID,
          userUID,
          t,
          resetSelectedMessages
        )
      }
    >
      <svg width={20} height={20}>
        <use href={sprite + '#icon-delete-button'} fill={color} />
      </svg>
      {textContent && (
        <span className="text-base">{t('ContextMenu.Delete')}</span>
      )}
    </button>
  );
};

export default DeleteButton;
