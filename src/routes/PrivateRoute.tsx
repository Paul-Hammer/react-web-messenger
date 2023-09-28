import { Navigate } from 'react-router-dom';

import useChatStore from '@zustand/store';
import { IPrivateRouteProps } from '@interfaces/routes/IPrivateRouteProps';

function PrivateRoute({
  component: Component,
  redirectTo = '/authentication',
}: IPrivateRouteProps) {
  const { currentUser, isLoggedIn } = useChatStore(state => state);

  console.log(currentUser);
  console.log(isLoggedIn);

  return isLoggedIn && currentUser.displayName ? (
    <Component />
  ) : (
    <Navigate to={redirectTo} />
  );
}

export default PrivateRoute;
