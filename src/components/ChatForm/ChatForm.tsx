import { FC, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonRecordAudio from '@components/Buttons/ButtonRecordAudio/ButtonRecordAudio';
import SendMessage from '@components/Buttons/ButtonSendMessage/ButtonSendMessage';
import Emoji from '@components/ChatForm/Emoji/Emoji';
import FileAttachment from '@components/ChatForm/FileAttachment/FileAttachment';
import LoaderUIActions from '@components/LoaderUIActions/LoaderUIActions';

import useChatStore from '@zustand/store';

import useBeforeUnloadToStopTyping from '@hooks/useBeforeUnloadToStopTyping';
import useClearMessagesOnChatChange from '@hooks/useClearMessagesOnChatChange';
import useEditingMessage from '@hooks/useEditingMessage';
import useTyping from '@hooks/useTyping';

import handleSendMessage from '@utils/chatForm/handleSendMessage';
import handleUpdateEditMessage from '@utils/messages/handleUpdateEditMessage';

import '@i18n';

const RecordingAudio = lazy(
  () => import('@components/ChatForm/RecordingAudio/RecordingAudio')
);
const ChatFormSelectedMsgs = lazy(
  () => import('@components/ChatForm/ChatFormSelectedMsgs/ChatFormSelectedMsgs')
);
const EditingMsgInfo = lazy(() => import('./EditingMsgInfo/EditingMsgInfo'));

const ChatForm: FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const message = useChatStore(state => state.message);
  const setMessage = useChatStore(state => state.setMessage);
  const currentUserUID = useChatStore(state => state.currentUser.uid);
  const { chatUID, userUID } = useChatStore(state => state.currentChatInfo);
  const editingMessageInfo = useChatStore(state => state.editingMessageInfo);
  const resetEditingMessage = useChatStore(state => state.resetEditingMessage);
  const isSelectedMessages = useChatStore(state => state.isSelectedMessages);

  useBeforeUnloadToStopTyping();
  useTyping(message);
  useEditingMessage(editingMessageInfo, setMessage);
  useClearMessagesOnChatChange(chatUID, setMessage);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chatUID]);

  const handleCancelEditingMessage = () => {
    resetEditingMessage();
    setMessage('');

    inputRef.current?.focus();
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleManageSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() === '') {
      return;
    }

    if (editingMessageInfo) {
      handleUpdateEditMessage(
        editingMessageInfo,
        chatUID,
        message,
        currentUserUID,
        userUID,
        t
      );
      resetEditingMessage();
      setMessage('');
    } else {
      handleSendMessage(message, chatUID, currentUserUID, userUID);
      setMessage('');
    }
  };

  const handleToggleRecordingStatus = () => {
    setIsRecording(prev => !prev);
  };

  return (
    <div className="absolute bottom-0 left-0 z-10 flex h-24 w-full flex-col items-center">
      {!isSelectedMessages ? (
        <div className="relative flex h-full w-full flex-col justify-center shadow-whiteTopShadow xl:w-8/12">
          {editingMessageInfo && (
            <Suspense
              fallback={
                <div className="mx-auto">
                  <LoaderUIActions size={48} />
                </div>
              }
            >
              <EditingMsgInfo
                selectedMessage={editingMessageInfo.selectedMessage}
                handleCancelEditingMessage={handleCancelEditingMessage}
              />
            </Suspense>
          )}
          <form
            className="flex items-center justify-center gap-2 px-3"
            onSubmit={handleManageSendMessage}
          >
            <input
              id="chatFormInput"
              autoFocus={true}
              autoComplete="off"
              className="h-10 w-full rounded-3xl border-2 border-transparent bg-mediumLightZinc py-1 pl-10 pr-14 text-black outline-none placeholder:text-ultraDarkZinc focus:border-solid dark:bg-darkBackground dark:text-white placeholder:dark:text-mediumZinc focus:dark:border-mediumDarkCyan"
              type="text"
              placeholder={t('ChatForm.ChatInputPlaceholder')}
              ref={inputRef}
              value={message}
              onChange={handleChangeMessage}
            />
            {message ? (
              <SendMessage />
            ) : (
              <>
                {!isRecording ? (
                  <ButtonRecordAudio
                    handleToggleRecordingStatus={handleToggleRecordingStatus}
                  />
                ) : (
                  <Suspense fallback={<LoaderUIActions size={40} />}>
                    <RecordingAudio
                      isRecording={isRecording}
                      handleToggleRecordingStatus={handleToggleRecordingStatus}
                    />
                  </Suspense>
                )}
              </>
            )}
          </form>
          {!isRecording && <FileAttachment />}
          <Emoji />
        </div>
      ) : (
        <Suspense>
          <ChatFormSelectedMsgs />
        </Suspense>
      )}
    </div>
  );
};

export default ChatForm;
