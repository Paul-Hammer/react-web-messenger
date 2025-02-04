import type { FC } from 'react';
import { Suspense, lazy, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonArrow from '@components/Buttons/ButtonArrow/ButtonArrow';
import FileInput from '@components/Inputs/FileInput/FileInput';
import AvatarProfile from '@components/common/AvatarProfile/AvatarProfile';
import BlurImage from '@components/common/BlurImage/BlurImage';
import LoaderUIActions from '@components/common/LoaderUIActions/LoaderUIActions';
import SvgIcon from '@components/common/SvgIcon/SvgIcon';
import TransitionComponent from '@components/common/TransitionComponent/TransitionComponent';

import { auth } from '@myfirebase/config';

import useChatStore from '@zustand/store';

import useBlurLoadingImage from '@hooks/useBlurLoadingImage';

import handleClickChangeDisplayName from '@utils/profileSettings/handleClickChangeDisplayName';

import { ElementsId } from '@enums/elementsId';
import { IconId } from '@enums/iconsSpriteId';

import { defaultNS } from '@i18n/i18n';

const ProfileSettingsModal = lazy(
  () => import('@components/Modals/ProfileSettingsModal/ProfileSettingsModal')
);

const ProfileSettings: FC = () => {
  const [newDisplayName, setNewDisplayName] = useState(
    () => auth.currentUser?.displayName
  );
  const [isModalPhotoProfileOpen, setIsModalPhotoProfileOpen] = useState(false);

  const nodeRefProfileSettings = useRef(null);
  const photoProfileInputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation(defaultNS, { keyPrefix: 'ProfileSettings' });

  const sidebarScreen = useChatStore(state => state.sidebarScreen);
  const { uid, displayName } = useChatStore(state => state.currentUser);
  const updateCurrentUser = useChatStore(state => state.updateCurrentUser);
  const updateSidebarScreen = useChatStore(state => state.updateSidebarScreen);

  const loadingImg = useBlurLoadingImage(auth.currentUser?.photoURL ?? null);

  const handleClickTurnBackToDefaultScreen = () => {
    updateSidebarScreen('default');
  };

  const handleChangeDisplayName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisplayName(e.target.value);
  };

  const handleToggleProfilePhotoModal = () => {
    setIsModalPhotoProfileOpen(prev => !prev);

    if (isModalPhotoProfileOpen && photoProfileInputRef.current) {
      photoProfileInputRef.current.value = '';
    }
  };

  const handleChooseProfilePhoto = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length !== 0) {
      handleToggleProfilePhotoModal();
    }
  };

  const handleImageClick = () => {
    if (photoProfileInputRef.current) {
      photoProfileInputRef.current.click();
    }
  };

  return (
    <TransitionComponent
      className="absolute left-0 top-0 h-full w-full origin-left"
      nodeRef={nodeRefProfileSettings}
      exitedBehavior="hidden"
      enteredBehavior="translate-left"
      condition={sidebarScreen === 'profileSettings'}
      timeout={200}
    >
      <ButtonArrow
        handleClickButtonArrow={handleClickTurnBackToDefaultScreen}
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <FileInput
          handleChangeFileInput={handleChooseProfilePhoto}
          ref={photoProfileInputRef}
        />
        <button
          className="group relative cursor-pointer rounded-full"
          type="button"
          onClick={handleImageClick}
          aria-label="Avatar profile"
        >
          {auth.currentUser && (
            <>
              <BlurImage loading={loadingImg}>
                <AvatarProfile
                  photoURL={auth.currentUser.photoURL}
                  displayName={auth.currentUser.displayName}
                  size="200"
                />
              </BlurImage>

              <SvgIcon
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-white group-hover:scale-105"
                iconId={IconId.IconPhotoFocus}
                size={48}
              />
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-1 text-white">
          <p className="text-black dark:text-white">{t('Phone')}</p>
          <p className="h-10 cursor-default rounded-3xl px-4 py-2 text-center text-black dark:text-white">
            {auth?.currentUser?.phoneNumber}
          </p>
        </div>
        {typeof newDisplayName === 'string' && (
          <div className="flex flex-col items-center justify-center gap-2 text-white">
            <div className="flex flex-col items-center justify-center">
              <input
                id={ElementsId.ProfileName}
                className="h-10 w-full rounded-3xl border-2 border-transparent bg-darkBackground px-8 py-2 text-center text-white outline-none focus:border-solid focus:border-mediumDarkCyan sm:w-260px md:w-full"
                type="text"
                value={newDisplayName}
                onChange={handleChangeDisplayName}
              />
              <p className="text-center text-xs text-black dark:text-white">
                &#x2BB4; {t('ChangeNameNotify')}
                &#x2BB5;
              </p>
            </div>
            <button
              className={`w-48 rounded-3xl border-2 ${
                displayName === newDisplayName
                  ? 'border-darkZinc bg-transparent text-darkZinc'
                  : 'cursor-pointer border-black bg-transparent text-black hover:bg-mediumZinc dark:border-white dark:text-white hover:dark:bg-extraDarkGray'
              } transition-all duration-300 hover:shadow-mainShadow`}
              type="button"
              onClick={() =>
                uid !== null &&
                handleClickChangeDisplayName(
                  newDisplayName,
                  uid,
                  updateCurrentUser,
                  t
                )
              }
              aria-label="Change display name"
              disabled={displayName === newDisplayName}
            >
              {t('ChangeName')}
            </button>
          </div>
        )}
      </div>
      {isModalPhotoProfileOpen && (
        <Suspense
          fallback={
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoaderUIActions size={200} />
            </div>
          }
        >
          <ProfileSettingsModal
            photoProfileInputRef={photoProfileInputRef}
            handleToggleProfilePhotoModal={handleToggleProfilePhotoModal}
          />
        </Suspense>
      )}
    </TransitionComponent>
  );
};

export default ProfileSettings;
