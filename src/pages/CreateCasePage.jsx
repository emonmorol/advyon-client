import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, Loader2, ArrowLeft, AlertCircle, Gavel, Scale, Clock,
    Sparkles, FileText, ShieldCheck, Brain, BookOpen
} from 'lucide-react';
import { useCasesStore } from '@/store/cases';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const CreateCasePage = () => {
    const navigate = useNavigate();
    const { createCase, isLoading: isMutating } = useCasesStore();

    const [formData, setFormData] = useState({
        title: '',
        caseNumber: '',
        caseType: 'Criminal Defense',
        description: '',
        urgency: 'medium',
    });

    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            // Remove empty caseNumber to allow auto-generation on backend
            const payload = {
                ...formData,
                caseNumber: formData.caseNumber.trim() || undefined
            };
            const newCase = await createCase(payload);
            toast.success("Case workspace created successfully", {
                description: `Matter ${newCase.caseNumber} has been initialized.`
            });
            navigate('/dashboard/workspace');
        } catch (err) {
            console.error("Failed to create case:", err);
            if (err.response) {
                const status = err.response.status;
                const message = err.response.data?.message || "An error occurred";
                switch (status) {
                    case 400: toast.error("Validation Error", { description: message }); break;
                    case 401: toast.error("Unauthorized", { description: "Please sign in again to continue." }); break;
                    case 403: toast.error("Permission Denied", { description: "You don't have permission to create cases." }); break;
                    case 404: toast.error("Resource Not Found", { description: message }); break;
                    case 409: toast.error("Duplicate Case", { description: "A case with this number already exists." }); break;
                    case 500: toast.error("Server Error", { description: "Something went wrong on our end. Please try again later." }); break;
                    default: toast.error("Error", { description: message });
                }
            } else if (err.request) {
                toast.error("Network Error", { description: "Could not connect to the server. Please check your internet connection." });
            } else {
                toast.error("Application Error", { description: err.message });
            }
            setError(err.response?.data?.message || "Failed to create case. Please try again.");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
    };
    const itemVariants = {
        hidden: { y: 16, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
    };

    const caseTypes = [
        'Criminal Defense', 'Family Law', 'Civil Litigation',
        'Corporate Law', 'Immigration', 'Real Estate', 'Intellectual Property'
    ];

    const aiFeatures = [
        { icon: FileText, title: 'Automated Filing', desc: 'Folders auto-generated based on case type.' },
        { icon: Clock, title: 'Deadline Tracking', desc: `Smart alerts for ${formData.caseType} milestones.` },
        { icon: Brain, title: 'Document Intelligence', desc: 'AI-powered document analysis & extraction.' },
        { icon: ShieldCheck, title: 'Compliance Monitor', desc: 'Automated regulatory compliance checks.' },
    ];

    // Input class shared across fields
    const inputClass = "w-full bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-teal-accent focus:bg-background/80 focus:ring-2 focus:ring-teal-accent/15 transition-all duration-200";
    const labelClass = "text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] pl-0.5 group-focus-within:text-teal-accent transition-colors";

    return (
        <div className="h-[calc(100vh-56px)] bg-background text-foreground relative overflow-hidden flex flex-col">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-accent/15 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 -translate-x-1/4 translate-y-1/4" />

            {/* Top Bar */}
            <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 pt-3 pb-1 flex-shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-teal-accent transition-colors group"
                >
                    <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                    <span className="text-xs font-medium tracking-wide">Back to Dashboard</span>
                </button>
            </div>

            {/* Main Content — fills remaining height */}
            <div className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-6 sm:px-10 pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 h-full items-stretch">

                    {/* ============ LEFT: Form (3/5) ============ */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="lg:col-span-3 flex flex-col"
                    >
                        {/* Header */}
                        <motion.div variants={itemVariants} className="mb-4 flex-shrink-0">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-teal-accent flex items-center justify-center shadow-md shadow-primary/20">
                                    <Scale className="text-white" size={18} />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-accent">New Legal Matter</p>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-1">
                                Initiate New Matter
                            </h1>
                            <p className="text-sm text-muted-foreground font-light">
                                Create a secure, AI-powered workspace for your new legal case.
                            </p>
                        </motion.div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 min-h-0">
                            {error && (
                                <motion.div variants={itemVariants} className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-2.5 text-destructive flex-shrink-0">
                                    <AlertCircle size={16} className="flex-shrink-0" />
                                    <p className="text-xs font-medium">{error}</p>
                                </motion.div>
                            )}

                            {/* Section 1: Core Details */}
                            <motion.div variants={itemVariants} className="bg-surface/[0.03] backdrop-blur-sm border border-border/30 rounded-2xl p-5 sm:p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="text-teal-accent" size={16} />
                                    <h3 className="text-base font-semibold text-foreground">Core Details</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="group space-y-1.5">
                                        <label className={labelClass}>Case Title <span className="text-destructive">*</span></label>
                                        <input type="text" required placeholder="e.g. State v. Johnson" className={inputClass}
                                            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div className="group space-y-1.5">
                                        <label className={labelClass}>Case Number <span className="text-muted-foreground">(optional)</span></label>
                                        <input type="text" placeholder="Leave blank for auto-generation (ADV-2024-XXXXXX)" className={`${inputClass} font-mono`}
                                            value={formData.caseNumber} onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })} />
                                    </div>
                                </div>

                                <div className="group space-y-1.5">
                                    <label className={labelClass}>Description & Context</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Brief overview of the case, key parties, or initial notes..."
                                        className={`${inputClass} resize-none leading-relaxed`}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </motion.div>

                            {/* Section 2: Classification */}
                            <motion.div variants={itemVariants} className="bg-surface/[0.03] backdrop-blur-sm border border-border/30 rounded-2xl p-5 sm:p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Scale className="text-teal-accent" size={16} />
                                    <h3 className="text-base font-semibold text-foreground">Classification</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className={labelClass}>Practice Area</label>
                                        <div className="relative">
                                            <select
                                                className={`${inputClass} appearance-none cursor-pointer hover:border-border pr-10`}
                                                value={formData.caseType}
                                                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                                            >
                                                {caseTypes.map(t => <option key={t}>{t}</option>)}
                                            </select>
                                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                <Gavel size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={labelClass}>Urgency Priority</label>
                                        <div className="grid grid-cols-3 gap-1.5 bg-background/40 p-1.5 rounded-xl border border-border/30">
                                            {['low', 'medium', 'high'].map((p) => {
                                                const isActive = formData.urgency === p;
                                                let activeClass = "bg-primary text-primary-foreground shadow-sm";
                                                if (isActive && p === 'high') activeClass = "bg-orange-500 text-white shadow-sm shadow-orange-500/20";
                                                if (isActive && p === 'medium') activeClass = "bg-red-500 text-white shadow-sm shadow-red-500/20";

                                                return (
                                                    <button key={p} type="button"
                                                        onClick={() => setFormData({ ...formData, urgency: p })}
                                                        className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${isActive ? activeClass : 'text-muted-foreground hover:bg-surface/30 hover:text-foreground'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Submit — pushed to bottom */}
                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
                                <button type="submit" disabled={isMutating}
                                    className="flex-1 bg-gradient-to-r from-primary to-teal-accent hover:from-teal-800 hover:to-teal-600 text-white text-[15px] font-bold py-4 rounded-xl shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {isMutating ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    Create Case Workspace
                                </button>
                                <button type="button" onClick={() => navigate(-1)}
                                    className="px-6 py-3.5 text-muted-foreground hover:text-foreground text-sm font-semibold hover:bg-surface/20 rounded-xl transition-all duration-200 border border-transparent hover:border-border/30"
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        </form>
                    </motion.div>

                    {/* ============ RIGHT: AI Preview (2/5) ============ */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden lg:flex lg:col-span-2 flex-col gap-3"
                    >
                        {/* AI Features Card */}
                        <div className="relative bg-gradient-to-br from-surface/50 to-surface/20 rounded-2xl border border-white/[0.06] backdrop-blur-md p-5 overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-accent/8 rounded-full blur-[50px] translate-x-1/4 -translate-y-1/4" />

                            <div className="relative z-10">
                                <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Sparkles className="text-accent" size={18} />
                                    AI Workspace Preview
                                </h3>

                                <div className="space-y-2.5">
                                    {aiFeatures.map((feature, i) => (
                                        <motion.div
                                            key={feature.title}
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + i * 0.08, duration: 0.35 }}
                                            className="flex gap-3 p-3 rounded-xl bg-background/30 border border-white/[0.04] hover:bg-background/50 hover:border-white/[0.08] transition-all duration-200 group cursor-default"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-teal-accent/15 flex items-center justify-center text-teal-accent flex-shrink-0 group-hover:bg-teal-accent/25 transition-colors">
                                                <feature.icon size={15} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-foreground text-xs leading-tight">{feature.title}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{feature.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Preview Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                            className="relative p-5 rounded-2xl bg-gradient-to-tr from-primary to-teal-900 border border-white/10 text-white overflow-hidden group flex-shrink-0"
                        >
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15" />
                            <div className="relative z-10">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-teal-200/80 mb-2">Ready to Deploy</p>
                                <div className="text-lg font-bold mb-1 truncate">
                                    {formData.title || 'New Matter'}
                                </div>
                                <p className="text-teal-100/70 text-xs font-mono truncate">
                                    REF: {formData.caseNumber || 'AUTO-GENERATED'}
                                </p>
                                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-teal-100/90 border border-white/10">
                                        {formData.caseType}
                                    </span>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${formData.urgency === 'high'
                                        ? 'bg-orange-500/20 text-orange-200 border-orange-400/30'
                                        : formData.urgency === 'medium'
                                            ? 'bg-red-500/20 text-red-200 border-red-400/30'
                                            : 'bg-white/10 text-teal-100/90 border-white/10'
                                        }`}>
                                        {formData.urgency} priority
                                    </span>
                                </div>
                            </div>
                            <Sparkles className="absolute bottom-2 right-2 text-white/[0.06] group-hover:text-white/15 transition-colors transform scale-[1.8] rotate-12" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CreateCasePage;
