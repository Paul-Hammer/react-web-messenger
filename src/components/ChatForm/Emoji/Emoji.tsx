import {
  FC,
  KeyboardEvent,
  lazy,
  Suspense,
  useDeferredValue,
  useState,
} from 'react';

import LoaderUIActions from '@components/LoaderUIActions/LoaderUIActions';
const EmojiPickerWindow = lazy(
  () => import('../EmojiPickerWindow/EmojiPickerWindow')
);
import useChatStore from '@zustand/store';
import useCloseModal from '@hooks/useCloseModal';
import sprite from '@assets/sprite.svg';

const Emoji: FC = () => {
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [emojiTimeOutId, setEmojiTimeOutId] = useState<NodeJS.Timeout | null>(
    null
  );
  const deferredIsShowEmoji = useDeferredValue(isShowEmoji);

  useCloseModal(() => setIsShowEmoji(false));

  const editingMessageInfo = useChatStore(state => state.editingMessageInfo);

  const handleMouseEnterEmoji = () => {
    setIsShowEmoji(true);

    if (emojiTimeOutId) {
      clearTimeout(emojiTimeOutId);
      setEmojiTimeOutId(null);
    }
  };

  const handleMouseLeaveEmoji = () => {
    const timeoutId = setTimeout(() => {
      setIsShowEmoji(false);
    }, 300);
    setEmojiTimeOutId(timeoutId);
  };

  const handleEnterKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      setIsShowEmoji(true);
    }
  };

  return (
    <div
      role="button"
      className={`absolute ${
        editingMessageInfo ? 'bottom-1' : 'top-7'
      } left-3 cursor-pointer`}
      onMouseEnter={handleMouseEnterEmoji}
      onMouseLeave={handleMouseLeaveEmoji}
      onKeyDown={handleEnterKeyPress}
    >
      {deferredIsShowEmoji && (
        <Suspense
          fallback={
            <div className="absolute -top-1 -left-1">
              <LoaderUIActions size={50} />
            </div>
          }
        >
          <EmojiPickerWindow />
        </Suspense>
      )}

      <div className="flex justify-center items-center w-10 h-10 transition-all duration-300 hover:bg-mediumZinc hover:dark:bg-veryLightZincOpacity10 rounded-full">
        <svg
          width={24}
          height={24}
          className="fill-ultraDarkZinc dark:fill-mediumZinc"
        >
          <use href={sprite + '#icon-emoticon'} />
        </svg>
      </div>
    </div>
  );
};

export default Emoji;
