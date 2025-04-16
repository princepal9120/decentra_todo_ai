
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50">
      <header className="py-4 px-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">
            TaskVerse
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join TaskVerse to start managing your tasks efficiently
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
            <RegisterForm />
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-6 text-center text-gray-500 text-sm">
        <p>© 2025 TaskVerse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RegisterPage;
