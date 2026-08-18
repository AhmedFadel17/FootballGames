import '../css/index.css';
import './bootstrap';
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import './lib/echo';
import { createRoot } from 'react-dom/client';
import { StrictMode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppWrapper } from "@/components/common/PageMeta";
import App from '@/app';
import { store } from "@/store";
import { Provider } from "react-redux";
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "@/api/authConfig";
import { Toaster } from 'sonner';
import AuthSync from "@/components/auth/AuthSync";

const root = createRoot(document.getElementById('app')!);

root.render(
  <StrictMode>
    {/*
      AuthProvider wraps the entire app so every component can call
      useAuth() to access the OIDC session (user, tokens, isLoading, etc.)
    */}
    <AuthProvider {...oidcConfig}>
      <Provider store={store}>
        {/* Syncs the OIDC access_token from react-oidc-context into Redux
            so that mainApi's prepareHeaders can read auth.token. */}
        <AuthSync />
        <ThemeProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(10, 10, 10, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
              },
            }}
          />
        </ThemeProvider>
      </Provider>
    </AuthProvider>
  </StrictMode>
);
