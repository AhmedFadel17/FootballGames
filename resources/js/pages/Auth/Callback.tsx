import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

export default function CallbackPage() {
    const auth = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        // Check if the OIDC state has finished processing or if there's an error
        if (!auth.isLoading) {
            if (auth.error) {
                console.error("Authentication callback error:", auth.error);
                // Redirect to login or home with an error state
                navigate("/", { replace: true });
            } else if (auth.isAuthenticated) {
                const role = auth.user?.profile?.role as string | undefined;
                role === "admin" ? navigate("/dashboard/admin", { replace: true }) : navigate("/dashboard", { replace: true });
            }
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.error, navigate]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Completing login...</h2>
                <p className="text-sm text-gray-500">Please wait while we redirect you.</p>
            </div>
        </div>
    );
}