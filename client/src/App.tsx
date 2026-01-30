import { useEffect } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WelcomePage } from './pages/WelcomePage'; 
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';

function App() {
  const token = useAuthStore((state) => state.token);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const isAuth = !!token;

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Якщо залогінений - на Dashboard, якщо ні - Welcome */}
        <Route 
          path="/" 
          element={isAuth ? <Navigate to="/dashboard" /> : <WelcomePage />} 
        />
        
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Захищений маршрут */}
        <Route 
          path="/dashboard" 
          element={isAuth ? <DashboardPage /> : <Navigate to="/" />} 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
    </div>
  );
}

export default App;