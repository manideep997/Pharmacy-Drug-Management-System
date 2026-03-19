import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Zap, Loader2, Lock } from 'lucide-react';
import api from '../api';
import PageTransition from '../components/PageTransition';

export default function PhonePeGateway() {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;
    
    const [step, setStep] = useState('processing'); // processing, otp, success, error
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (!product) {
            navigate('/customer/dashboard');
            return;
        }

        // Simulate initial loading
        const timer = setTimeout(() => {
            setStep('otp');
        }, 1500);

        return () => clearTimeout(timer);
    }, [product, navigate]);

    const handlePayment = async () => {
        if (otp !== '1234') {
            setStep('error');
            setTimeout(() => setStep('otp'), 2000);
            return;
        }

        setStep('processing');
        
        try {
            await api.post('/orders/place', {
                pid: product.pid,
                sid: "system",
                quantity: 1,
                price: product.price
            });

            setStep('success');
            
            setTimeout(() => {
                navigate('/customer/dashboard');
            }, 3000);

        } catch (error) {
            console.error(error);
            setStep('error');
        }
    };

    if (!product) return null;

    return (
        <PageTransition>
            <div className="fixed inset-0 z-[100] bg-[#5f259f] flex flex-col items-center justify-center overflow-hidden perspective-1000">
                
                {/* Background animated circles */}
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-[800px] h-[800px] rounded-full border border-white/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                />
                
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
                    animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="text-center mb-8" style={{ transform: 'translateZ(20px)' }}>
                        <div className="flex justify-center mb-6">
                            <h1 className="text-3xl font-extrabold text-[#5f259f] tracking-tight flex items-center gap-1">
                                <Zap className="w-8 h-8 fill-[#5f259f]" />
                                PhonePe
                            </h1>
                        </div>
                        <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Paying Pharmacy Vault</h2>
                        <h3 className="text-4xl font-extrabold text-gray-900">₹{product.price.toFixed(2)}</h3>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'processing' && (
                            <motion.div 
                                key="processing"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center justify-center py-8"
                            >
                                <Loader2 className="w-12 h-12 text-[#5f259f] animate-spin mb-4" />
                                <p className="text-gray-600 font-medium">Securing connection...</p>
                            </motion.div>
                        )}

                        {step === 'otp' && (
                            <motion.div 
                                key="otp"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-gray-600">Enter UPI PIN to authorize payment</p>
                                    <p className="text-xs text-gray-400 bg-gray-100 py-1 px-3 rounded-full inline-block">(Simulation: Enter 1234)</p>
                                </div>
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {otp.length >= i && <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse" />}
                                        </div>
                                    ))}
                                </div>
                                <input 
                                    type="password"
                                    maxLength={4}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="w-full text-center tracking-[1em] font-bold text-2xl border-b-2 border-gray-300 focus:border-[#5f259f] outline-none bg-transparent py-2"
                                    autoFocus
                                />
                                <button 
                                    onClick={handlePayment}
                                    disabled={otp.length !== 4}
                                    className="w-full py-4 bg-[#5f259f] text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all hover:bg-[#481c7a]"
                                >
                                    Confirm Payment
                                </button>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex flex-col items-center justify-center py-8"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                                    >
                                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                                    </motion.div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h2>
                                <p className="text-gray-500 text-center text-sm">Transferring unit to your medical vault...</p>
                            </motion.div>
                        )}

                        {step === 'error' && (
                            <motion.div 
                                key="error"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col items-center justify-center py-8"
                            >
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <ShieldAlert className="w-8 h-8 text-red-500" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Authorization Failed</h2>
                                <p className="text-gray-500 text-sm mt-1">Incorrect PIN code.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 text-center" style={{ transform: 'translateZ(10px)' }}>
                        <p className="flex items-center justify-center gap-1 text-xs text-gray-400 font-semibold">
                            <Lock className="w-3 h-3" /> 100% Secure Transaction
                        </p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
