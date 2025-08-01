import '../css/app.css';
import './bootstrap';
// import '../css/index.css';
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { createRoot } from 'react-dom/client';
import { StrictMode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppWrapper } from "@/Components/common/PageMeta";
import App from '@/app'; 

const root = createRoot(document.getElementById('app')!);

root.render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>
);
