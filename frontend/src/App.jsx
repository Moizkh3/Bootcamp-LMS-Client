import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import AuthWrapper from './components/auth/AuthWrapper';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthWrapper>
          <Toaster position="top-center" reverseOrder={false} />
          <AppRoutes />
        </AuthWrapper>
      </BrowserRouter>
    </Provider>
  );
}

export default App;