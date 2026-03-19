import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { LogOut, PlusCircle, Package, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function SellerDashboard() {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('add'); // add or orders
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const [productForm, setProductForm] = useState({
        pid: '', pname: '', manufacturer: '', mfg: '', exp: '', price: ''
    });

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    const fetchSellerOrders = async () => {
        try {
            const res = await api.get('/orders/seller');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products/add', productForm);
            alert('Product added successfully to inventory!');
            setProductForm({ pid: '', pname: '', manufacturer: '', mfg: '', exp: '', price: '' });
        } catch (err) {
            const msg = err.response?.data || 'Failed to add product';
            alert(msg);
        }
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
                        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Provider Portal, <span className="text-purple-400">{username}</span></h1>
                        <p className="text-slate-300 text-sm mt-1 font-light">Supply chain management & operations hub.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3" style={{ transform: 'translateZ(30px)' }}>
                        <button 
                            onClick={() => setActiveTab('add')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'add' ? 'bg-purple-600 text-white neon-glow' : 'bg-black/20 text-slate-300 hover:bg-black/40 border border-white/5'}`}
                        >
                            Inject Node
                        </button>
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-purple-600 text-white neon-glow' : 'bg-black/20 text-slate-300 hover:bg-black/40 border border-white/5'}`}
                        >
                            Distribution Feed
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-bold ml-2 lg:ml-4"
                        >
                            <LogOut className="w-4 h-4" /> Terminate Link
                        </button>
                    </div>
                </motion.div>

                {/* Content Area */}
                {activeTab === 'add' ? (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotateY: 20, z: -200 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.8 }}
                        className="glass-panel rounded-3xl overflow-hidden max-w-3xl mx-auto"
                        style={{ transformStyle: 'preserve-3d' }}
                     >
                        <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-black/20" style={{ transform: 'translateZ(20px)' }}>
                            <PlusCircle className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-bold text-white">Synthesize New Product</h2>
                        </div>
                        
                        <form onSubmit={handleAddProduct} className="p-8 space-y-6" style={{ transform: 'translateZ(30px)' }}>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Node Matrix ID</label>
                                    <input
                                        type="text" required
                                        value={productForm.pid} onChange={(e) => setProductForm({...productForm, pid: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/30 focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                        placeholder="e.g., DRG101"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Valuation (₹)</label>
                                    <input
                                        type="number" required min="1"
                                        value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/30 focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Compound Identifier</label>
                                <input
                                    type="text" required
                                    value={productForm.pname} onChange={(e) => setProductForm({...productForm, pname: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/30 focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                    placeholder="e.g., Paracetamol 500mg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Synthesis Origin</label>
                                <input
                                    type="text" required
                                    value={productForm.manufacturer} onChange={(e) => setProductForm({...productForm, manufacturer: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/30 focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm"
                                    placeholder="e.g., CyberCorp Labs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Creation Cycle</label>
                                    <input
                                        type="date" required
                                        value={productForm.mfg} onChange={(e) => setProductForm({...productForm, mfg: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/30 focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm [color-scheme:dark]"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Decay Cycle</label>
                                    <input
                                        type="date" required
                                        value={productForm.exp} onChange={(e) => setProductForm({...productForm, exp: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-black/30 focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium text-white shadow-inner backdrop-blur-sm [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, translateZ: 10 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full mt-4 py-4 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl neon-glow transition-all disabled:opacity-70"
                            >
                                Publish to Network
                            </motion.button>
                        </form>
                     </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, rotateX: -20, y: 30 }} 
                        animate={{ opacity: 1, rotateX: 0, y: 0 }} 
                        exit={{ opacity: 0 }}
                        className="space-y-6 perspective-1000"
                    >
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3 bg-black/30 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg inline-flex">
                            <ClipboardList className="w-6 h-6 text-purple-400" /> Network Flow
                        </h2>
                        <motion.div 
                            whileHover={{ translateZ: 10, rotateX: 1 }}
                            className="glass-panel rounded-3xl overflow-hidden"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="bg-black/40 text-slate-300 text-sm border-b border-white/10 uppercase tracking-wider font-semibold">
                                            <th className="p-5">Flow ID</th>
                                            <th className="p-5">Node Reference</th>
                                            <th className="p-5">Target UID</th>
                                            <th className="p-5">Timestamp</th>
                                            <th className="p-5">Quantity</th>
                                            <th className="p-5 text-right">Yield</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="p-10 text-center text-slate-400 text-lg">
                                                    No flows established yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((o, idx) => (
                                                <tr key={o.oid || idx} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-5 font-bold text-purple-300">#{o.oid}</td>
                                                    <td className="p-5 text-slate-300 font-mono tracking-wide">{o.pid}</td>
                                                    <td className="p-5 text-slate-400">{o.uid}</td>
                                                    <td className="p-5 text-slate-400">{o.orderdatetime ? new Date(o.orderdatetime).toLocaleString() : 'N/A'}</td>
                                                    <td className="p-5 text-slate-300 font-bold">{o.quantity}</td>
                                                    <td className="p-5 font-bold text-emerald-400 text-right">₹{o.price}</td>
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
