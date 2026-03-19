import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { LogOut, ShoppingBag, Package, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 80, rotateX: -40, scale: 0.7 },
    show: { 
        opacity: 1, 
        y: 0, 
        rotateX: 0, 
        scale: 1,
        transition: { type: "spring", stiffness: 500, damping: 25, mass: 0.8 }
    }
};

export default function CustomerDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('shop'); // shop or orders
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        try {
            // Note: Since API endpoint requires auth, Axios interceptor will attach JWT
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/customer');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBuy = (product) => {
        navigate(`/customer/checkout/${product.pid}`);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <PageTransition>
            <div className="space-y-6 perspective-1000 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Area */}
                <motion.div 
                    initial={{ opacity: 0, y: -20, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div style={{ transform: 'translateZ(20px)' }}>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Customer Dashboard, <span className="text-indigo-400">{username}</span></h1>
                        <p className="text-slate-300 text-sm mt-1 font-light">Browse available medicines and manage your past orders.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3" style={{ transform: 'translateZ(30px)' }}>
                        <button 
                            onClick={() => setActiveTab('shop')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'shop' ? 'bg-indigo-600 text-white neon-glow' : 'bg-black/20 text-slate-300 hover:bg-black/40 border border-white/5'}`}
                        >
                            Products
                        </button>
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white neon-glow' : 'bg-black/20 text-slate-300 hover:bg-black/40 border border-white/5'}`}
                        >
                            My Orders
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-bold ml-2 lg:ml-4"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </motion.div>

                {/* Content Area */}
                {activeTab === 'shop' ? (
                    <motion.div 
                        key="shop"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 bg-black/30 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                                <Package className="w-6 h-6 text-indigo-400 drop-shadow-md" /> Available Medicines
                            </h2>
                        </div>
                        
                        {products.length === 0 ? (
                            <div className="text-center p-12 glass-panel rounded-3xl text-slate-400 text-lg">
                                No products available.
                            </div>
                        ) : (
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000"
                            >
                                {products.map(p => (
                                    <motion.div 
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.08, rotateY: 8, rotateX: -8, translateZ: 40 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 20, mass: 0.8 }}
                                        key={p.pid} 
                                        style={{ transformStyle: 'preserve-3d' }}
                                        className="glass-panel-light rounded-2xl p-6 hover:shadow-2xl transition-all relative overflow-hidden group cursor-pointer"
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        <div className="flex justify-between items-start mb-5 relative z-10" style={{ transform: 'translateZ(20px)' }}>
                                            <div>
                                                <h3 className="font-bold text-xl text-white drop-shadow-md leading-tight">{p.pname}</h3>
                                                <span className="inline-block mt-2 px-3 py-1 bg-black/40 text-slate-300 border border-white/10 rounded-lg text-xs font-semibold tracking-wide">
                                                    {p.manufacturer}
                                                </span>
                                            </div>
                                            <div className="text-xl font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                                ₹{p.price}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3 text-sm text-slate-400 mb-6 relative z-10" style={{ transform: 'translateZ(10px)' }}>
                                            <div className="flex justify-between border-b border-white/5 pb-2">
                                                <span>Mfg Date:</span>
                                                <span className="text-slate-200 font-medium tracking-wide">{new Date(p.mfg).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Exp Date:</span>
                                                <span className="text-slate-200 font-medium tracking-wide">{new Date(p.exp).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        
                                        <motion.button 
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleBuy(p)}
                                            style={{ transform: 'translateZ(30px)' }}
                                            className="w-full py-3 bg-white/5 hover:bg-indigo-600 text-white rounded-xl font-bold border border-white/10 hover:border-indigo-500 transition-all duration-300 flex items-center justify-center gap-2 relative z-10 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] group-hover:bg-indigo-600/80"
                                        >
                                            <ShoppingBag className="w-5 h-5" /> Buy Now
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="orders"
                        initial={{ opacity: 0, rotateX: -20, y: 30 }} 
                        animate={{ opacity: 1, rotateX: 0, y: 0 }} 
                        exit={{ opacity: 0 }}
                        className="space-y-6 perspective-1000"
                    >
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3 bg-black/30 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg inline-flex">
                            <ShoppingBag className="w-6 h-6 text-indigo-400" /> Order History
                        </h2>
                        <motion.div 
                            whileHover={{ translateZ: 10, rotateX: 1 }}
                            className="glass-panel rounded-3xl overflow-hidden"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-black/40 text-slate-300 text-sm border-b border-white/10 uppercase tracking-wider font-semibold">
                                            <th className="p-5">Tx ID</th>
                                            <th className="p-5">Product ID</th>
                                            <th className="p-5">Timestamp</th>
                                            <th className="p-5">Units</th>
                                            <th className="p-5">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-10 text-center text-slate-400 text-lg">
                                                    No transactions found in ledger.
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((o, idx) => (
                                                <tr key={o.oid || idx} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-5 font-bold text-indigo-300">#{o.oid}</td>
                                                    <td className="p-5 text-slate-300 font-mono tracking-wide">{o.pid}</td>
                                                    <td className="p-5 text-slate-400">{o.orderdatetime ? new Date(o.orderdatetime).toLocaleString() : 'N/A'}</td>
                                                    <td className="p-5 text-slate-300 font-bold">{o.quantity}</td>
                                                    <td className="p-5 font-bold text-emerald-400">₹{o.price}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </PageTransition>
    );
}
