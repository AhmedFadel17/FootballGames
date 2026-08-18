import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

/**
 * ProtectedRoute
 *
 * Wraps routes that require the user to be authenticated.
 * If the OIDC session is not active, triggers signinRedirect()
 * which sends the user through the Passport OAuth 2.0 PKCE flow.
 */
const ProtectedRoute = () => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.signinRedirect();
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  if (auth.isLoading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    // signinRedirect() is in flight — render nothing
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
