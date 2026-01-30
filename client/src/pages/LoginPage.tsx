import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store'; 

export const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data } = await authApi.login({ email, password });
      
      setToken(data.access_token);
      
      await fetchUser(); 
      
      toast.success('Вітаємо! Ви увійшли.');
      navigate('/dashboard'); 
    } catch (err) {
      console.warn(err);
      toast.error('Невірний логін або пароль');
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Вхід</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            className="border p-2 rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Увійти
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Немає акаунту?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
};