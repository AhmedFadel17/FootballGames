import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

/**
 * AdminRoute
 *
 * Wraps routes that require the `admin` role.
 * The role is a custom claim on the Passport JWT, populated by
 * /api/auth/userinfo and loaded into auth.user.profile by oidc-client-ts.
 */
const AdminRoute = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Role is stored as a plain string claim ("admin" | "user" | "guest")
  const role = auth.user?.profile?.role as string | undefined;
  const isAdmin = role === "admin";

  if (!auth.isAuthenticated || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;