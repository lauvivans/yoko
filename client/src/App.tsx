import { BrowserRouter, Route, Routes } from 'react-router';
import AppLayout from './layouts/AppLayout';
import OccurrencePage from '@/pages/occurrence/Occurrence';
import Homepage from './pages/home/Homepage';
import navigate from '@/navigation';
import { AuthProvider } from '@/context/AuthContext';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Homepage />} />
            <Route
              path={navigate.navigateToOccurrences().pathname}
              element={<OccurrencePage />}
            />
          </Route>
          {/* <Route path={paths.auth.signin._} element={<LoginLayout />}>
            <Route index element={<Login />} />
            <Route
              path={paths.auth.signin.redirect}
              element={<LoginRedirect />}
            />
          </Route> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
