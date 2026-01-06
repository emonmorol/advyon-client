import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import DynamicBackground from '@/components/ui/DynamicBackground';

const AuthSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show success toast
    toast.success("Login Successful!", {
      description: "Redirecting to dashboard...",
      duration: 3000,
    });

    // Redirect after delay
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-[#1C4645]/60 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-[0_0_50px_rgba(58,117,115,0.2)] flex flex-col items-center justify-center w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-teal-400/10 p-5 rounded-full mb-8 border border-teal-400/20 shadow-inner group">
        <CheckCircle className="w-16 h-16 text-teal-400 group-hover:scale-110 transition-transform duration-500" />
      </div>

      <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
        Welcome Back
      </h2>

      <p className="text-white/60 text-center max-w-sm mb-10 text-lg leading-relaxed font-light">
        Authentication successful. Preparing your workspace...
      </p>

      <div className="flex gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-teal-400/80 animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-teal-400/80 animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-teal-400/80 animate-bounce shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
