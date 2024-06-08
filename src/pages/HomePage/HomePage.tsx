import { useRef, Suspense } from 'react';
import { Transition } from 'react-transition-group';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from '@components/Sidebar/Sidebar';
import LoaderUIActions from '@components/LoaderUIActions/LoaderUIActions';
import EmptyChat from '@components/EmptyChat/EmptyChat';
import BrowserTabTitle from '@components/BrowserTabTitle/BrowserTabTitle';
import useRequestPermission from '@hooks/useRequestPermission';
import useIsRedirectToCurrentChat from '@hooks/useIsRedirectToCurrentChat';
import useResizeWindow from '@hooks/useResizeWindow';
import useIsOnlineMyStatus from '@hooks/useIsOnlineMyStatus';
import useBrowserTabVisibilityChange from '@hooks/useBrowserTabVisibilityChange';
import audio from '@assets/notify.mp3';

const HomePage = () => {
  const { pathname } = useLocation();
  const nodeRefSidebar = useRef(null);
  const nodeRefChat = useRef(null);

  const { isFullScreen, heightWindow } = useResizeWindow();
  const docHidden = useBrowserTabVisibilityChange();

  useRequestPermission();
  useIsOnlineMyStatus();
  useIsRedirectToCurrentChat();

  return (
    <main
      className={`flex w-full h-full overflow-hidden bg-main-bcg2 bg-no-repeat bg-cover bg-center`}
      style={{
        height: `${heightWindow}px`,
      }}
    >
      <Transition
        nodeRef={nodeRefSidebar}
        in={
          (pathname === '/' ? 'Sidebar' : 'Chat') === 'Sidebar' || isFullScreen
        }
        timeout={300}
        unmountOnExit
      >
        {state => (
          <div
            ref={nodeRefSidebar}
            className={`w-full sm:w-[300px] md:w-[400px] ${
              state === 'exited' ? 'hidden' : ''
            } transform transition-transform ${
              state === 'entered'
                ? 'translate-x-0 scale-100'
                : '-translate-x-full scale-0'
            }`}
          >
            <Sidebar />
          </div>
        )}
      </Transition>
      <Transition
        nodeRef={nodeRefChat}
        in={(pathname === '/' ? 'Sidebar' : 'Chat') === 'Chat' || isFullScreen}
        timeout={300}
        unmountOnExit
      >
        {state => (
          <div
            ref={nodeRefChat}
            className={`w-full transform transition-transform 
                  ${state === 'exited' ? 'hidden' : ''}
                  ${
                    state === 'entered'
                      ? 'translate-x-0 scale-100'
                      : 'translate-x-full scale-0'
                  }`}
          >
            <EmptyChat isShowNotifyMsg={pathname === '/' && isFullScreen} />
            <Suspense
              fallback={
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <LoaderUIActions size={200} />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        )}
      </Transition>
      {docHidden && <BrowserTabTitle docHidden={docHidden} />}
      <audio src={audio} id="notify"></audio>
    </main>
  );
};

export default HomePage;
