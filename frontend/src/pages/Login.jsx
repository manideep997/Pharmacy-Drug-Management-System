import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Unauthenticated endpoint
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            const { jwt, type } = response.data;
            
            localStorage.setItem('token', jwt);
            localStorage.setItem('role', type);
            localStorage.setItem('username', formData.username);

            if (type === 'seller') {
                navigate('/seller/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (err) {
            setError(err.response?.data || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="flex justify-center items-center min-h-[80vh] perspective-1000">
                <motion.div 
                    whileHover={{ rotateX: 6, rotateY: -6, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.8 }}
                    className="glass-panel neon-glow-hover w-full max-w-md p-8 rounded-3xl transition-all duration-300"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="text-center mb-10" style={{ transform: 'translateZ(30px)' }}>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 mb-4 border border-indigo-500/30 neon-glow">
                            <ShieldCheck className="w-8 h-8 text-indigo-400 drop-shadow-lg" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">Welcome Back</h2>
                        <p className="text-slate-300 mt-2 font-light">Sign in to manage your medical vault</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-sm flex items-center gap-2 backdrop-blur-md" style={{ transform: 'translateZ(20px)' }}>
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" style={{ transform: 'translateZ(40px)' }}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Username / ID</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/20 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                    placeholder="Enter your ID"
                                />
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 opacity-70" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Password</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/20 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05, translateZ: 20 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-4 flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl neon-glow transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <LogIn className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-400" style={{ transform: 'translateZ(10px)' }}>
                        Don't have a vault yet?{' '}
                        <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors drop-shadow-md">
                            Initialize account
                        </Link>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
