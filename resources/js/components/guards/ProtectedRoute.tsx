import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

/**
 * ProtectedRoute
 *
 * Wraps routes that require the user to be authenticated.
 * Prevents redirect loops when silent renew fails or tokens expire.
 */
const ProtectedRoute = () => {
  const auth = useAuth();
  const isRedirecting = useRef(false);

  useEffect(() => {
    // 1. Listen for silent renew failures (e.g., revoked/invalid refresh tokens)
    const unbindSilentRenewError = auth.events.addSilentRenewError((error) => {
      console.warn("Silent renew failed:", error);
      auth.removeUser(); // Clear dead session state from localStorage
    });

    // 2. Safely trigger signinRedirect ONLY ONCE if not loading and not authenticated
    if (!auth.isLoading && !auth.isAuthenticated && !auth.error && !isRedirecting.current) {
      isRedirecting.current = true;
      auth.signinRedirect();
    }

    return () => {
      unbindSilentRenewError();
    };
  }, [auth.isLoading, auth.isAuthenticated, auth.error, auth]);

  // Loading state (during initial check or silent renew)
  if (auth.isLoading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Handle authentication errors (e.g., invalid_grant) cleanly
  if (auth.error) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">{auth.error?.message} : Session expired or authorization failed.</p>
        <button
          onClick={() => {
            auth.removeUser();
            auth.signinRedirect();
          }}
          className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-opacity-90 transition"
        >
          Log In Again
        </button>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;