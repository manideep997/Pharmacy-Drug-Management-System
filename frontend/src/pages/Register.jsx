import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, User, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function Register() {
    const [role, setRole] = useState('customer'); // Default role
    const [formData, setFormData] = useState({
        id: '', // maps to mapped uid/sid
        name: '', // Maps to fname+lname or sname
        password: '',
        address: '',
        phone: ''
    });
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            let payload = {};
            let endpoint = '';

            if (role === 'customer') {
                const names = formData.name.split(' ');
                payload = {
                    uid: formData.id,
                    pass: formData.password,
                    fname: names[0] || '',
                    lname: names.slice(1).join(' ') || '',
                    address: formData.address,
                    phno: formData.phone
                };
                endpoint = '/api/auth/register/customer';
            } else {
                payload = {
                    sid: formData.id,
                    pass: formData.password,
                    sname: formData.name,
                    address: formData.address,
                    phno: formData.phone
                };
                endpoint = '/api/auth/register/seller';
            }

            // Unauthenticated call
            await axios.post(`http://localhost:8080${endpoint}`, payload);
            
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
            
        } catch (err) {
             setError(err.response?.data || 'An error occurred during registration');
        } finally {
             setIsLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="flex justify-center items-center min-h-[85vh] perspective-1000">
                <motion.div 
                    whileHover={{ rotateX: 6, rotateY: -6, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.8 }}
                    className="glass-panel neon-glow-hover w-full max-w-xl p-8 rounded-3xl transition-all duration-300"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="text-center mb-8" style={{ transform: 'translateZ(30px)' }}>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 mb-4 border border-purple-500/30 neon-glow">
                            <UserPlus className="w-8 h-8 text-purple-400 drop-shadow-lg" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">System Initialization</h2>
                        <p className="text-slate-300 mt-2 font-light">Join the unified pharmaceutical network</p>
                    </div>

                    {/* Role Selector Tabs */}
                    <div className="flex p-1.5 bg-black/40 backdrop-blur-sm rounded-xl mb-8 border border-white/5" style={{ transform: 'translateZ(20px)' }}>
                        <button
                            onClick={() => setRole('customer')}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${role === 'customer' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                            type="button"
                        >
                            <User className="w-4 h-4" /> Customer
                        </button>
                        <button
                            onClick={() => setRole('seller')}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${role === 'seller' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                            type="button"
                        >
                            <Building2 className="w-4 h-4" /> Provider
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-sm flex items-center gap-2 backdrop-blur-md" style={{ transform: 'translateZ(10px)' }}>
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-500/10 text-green-400 border border-green-500/30 text-sm flex items-center gap-2 animate-pulse backdrop-blur-md" style={{ transform: 'translateZ(10px)' }}>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                            Link established! Booting login sequence...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" style={{ transform: 'translateZ(40px)' }}>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">
                                    {role === 'customer' ? 'User ID (UID)' : 'Seller ID (SID)'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.id}
                                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/20 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                    placeholder={role === 'customer' ? 'e.g., neo123' : 'e.g., pharmatext'}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Encrypted Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/20 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">
                                {role === 'customer' ? 'Designation (Full Name)' : 'Entity Name (Company)'}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/20 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                placeholder={role === 'customer' ? 'John Doe' : 'Acme BioTech'}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Comlink Number</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/20 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                    placeholder="1234567890"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Sector Address</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/20 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                    placeholder="123 Main St"
                                />
                            </div>
                        </div>
                    
                        <motion.button
                            whileHover={{ scale: 1.05, translateZ: 20 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isLoading || success}
                            className={`w-full mt-6 py-4 px-4 flex items-center justify-center gap-2 font-bold rounded-xl transform transition-all disabled:opacity-70 text-white neon-glow ${role === 'customer' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'}`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Establish Link</span>
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-400" style={{ transform: 'translateZ(10px)' }}>
                        Already authorized?{' '}
                        <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors drop-shadow-md">
                            Open vault key
                        </Link>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
