import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PublicPageLayout from '@/components/layout/PublicPageLayout';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowRight, Sparkles, Shield, Calendar, Scale, FileText, 
  CheckCircle2, XCircle, Zap, Globe, MessageSquare, BadgeCheck,
  ChevronDown
} from 'lucide-react';

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

import SystemBootLoader from '@/components/ui/SystemBootLoader';
import { useBootSequence } from '@/hooks/useBootSequence';

export default function Home() {
  const { shouldBoot, completeBoot } = useBootSequence();
  if (shouldBoot) {
    return <SystemBootLoader onComplete={completeBoot} />;
  }


  return (
    <PublicPageLayout 
        title="Future of Legal Tech" 
        description="Advyon is the unified platform for modern legal firms. AI-driven automation, secure document management, and client portals."
    >
        
        {/* HERO SECTION - Split Layout (Hockroll Style) */}
        <section className="relative min-h-[90vh] flex items-center pt-20">
            {/* Background Glow - Left Aligned */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-teal-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
            
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* LEFT COLUMN: Typography & CTAs */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-xl relative z-20" 
                    >
                         {/* Badge */}
                         <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-900/30 px-4 py-1.5 text-xs font-semibold tracking-wider text-teal-300 backdrop-blur-md border border-teal-500/20 shadow-lg cursor-default uppercase">
                            <Sparkles className="h-3 w-3 text-teal-200" />
                            <span>The Future of Legal Tech</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={fadeInUp} className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl mb-6 leading-[1.1] drop-shadow-lg">
                            Your firm&apos;s <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-emerald-200">
                                single source of truth.
                            </span>
                        </motion.h1>
                        
                        <motion.p variants={fadeInUp} className="text-lg text-emerald-100/70 mb-8 leading-relaxed max-w-md font-light">
                            No more searching across scattered documents. Advyon gives you everything you need to manage your firm&apos;s compliance and workflows.
                        </motion.p>
                        
                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-12">
                            <Link to="/auth/signup">
                                <Button size="lg" className="h-14 px-8 text-lg bg-[#bbf7d0] text-teal-950 hover:bg-[#86efac] font-semibold border-0 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(187,247,208,0.3)]">
                                     Get Started
                                </Button>
                            </Link>
                             <div className="flex items-center gap-6 px-4 border-l border-white/10 ml-2">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">500+</div>
                                    <div className="text-xs text-emerald-100/50 uppercase tracking-wider">Clients</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">100%</div>
                                    <div className="text-xs text-emerald-100/50 uppercase tracking-wider">Secure</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT COLUMN: Floating Glass UI */}
                    <div className="relative h-[600px] w-full hidden lg:block perspective-[1000px]">
                        
                        {/* Main Glass Card: Document List */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, rotateX: 5 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="absolute top-[18%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-[90%] bg-teal-950/40 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-6 shadow-2xl z-20"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    Active Documents
                                </h3>
                                <div className="bg-white/5 px-3 py-1 rounded-lg text-xs text-emerald-100/60 border border-white/5">
                                    Filter by Status
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {[
                                    { name: "Employee Handbook", type: "Policy", status: "active" },
                                    { name: "Data Privacy Agreement", type: "Contract", status: "active" },
                                    { name: "Q3 Compliance Report", type: "Report", status: "pending" },
                                    { name: "Client Onboarding", type: "Workflow", status: "active" },
                                    { name: "Ethics Charter 2024", type: "Policy", status: "active" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${item.status === 'active' ? 'bg-teal-500/10 text-teal-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-emerald-50 font-medium group-hover:text-white transition-colors">{item.name}</div>
                                                <div className="text-xs text-emerald-100/40">{item.type}</div>
                                            </div>
                                        </div>
                                         <div className={`h-2 w-2 rounded-full ${item.status === 'active' ? 'bg-teal-500' : 'bg-amber-500/50'} shadow-sm`} />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Floating Widget 1: Expert Profile */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[-4%] left-10 bg-[#0c2e2c]/80 backdrop-blur-xl border border-teal-500/20 rounded-2xl p-4 shadow-xl z-30 flex items-center gap-3"
                        >
                            <Avatar className="h-10 w-10 border border-teal-500/30">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>EA</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="text-sm font-bold text-white">Ross Arnold</div>
                                <div className="text-xs text-emerald-100/60">Legal AI Expert</div>
                            </div>
                        </motion.div>

                         {/* Floating Widget 2: Stats */}
                         <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -top-3 -right-10 bg-[#e9f5f3] text-[#081c1b] backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 w-48"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-teal-800/60">Policies</span>
                                <BadgeCheck className="h-4 w-4 text-teal-600" />
                            </div>
                            <div className="text-3xl font-bold mb-1">79%</div>
                            <div className="h-1.5 w-full bg-teal-200/50 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-600 w-[79%]" />
                            </div>
                            <div className="mt-2 flex gap-2 text-[10px] font-medium text-teal-800/70">
                                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-teal-600"/> 54 OK</span>
                                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500"/> 23 Attn</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-emerald-100/30 pointer-events-none"
            >
                <ChevronDown className="h-8 w-8" />
            </motion.div>
        </section>

        {/* SECTION: PROBLEM / SOLUTION - New Branding */}
        <section className="py-32 relative z-10">
             <div className="container mx-auto px-6 lg:px-12">
                <SectionHeader 
                    title="Why Modern Firms Switch" 
                    subtitle="Stop wrestling with outdated systems and start practicing law."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Problem Glass Card */}
                    <GlassCard variant="danger" className="p-10 lg:p-14 rounded-[3rem]">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center mb-8 shadow-inner shadow-red-500/10">
                            <XCircle className="h-8 w-8 text-red-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-red-50 mb-6">The Old Way</h3>
                        <ul className="space-y-6 text-red-100/70 text-lg">
                            <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <span>Scattered documents across email & drives.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <span>Unbillable hours spent on admin chaos.</span>
                            </li>
                             <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <span>Data security vulnerabilities.</span>
                            </li>
                        </ul>
                    </GlassCard>

                    {/* Solution Glass Card - Highly emphasized */}
                    <GlassCard variant="active" className="p-10 lg:p-14 rounded-[3rem] border-teal-400/30">
                        <div className="relative z-10 h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-900/20 flex items-center justify-center mb-8 shadow-inner shadow-teal-500/20">
                            <CheckCircle2 className="h-8 w-8 text-teal-400" />
                        </div>
                        <h3 className="relative z-10 text-3xl font-bold text-white mb-6">The Advyon Edge</h3>
                         <ul className="relative z-10 space-y-6 text-teal-50/90 text-lg">
                            <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
                                <span>Unified Intelligent Platform.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
                                <span>AI-driven automation reclaims 20h/week.</span>
                            </li>
                             <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
                                <span>Bank-grade encryption & compliance.</span>
                            </li>
                        </ul>
                    </GlassCard>
                </div>
             </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-32 relative">
             <div className="container mx-auto px-6 lg:px-12">
                 <SectionHeader 
                    title="Built for the Future of Law" 
                    subtitle="Every tool you need, reimagined with intelligence at the core."
                 />

                 <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                 >
                    {[
                        { icon: Shield, title: "Smart Security", desc: "Enterprise-grade encryption with AI threat detection." },
                        { icon: Zap, title: "Instant Analysis", desc: "Upload contracts and get AI summaries in seconds." },
                        { icon: Globe, title: "Global Access", desc: "Secure cloud infrastructure accessible from anywhere." },
                        { icon: Calendar, title: "Auto-Scheduling", desc: "AI coordinates meetings with clients automatically." },
                        { icon: MessageSquare, title: "Client Portal", desc: "Secure communication channel for seamless updates." },
                        { icon: Scale, title: "Case Intelligence", desc: "Predictive analytics for better case outcomes." }
                    ].map((feature, i) => (
                        <motion.div key={i} variants={fadeInUp}>
                            <GlassCard interactive className="h-full rounded-3xl hover:bg-white/10 group">
                                <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
                                    <feature.icon className="h-6 w-6 text-teal-400" />
                                </div>
                                <h3 className="text-xl font-bold text-teal-50 group-hover:text-white transition-colors mb-2">{feature.title}</h3>
                                <p className="text-emerald-100/60 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </GlassCard>
                        </motion.div>
                    ))}
                 </motion.div>
             </div>
        </section>

        {/* PRICING PREVIEW SECTION */}
        <section id="pricing" className="py-32 relative">
             <div className="container mx-auto px-6 lg:px-12">
                 <SectionHeader title="Transparent Pricing" subtitle="Start small and scale as you grow. No hidden fees." />
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                     {/* Starter */}
                     <GlassCard className="p-8 hover:bg-white/5 transition-colors">
                         <h3 className="text-xl font-bold text-white mb-2">Solo</h3>
                         <div className="text-3xl font-bold text-teal-400 mb-6">$49<span className="text-sm text-emerald-100/50 font-medium">/mo</span></div>
                         <ul className="space-y-4 mb-8">
                             {["1 User", "5 Active Cases", "Basic AI Docs", "Client Portal"].map((feat, i) => (
                                 <li key={i} className="flex items-center gap-3 text-sm text-emerald-100/70">
                                     <CheckCircle2 className="h-4 w-4 text-teal-500" /> {feat}
                                 </li>
                             ))}
                         </ul>
                         <Button variant="outline" className="w-full border-teal-500/30 text-teal-300 hover:bg-teal-950 hover:text-white font-semibold">Start Free Trial</Button>
                     </GlassCard>

                     {/* Pro - Highlighted */}
                     <GlassCard variant="active" className="p-10 border-teal-400/50 relative transform md:scale-110 z-10 shadow-2xl shadow-teal-900/40">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-teal-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                         <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
                         <div className="text-4xl font-bold text-teal-300 mb-6">$129<span className="text-sm text-emerald-100/50 font-medium">/mo</span></div>
                         <ul className="space-y-4 mb-8">
                             {["Up to 5 Users", "Unlimited Cases", "Advanced AI Agents", "Priority Support", "Analytics"].map((feat, i) => (
                                 <li key={i} className="flex items-center gap-3 text-emerald-50">
                                     <CheckCircle2 className="h-5 w-5 text-teal-400" /> {feat}
                                 </li>
                             ))}
                         </ul>
                         <Button className="w-full bg-teal-500 text-teal-950 hover:bg-teal-400 font-bold shadow-lg shadow-teal-500/25">Get Started</Button>
                     </GlassCard>

                     {/* Enterprise */}
                     <GlassCard className="p-8 hover:bg-white/5 transition-colors">
                         <h3 className="text-xl font-bold text-white mb-2">Firm</h3>
                         <div className="text-3xl font-bold text-teal-400 mb-6">$299<span className="text-sm text-emerald-100/50 font-medium">/mo</span></div>
                         <ul className="space-y-4 mb-8">
                             {["Unlimited Users", "Custom Integrations", "Dedicated Manager", "SLA", "On-premise Option"].map((feat, i) => (
                                 <li key={i} className="flex items-center gap-3 text-sm text-emerald-100/70">
                                     <CheckCircle2 className="h-4 w-4 text-teal-500" /> {feat}
                                 </li>
                             ))}
                         </ul>
                         <Button variant="outline" className="w-full border-teal-500/30 text-teal-300 hover:bg-teal-950 hover:text-white font-semibold">Contact Sales</Button>
                     </GlassCard>
                 </div>
             </div>
        </section>

        {/* [NEW] HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-32 relative overflow-hidden">
             <div className="container mx-auto px-6 lg:px-12">
                <SectionHeader 
                    title="How It Works" 
                    subtitle="Seamless onboarding to get your firm running in minutes."
                />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     {[
                        { step: "01", title: "Sign Up", desc: "Create your secure organization account." },
                        { step: "02", title: "Invite Team", desc: "Add colleagues and set permissions." },
                        { step: "03", title: "Connect", desc: "Integrate your existing workflow tools." },
                        { step: "04", title: "Automate", desc: "Start new cases and let AI handle admin." }
                     ].map((step, i) => (
                         <div key={i} className="relative group">
                             {/* Connector Line */}
                             {i !== 3 && (
                                <div className="hidden md:block absolute top-[50px] overflow-hidden right-[-50%] w-full h-[2px] bg-teal-900/50 z-0">
                                     <div className="h-full w-full bg-teal-500/50 origin-left scale-x-0 transition-transform duration-700 delay-300 group-hover:scale-x-100" />
                                </div>
                             )}
                             
                             <GlassCard className="text-center p-8 relative z-10 hover:border-teal-500/50 transition-colors duration-500">
                                 <div className="inline-block text-5xl font-black text-white/5 mb-4">{step.step}</div>
                                 <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                 <p className="text-sm text-emerald-100/60">{step.desc}</p>
                             </GlassCard>
                         </div>
                     ))}
                </div>
             </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-32 relative">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-300 border border-teal-500/20 mb-8">
                            <BadgeCheck className="h-4 w-4" />
                            <span>Verified Success Stories</span>
                        </div>
                        <h2 className="text-5xl font-bold mb-8">Trusted by Top Firms</h2>
                        <blockquote className="text-2xl font-light text-emerald-50/90 italic leading-relaxed mb-10 border-l-4 border-teal-500 pl-6">
                            &ldquo;Advyon didn&apos;t just organize our files; it fundamentally changed how we practice law. The AI insights are scary good.&rdquo;
                        </blockquote>
                        <div className="flex items-center gap-5">
                            <Avatar className="h-16 w-16 border-2 border-teal-500/50">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-white text-lg">Sarah Jenkins</h4>
                                <p className="text-emerald-100/50">Partner, Jenkins & Co.</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Floating Glass Stats */}
                    <div className="grid grid-cols-2 gap-6">
                         {[
                             { val: "20h+", label: "Saved Weekly", col: "text-teal-400" },
                             { val: "99%", label: "Satisfaction", col: "text-amber-400" },
                             { val: "0", label: "Breaches", col: "text-purple-400" },
                             { val: "3x", label: "Faster Billing", col: "text-blue-400" }
                         ].map((stat, i) => (
                              <GlassCard key={i} className={`p-8 text-center ${i % 2 !== 0 ? 'mt-12' : ''}`}>
                                 <h3 className={`text-4xl font-bold ${stat.col} mb-2`}>{stat.val}</h3>
                                 <p className="text-xs font-bold text-emerald-100/50 uppercase tracking-widest">{stat.label}</p>
                             </GlassCard>
                         ))}
                    </div>
                </div>
            </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative py-32">
            <div className="container mx-auto px-6 lg:px-12">
                <GlassCard className="relative overflow-hidden rounded-[3rem] px-6 py-24 text-center border-teal-500/30">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl z-0" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl z-0" />

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                            Ready to elevate your practice?
                        </h2>
                        <p className="mx-auto max-w-2xl text-xl leading-8 text-emerald-100/80 mb-12">
                            Join the platform building the future of legal work. No credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/auth/signup">
                                <Button size="xl" className="h-16 px-12 text-xl bg-white text-teal-950 hover:bg-emerald-50 font-bold shadow-xl rounded-2xl">
                                    Get Started Now
                                </Button>
                            </Link>
                            <Link to="/demo">
                                 <Button variant="link" className="text-emerald-200 hover:text-white text-lg">
                                    Book a Demo <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </section>
    </PublicPageLayout>
  );
}
