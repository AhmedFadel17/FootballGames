import '../css/app.css';
import './bootstrap';
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect, useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppWrapper } from "@/components/common/PageMeta";
import App from '@/app';
import { store, persistor } from "@/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const root = createRoot(document.getElementById('app')!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
