import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    try {
      await authApi.register({ email, password, fullName });
      toast.success('Реєстрація успішна! Тепер увійдіть.');
      navigate('/login');
    } catch (err) {
      console.warn(err);
      toast.error('Помилка реєстрації');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Реєстрація</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="fullName"
            placeholder="Повне ім'я"
            className="border p-2 rounded"
          />
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
            Створити акаунт
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Вже є акаунт?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
};