import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';

/**
 * AuthSync handles the synchronization between react-oidc-context and Redux.
 * It listens for changes in the OIDC user state and updates the Redux store
 * so that API slices and other Redux-aware components have access to the 
 * current user and access token.
 */
const AuthSync = () => {
  const auth = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only update if not loading, to avoid clearing state during initial check
    if (!auth.isLoading) {
      dispatch(setUser(auth.user ?? null));
    }
  }, [auth.user, auth.isLoading, dispatch]);

  return null;
};

export default AuthSync;
