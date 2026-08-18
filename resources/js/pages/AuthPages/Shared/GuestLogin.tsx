
import { FaUserSecret } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/**
 * GuestLogin
 *
 * Guest login is kept as a non-OIDC path — it calls /api/auth/guest
 * directly and stores the Passport token in localStorage so the
 * customBaseQuery can pick it up the same way as a full OIDC session.
 *
 * NOTE: This is a simplified flow for guests. They won't have a full
 * OIDC session (no silent renew), but the access token will work for
 * all user-role API endpoints until the user closes the browser or
 * the token expires (1 hour).
 */
export const GuestLogin = () => {
    const navigate = useNavigate();

    const handleGuestLogin = async () => {
        await toast.promise(
            fetch("/api/auth/guest", { method: "POST", headers: { "Content-Type": "application/json" } })
                .then(async (res) => {
                    if (!res.ok) throw new Error("Guest login failed");
                    return res.json();
                }),
            {
                loading: "Joining as guest...",
                success: "Welcome, Guest!",
                error: "Guest login failed",
            }
        ).then((data: any) => {
            // Store token in the same key format used by oidc-client-ts
            // so customBaseQuery can read it consistently.
            // Guest tokens are stored separately under a known key.
            if (data?.access_token) {
                localStorage.setItem("guest_access_token", data.access_token);
            }
            navigate("/dashboard");
        });
    };

    return (
        <button
            type="button"
            onClick={handleGuestLogin}
            className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
        >
            <FaUserSecret />
            Join as Guest
        </button>
    );
};