import '../css/app.css';
import './bootstrap';
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { createRoot } from 'react-dom/client';
import { StrictMode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppWrapper } from "@/components/common/PageMeta";
import App from '@/app';
import { store } from "@/store";
import { Provider } from "react-redux";

const root = createRoot(document.getElementById('app')!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
