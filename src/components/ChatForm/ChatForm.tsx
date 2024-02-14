import { FC, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FileInput from '@components/Inputs/FileInput/FileInput';
import Emoji from '@components/ChatForm/Emoji/Emoji';
const RecordingAudio = lazy(
  () => import('@components/ChatForm/RecordingAudio/RecordingAudio')
);
const ButtonClose = lazy(
  () => import('@components/Buttons/ButtonClose/ButtonClose')
);
import useChatStore from '@zustand/store';
import useBeforeUnloadToStopTyping from '@hooks/useBeforeUnloadToStopTyping';
import useTyping from '@hooks/useTyping';
import useClearMessagesOnChatChange from '@hooks/useClearMessagesOnChatChange';
import useEditingMessage from '@hooks/useEditingMessage';
import handleUpdateEditMessage from '@utils/handleUpdateEditMessage';
import handleSendMessage from '@utils/handleSendMessage';
import sprite from '@assets/sprite.svg';
import '@i18n';
import { handleDeleteMessage } from '@components/Messages/MessageList/utils/handleDeleteMessage';
import CopyToClipboard from 'react-copy-to-clipboard';
import { textFromSelectedMsgs } from '@components/Messages/MessageList/utils/textFromSelectedMsgs';
import { toast } from 'react-toastify';
// import { handleDeleteMessage } from '@components/Messages/MessageList/utils/handleDeleteMessage';

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
  const updateIsSelectedMessages = useChatStore(
    state => state.updateIsSelectedMessages
  );
  const selectedDocDataMessage = useChatStore(
    state => state.selectedDocDataMessage
  );

  useBeforeUnloadToStopTyping(); // еффект beforeunload чтобы прекратить состояние печати
  useTyping(message); // запуск таймаута при печатании + сброс при смене чата
  useEditingMessage(editingMessageInfo, setMessage);
  useClearMessagesOnChatChange(chatUID, setMessage);

  // console.log('screen --> ChatForm');

  // юзеффект держит в фокусе инпут ввода сообщений
  useEffect(() => {
    inputRef.current?.focus();
  }, [chatUID]);

  const handleCancelEditingMessage = () => {
    resetEditingMessage();
    setMessage('');

    const inputElement = document.getElementById('chatFormInput')!;
    inputElement.focus();
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleManageSendMessage = (e: React.FormEvent) => {
    // console.log('handleManageSendMessage');
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

  const handleSuccessClickCopyTextMsg = () => {
    toast.success(t('Toasts.CopyToClipboard'));
    // handleCloseModal();
    updateIsSelectedMessages(false);

    const inputElement = document.getElementById('chatFormInput')!;
    inputElement.focus();
  };

  return (
    <div className="absolute bottom-0 left-0 z-10 w-full h-24 flex flex-col items-center">
      {!isSelectedMessages ? (
        <div className="relative flex flex-col justify-center w-full h-full shadow-whiteTopShadow xl:w-8/12">
          <>
            {editingMessageInfo && (
              <div className="relative flex items-center gap-3 ml-3 mr-16 px-5 rounded-3xl bg-zinc-300 dark:bg-mySeacrhBcg">
                <svg
                  width={20}
                  height={20}
                  className="fill-zinc-600 dark:fill-white"
                >
                  <use href={sprite + '#icon-pencil'} />
                </svg>
                <div>
                  <p className="flex text-violet-500">
                    {t('ChatForm.EditMessage')}
                  </p>
                  <p className="text-black dark:text-white">
                    {editingMessageInfo.selectedMessage.data().message ||
                      t('ChatForm.EmptyMessage')}
                  </p>
                </div>
                <div className="absolute top-0 right-12">
                  <Suspense>
                    <ButtonClose
                      handleClickButtonClose={handleCancelEditingMessage}
                    />
                  </Suspense>
                </div>
              </div>
            )}
            <form
              className="flex justify-center items-center gap-2 px-3"
              onSubmit={handleManageSendMessage}
            >
              <input
                id="chatFormInput"
                autoFocus={true}
                autoComplete="off"
                className="w-full h-10 py-1 pl-10 pr-14 rounded-3xl bg-zinc-300 dark:bg-mySeacrhBcg text-black dark:text-white placeholder:text-zinc-900 placeholder:dark:text-zinc-400 border-2 border-transparent outline-none focus:border-solid focus:dark:border-cyan-500"
                type="text"
                placeholder={t('ChatForm.ChatInputPlaceholder')}
                ref={inputRef}
                value={message}
                onChange={handleChangeMessage}
              />
              {message ? (
                <button
                  className="flex justify-center items-center h-12 w-12 bg-transparent transition-all duration-300 hover:bg-zinc-100/20 hover:dark:bg-zinc-100/10 rounded-full cursor-pointer"
                  type="submit"
                >
                  <svg
                    width={24}
                    height={24}
                    className="fill-zinc-200 dark:fill-zinc-400"
                  >
                    <use href={sprite + '#icon-send-message'} />
                  </svg>
                </button>
              ) : (
                <>
                  {!isRecording ? (
                    <button
                      className="flex justify-center items-center h-12 w-12 bg-transparent transition-all duration-300 hover:bg-zinc-100/20 hover:dark:bg-zinc-100/10 rounded-full cursor-pointer"
                      type="button"
                      onClick={handleToggleRecordingStatus}
                    >
                      <svg
                        width={24}
                        height={24}
                        className="fill-zinc-200 dark:fill-zinc-400"
                      >
                        <use href={sprite + '#icon-mic'} />
                      </svg>
                    </button>
                  ) : (
                    <Suspense>
                      <RecordingAudio
                        isRecording={isRecording}
                        handleToggleRecordingStatus={
                          handleToggleRecordingStatus
                        }
                      />
                    </Suspense>
                  )}
                </>
              )}
            </form>
            <FileInput />
            <Emoji />
          </>
        </div>
      ) : (
        <Suspense>
          <div className="flex flex-col justify-center w-full h-full shadow-whiteTopShadow xl:w-8/12">
            <div
              className={`relative flex flex-row h-14 px-8 rounded-3xl bg-zinc-300 dark:bg-mySeacrhBcg text-black dark:text-white border-2 border-transparent outline-none`}
            >
              <ButtonClose
                handleClickButtonClose={() => updateIsSelectedMessages(false)}
              />

              <div className="flex flex-row gap-x-1 ml-auto">
                {selectedDocDataMessage && (
                  <CopyToClipboard
                    text={textFromSelectedMsgs(selectedDocDataMessage) || ''}
                    onCopy={handleSuccessClickCopyTextMsg}
                  >
                    <div className="flex items-center justify-center w-10 text-white hover:cursor-pointer hover:bg-hoverGray hover:rounded-md">
                      <svg width={20} height={20}>
                        <use href={sprite + '#icon-copy'} fill="#FFFFFF" />
                      </svg>
                      {/* <span>{t('ContextMenu.Copy')}</span> */}
                    </div>
                  </CopyToClipboard>
                )}

                <button
                  className="flex items-center justify-center w-10 text-white hover:cursor-pointer hover:bg-hoverGray hover:rounded-md"
                  onClick={() =>
                    handleDeleteMessage(
                      selectedDocDataMessage,
                      chatUID,
                      currentUserUID,
                      userUID,
                      t,
                      undefined,
                      updateIsSelectedMessages
                    )
                  }
                >
                  <svg width={20} height={20}>
                    <use href={sprite + '#icon-delete-button'} fill="red" />
                  </svg>
                  {/* <span>{t('ContextMenu.Delete')}</span> */}
                </button>
              </div>
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default ChatForm;
