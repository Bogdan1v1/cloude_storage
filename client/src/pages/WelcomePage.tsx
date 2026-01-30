import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

export const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 flex flex-col items-center justify-center text-white p-4">
      
      {/* Логотип */}
      <div className="flex items-center gap-3 mb-8 animate-bounce">
        <Cloud size={64} className="text-blue-300" />
      </div>

      <h1 className="text-5xl font-bold mb-4 text-center">Cloud Storage</h1>
      <p className="text-xl text-blue-100 mb-12 text-center max-w-md">
        Зберігайте свої файли безпечно, діліться ними та отримуйте доступ з будь-якого пристрою.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-sm">
        <Link 
          to="/login"
          className="flex-1 bg-white text-blue-900 py-3 px-6 rounded-xl font-bold text-center hover:bg-gray-100 transition shadow-lg"
        >
          Увійти
        </Link>
        
        <Link 
          to="/register"
          className="flex-1 bg-blue-500/20 border-2 border-white/30 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-bold text-center hover:bg-white/10 transition"
        >
          Реєстрація
        </Link>
      </div>

      <footer className="absolute bottom-4 text-blue-300/50 text-sm">
        © 2026 My Cloud Storage
      </footer>
    </div>
  );
};