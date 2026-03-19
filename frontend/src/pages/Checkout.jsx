import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight, Package, CreditCard, Lock } from 'lucide-react';
import api from '../api';
import PageTransition from '../components/PageTransition';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout() {
    const { pid } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get('/products');
                const matchedProduct = res.data.find(p => p.pid === pid);
                if (matchedProduct) {
                    setProduct(matchedProduct);
                } else {
                    navigate('/customer/dashboard'); // redirect if not found
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [pid, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto py-12 px-4 perspective-1000">
                <motion.div 
                    initial={{ opacity: 0, y: 50, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="glass-panel rounded-3xl p-8 relative overflow-hidden"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl rounded-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6" style={{ transform: 'translateZ(20px)' }}>
                        <ShieldCheck className="w-8 h-8 text-indigo-400" />
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Secure Acquisition</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10" style={{ transform: 'translateZ(30px)' }}>
                        {/* Product Summary */}
                        <motion.div 
                            whileHover={{ scale: 1.02, rotateY: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="bg-black/30 rounded-2xl p-6 border border-white/5 backdrop-blur-md shadow-2xl"
                        >
                            <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-indigo-400" /> Unit Details
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-2xl font-bold text-white leading-tight">{product.pname}</p>
                                        <span className="inline-block px-2 py-1 bg-white/5 text-slate-300 rounded text-xs mt-1 border border-white/10">
                                            {product.pid}
                                        </span>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                        <Package className="w-6 h-6 text-indigo-400" />
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-slate-400 mb-2">
                                        <span>Manufacturer</span>
                                        <span className="text-slate-200">{product.manufacturer}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Quantity</span>
                                        <span className="text-slate-200 font-bold">1 Unit</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Details */}
                        <div className="flex flex-col justify-between">
                            <motion.div 
                                whileHover={{ scale: 1.02, rotateY: -5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="bg-black/30 rounded-2xl p-6 border border-white/5 backdrop-blur-md shadow-2xl space-y-4"
                            >
                                <h2 className="text-xl font-bold text-slate-200 mb-2 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-emerald-400" /> Payment Summary
                                </h2>
                                
                                <div className="flex justify-between text-slate-400 text-sm">
                                    <span>Unit Price</span>
                                    <span>₹{product.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 text-sm">
                                    <span>Network Fee</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-2">
                                    <span className="text-lg font-bold text-slate-300">Total Authorization</span>
                                    <span className="text-3xl font-extrabold text-emerald-400 drop-shadow-md">₹{product.price.toFixed(2)}</span>
                                </div>
                            </motion.div>

                            <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
                                <div className="mt-6">
                                    <PayPalButtons 
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        description: product.pname,
                                                        amount: {
                                                            // We assume INR, but PayPal requires conversion for test mostly. We just simulate with USD for test
                                                            value: (product.price / 80).toFixed(2), // roughly converted to USD for paypal sandbox limits
                                                        },
                                                    },
                                                ],
                                            });
                                        }}
                                        onApprove={async (data, actions) => {
                                            const details = await actions.order.capture();
                                            console.log("Transaction completed by " + details.payer.name.given_name);
                                            
                                            try {
                                                // Create order in backend after PayPal success
                                                await api.post('/orders/place', {
                                                    pid: product.pid,
                                                    sid: "system",
                                                    quantity: 1,
                                                    price: product.price
                                                });
                                                
                                                navigate('/customer/dashboard');
                                            } catch (error) {
                                                console.error("Failed to place order:", error);
                                                alert("Payment successful but failed to register order. Please contact support.");
                                            }
                                        }}
                                        onError={(err) => {
                                            console.error("PayPal Error:", err);
                                        }}
                                    />
                                </div>
                            </PayPalScriptProvider>
                        </div>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
