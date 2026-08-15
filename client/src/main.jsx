import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store.js';
import { NotificationProvider } from './context/NotificationContext.jsx';

import { applyThemeColor } from './utils/theme.js';

const queryClient = new QueryClient();

// Apply theme synchronously before React renders to prevent flash of default color
const savedColor = localStorage.getItem('primaryColor') || 'darkblue';
applyThemeColor(savedColor);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
