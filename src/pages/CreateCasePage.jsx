import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, ArrowLeft, AlertCircle, Gavel, Scale, Clock, Sparkles, FileText } from 'lucide-react';
import { useCasesStore } from '@/store/cases';
import { motion } from 'framer-motion';

import { toast } from 'sonner';

const CreateCasePage = () => {
    const navigate = useNavigate();
    const { createCase, isLoading: isMutating } = useCasesStore();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        caseNumber: '',
        caseType: 'Criminal Defense',
        description: '',
        urgency: 'Medium',
    });

    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await createCase(formData);
            toast.success("Case workspace created successfully", {
                description: `Matter ${formData.caseNumber} has been initialized.`
            });
            navigate('/dashboard/workspace');
        } catch (err) {
            console.error("Failed to create case:", err);
            
            // Comprehensive Error Handling with Toasts
            if (err.response) {
                const status = err.response.status;
                const message = err.response.data?.message || "An error occurred";

                switch (status) {
                    case 400:
                        toast.error("Validation Error", { description: message });
                        break;
                    case 401:
                        toast.error("Unauthorized", { description: "Please sign in again to continue." });
                        break;
                    case 403:
                        toast.error("Permission Denied", { description: "You don't have permission to create cases." });
                        break;
                    case 404:
                        toast.error("Resource Not Found", { description: message });
                        break;
                    case 409:
                        toast.error("Duplicate Case", { description: "A case with this number already exists." });
                        break;
                    case 500:
                        toast.error("Server Error", { description: "Something went wrong on our end. Please try again later." });
                        break;
                    default:
                        toast.error("Error", { description: message });
                }
            } else if (err.request) {
                // Network error
                toast.error("Network Error", { description: "Could not connect to the server. Please check your internet connection." });
            } else {
                toast.error("Application Error", { description: err.message });
            }
            
            // Keep local error for persistent display if needed, or remove if toast is enough
            setError(err.response?.data?.message || "Failed to create case. Please try again.");
        }
    };

    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-accent/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />

            {/* Back Navigation */}
            <div className="px-8 pt-8 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors group mb-4"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium tracking-wide">Back to Dashboard</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full z-10 px-8 pb-8 gap-12">

                {/* LEFT COLUMN: The Form */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex-1 lg:max-w-3xl"
                >
                    <motion.div variants={itemVariants} className="mb-8">
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-teal-accent tracking-tight mb-3">
                            Initiate New Matter
                        </h1>
                        <p className="text-lg text-muted-foreground font-light">
                            Create a secure workspace for your new legal case.
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <motion.div variants={itemVariants} className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive">
                                <AlertCircle size={20} />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}

                        {/* Section 1: Core Details */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 group-focus-within:text-teal-accent transition-colors">Case Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. State v. Johnson"
                                        className="w-full bg-secondary/5 backdrop-blur-sm border border-border/40 rounded-2xl px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-teal-accent focus:bg-secondary/10 focus:ring-4 focus:ring-teal-accent/10 transition-all shadow-sm"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="group space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 group-focus-within:text-teal-accent transition-colors">Case Number</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. CR-2024-001"
                                        className="w-full bg-secondary/5 backdrop-blur-sm border border-border/40 rounded-2xl px-5 py-4 text-lg font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-teal-accent focus:bg-secondary/10 focus:ring-4 focus:ring-teal-accent/10 transition-all shadow-sm"
                                        value={formData.caseNumber}
                                        onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="group space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 group-focus-within:text-teal-accent transition-colors">Description & Context</label>
                                <textarea
                                    rows={4}
                                    placeholder="Brief overview of the case, key parties, or initial notes..."
                                    className="w-full bg-secondary/5 backdrop-blur-sm border border-border/40 rounded-2xl px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-teal-accent focus:bg-secondary/10 focus:ring-4 focus:ring-teal-accent/10 transition-all shadow-sm resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </motion.div>

                        {/* Section 2: Classification */}
                        <motion.div variants={itemVariants} className="pt-4 space-y-6">
                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                <Scale className="text-teal-accent" size={20} /> Classification
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Practice Area</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none bg-secondary/5 backdrop-blur-sm border border-border/40 rounded-2xl px-5 py-4 text-base text-foreground outline-none focus:border-teal-accent focus:bg-secondary/10 focus:ring-4 focus:ring-teal-accent/10 transition-all cursor-pointer hover:border-border/80"
                                            value={formData.caseType}
                                            onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                                        >
                                            <option>Criminal Defense</option>
                                            <option>Family Law</option>
                                            <option>Civil Litigation</option>
                                            <option>Corporate Law</option>
                                            <option>Immigration</option>
                                            <option>Real Estate</option>
                                            <option>Intellectual Property</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <Gavel size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Urgency Priority</label>
                                    <div className="grid grid-cols-4 gap-2 bg-surface/30 p-1.5 rounded-2xl border border-border/30">
                                        {['low', 'medium', 'high'].map((p) => {
                                            const isActive = formData.urgency === p;
                                            let colorClass = "bg-primary text-primary-foreground shadow-md";
                                            if (isActive && p === 'high') colorClass = "bg-orange-500 text-white shadow-md";
                                            if (isActive && p === 'medium') colorClass = "bg-red-500 text-white shadow-md";

                                            return (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, urgency: p })}
                                                    className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${isActive
                                                        ? colorClass
                                                        : 'text-muted-foreground hover:bg-surface/50 hover:text-foreground'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Submit Actions */}
                        <motion.div variants={itemVariants} className="pt-8 flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={isMutating}
                                className="flex-1 bg-gradient-to-r from-primary to-teal-accent hover:from-teal-800 hover:to-teal-600 text-white text-lg font-bold py-4 rounded-2xl shadow-xl shadow-teal-900/10 hover:shadow-2xl hover:shadow-teal-900/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {isMutating ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                Create Case Workspace
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-8 py-4 text-muted-foreground hover:text-foreground font-semibold hover:bg-surface/50 rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                        </motion.div>

                    </form>
                </motion.div>

                {/* RIGHT COLUMN: Visuals / Context */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="hidden lg:flex flex-col flex-1 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-surface/40 to-surface/10 rounded-3xl border border-white/5 backdrop-blur-md p-8 overflow-hidden">
                        {/* Decorative Circle */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[60px] translate-x-1/3 -translate-y-1/3" />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <Sparkles className="text-accent" /> AI Workspace Preview
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 rounded-xl bg-background/40 border border-white/5">
                                        <div className="h-10 w-10 rounded-full bg-teal-accent/20 flex items-center justify-center text-teal-accent">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">Automated Filing</p>
                                            <p className="text-xs text-muted-foreground mt-1">Folders will be auto-generated based on case type.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-4 rounded-xl bg-background/40 border border-white/5">
                                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">Deadline Tracking</p>
                                            <p className="text-xs text-muted-foreground mt-1">Smart alerts will be configured for common {formData.caseType || 'Legal'} milestones.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Message based on inputs */}
                            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-tr from-primary to-teal-900 border border-white/10 text-white relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                <div className="relative z-10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-teal-200 mb-2">Ready to Deploy</p>
                                    <div className="text-2xl font-bold mb-1">
                                        {formData.title || 'New Matter'}
                                    </div>
                                    <p className="text-teal-100 text-sm opacity-80 font-mono">
                                        REF: {formData.caseNumber || 'PENDING...'}
                                    </p>
                                </div>
                                <Sparkles className="absolute bottom-4 right-4 text-white/10 group-hover:text-white/30 transition-colors transform scale-150 rotate-12" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateCasePage;
