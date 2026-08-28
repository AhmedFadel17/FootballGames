import { WebStorageStateStore } from "oidc-client-ts";
import type { AuthProviderProps } from "react-oidc-context";

const rawAppUrl = import.meta.env.VITE_APP_URL ?? "http://localhost:8000";
const appUrl = rawAppUrl.replace(/\/+$/, "");

export const oidcConfig: AuthProviderProps = {
    authority: appUrl,
    client_id: import.meta.env.VITE_PASSPORT_CLIENT_ID ?? "",
    redirect_uri: `${window.location.origin}/auth/callback`,
    post_logout_redirect_uri: window.location.origin,
    response_type: "code",
    scope: "openid profile email",

    userStore: new WebStorageStateStore({ store: window.localStorage }),

    // Enable auto-renewal using stored refresh token
    automaticSilentRenew: true,
    accessTokenExpiringNotificationTimeInSeconds: 60,

    loadUserInfo: true,

    metadata: {
        issuer: appUrl,
        authorization_endpoint: `${appUrl}/oauth/authorize`,
        token_endpoint: `${appUrl}/oauth/token`,
        userinfo_endpoint: `${appUrl}/api/auth/userinfo`,
        end_session_endpoint: `${appUrl}/oauth/logout`,
        revocation_endpoint: `${appUrl}/oauth/tokens/revoke`,
        jwks_uri: `${appUrl}/oauth/jwks`,
    },
};