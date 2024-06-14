import { FC, Suspense, lazy, useState } from 'react';

import ChatForm from '@components/ChatForm/ChatForm';
import ChatHeader from '@components/ChatHeader/ChatHeader';
import Messages from '@components/Messages/Messages';
import LoaderUIActions from '@components/LoaderUIActions/LoaderUIActions';
const SearchMessages = lazy(
  () => import('@components/ChatHeader/SearchMessages/SearchMessages')
);
import useResizeWindow from '@hooks/useResizeWindow';

const ChatPage: FC = () => {
  const [isShowSearchMessages, setIsShowSearchMessages] = useState(false);

  const { heightWindow } = useResizeWindow();

  return (
    <>
      <div
        className="relative w-full xl:flex xl:flex-col xl:items-center bg-transparent overflow-hidden"
        style={{
          height: heightWindow,
        }}
      >
        <ChatHeader setIsShowSearchMessages={setIsShowSearchMessages} />

        <Messages />

        <ChatForm />
      </div>
      {isShowSearchMessages && (
        <div className="absolute top-0 right-0 z-10 w-2/3 md:w-2/4 p-2 h-full border-l border-ultraDarkZinc bg-main dark:bg-mainBlack">
          <Suspense fallback={<LoaderUIActions size={50} />}>
            <SearchMessages setIsShowSearchMessages={setIsShowSearchMessages} />
          </Suspense>
        </div>
      )}
    </>
  );
};

export default ChatPage;
