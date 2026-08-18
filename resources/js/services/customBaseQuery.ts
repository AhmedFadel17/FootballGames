import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const appUrl = import.meta.env.VITE_APP_URL ?? "/";

/**
 * A UserManager instance used only to read tokens from localStorage.
 * react-oidc-context manages the actual OIDC session; this is just
 * a lightweight reader so RTK Query can attach the Bearer token.
 *
 * It shares the same storage key as the AuthProvider (oidc-client-ts
 * stores users under `oidc.user:<authority>:<client_id>`).
 */
const userManager = new UserManager({
    authority: appUrl,
    client_id: import.meta.env.VITE_PASSPORT_CLIENT_ID ?? "",
    redirect_uri: `${window.location.origin}/callback`,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
});

const baseQuery = fetchBaseQuery({
    baseUrl: appUrl,
    prepareHeaders: async (headers) => {
        // Primary: get the token from the active OIDC session (react-oidc-context)
        let token: string | null = null;

        const user = await userManager.getUser();
        if (user?.access_token) {
            token = user.access_token;
        }

        // Fallback: guest login token (non-OIDC path)
        if (!token) {
            token = localStorage.getItem("guest_access_token");
        }

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

/**
 * Custom RTK Query base query that:
 *  1. Attaches the Passport JWT access token to every request
 *  2. On 401, attempts a silent token refresh via oidc-client-ts
 *  3. Retries the original request with the new token
 *  4. If refresh fails, triggers signinRedirect to re-authenticate
 */
export const customBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        try {
            // Attempt silent token renewal (uses refresh token from storage)
            await userManager.signinSilent();

            // Retry the original request with the refreshed token
            result = await baseQuery(args, api, extraOptions);
        } catch {
            // Silent refresh failed — redirect user to login
            await userManager.signinRedirect();
        }
    }

    return result;
};
