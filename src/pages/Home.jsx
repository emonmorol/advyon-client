import LandingNavbar from '@/components/layout/LandingNavbar';
import Footer from '@/components/layout/Footer';
import LegalScene from '@/components/3d/LegalScene';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowRight, Sparkles, Shield, Calendar, BarChart, Scale, FileText, 
  CheckCircle2, XCircle, Zap, Globe, MessageSquare, BadgeCheck 
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

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

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax for text (scrolls slightly slower than background/foreground feels)
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-x-hidden bg-[#001514] text-white selection:bg-teal-500/30 selection:text-teal-50 font-sans">
      
      {/* 3D Background - Fixed & Locked */}
      {/* The OrbitControls in LegalScene handle the "rolling" interaction */}
      <div className="fixed inset-0 z-0 h-screen w-screen pointer-events-auto">
        <LegalScene />
      </div>
      
      {/* Enhanced Gradient Overlay for readability while keeping Orb visible */}
      {/* Darker on left (text side), transparent on right (orb side) */}
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-[#001514] via-[#001514]/60 to-transparent pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-[#001514]/20 to-[#001514] pointer-events-none" />

      {/* Navigation */}
      <LandingNavbar />

      <main className="relative z-10 flex flex-col">
        
        {/* HERO SECTION - Split Layout (Hockroll Style) */}
        <section className="relative min-h-screen pt-24 pb-12 flex items-center overflow-hidden">
            
            {/* Background Glow - Left Aligned for text separation */}
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
                         {/* Badge - Tighter spacing */}
                         <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-900/30 px-4 py-1.5 text-xs font-semibold tracking-wider text-teal-300 backdrop-blur-md border border-teal-500/20 shadow-lg cursor-default uppercase">
                            <Sparkles className="h-3 w-3 text-teal-200" />
                            <span>The Future of Legal Tech</span>
                        </motion.div>

                        {/* Headline - Better line braking with max-w */}
                        <motion.h1 variants={fadeInUp} className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl mb-6 leading-[1.1] drop-shadow-lg">
                            Your firm's <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-emerald-200">
                                single source of truth.
                            </span>
                        </motion.h1>
                        
                        <motion.p variants={fadeInUp} className="text-lg text-emerald-100/70 mb-8 leading-relaxed max-w-md font-light">
                            No more searching across scattered documents. Advyon gives you everything you need to manage your firm's compliance and workflows.
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

                    {/* RIGHT COLUMN: Floating Glass UI (The "Hockroll" Composition) */}
                    <div className="relative h-[600px] w-full hidden lg:block perspective-[1000px]">
                        
                        {/* Main Glass Card: Document List - Moved UP slightly for better balance */}
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

                        {/* Floating Widget 1: Expert Profile - Adjusted Position (Higher) */}
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

                         {/* Floating Widget 2: Stats - Adjusted Position (Closer) */}
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
        </section>

        {/* SECTION: PROBLEM / SOLUTION - Glass Panels */}
        <section className="py-32 relative z-10">
             <div className="container mx-auto px-6 lg:px-12">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">Why Modern Firms Switch</h2>
                    <p className="text-xl text-emerald-100/60 max-w-2xl mx-auto">Stop wrestling with outdated systems and start practicing law.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Problem Glass Card */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="group relative rounded-[2.5rem] bg-[#1a0505]/40 backdrop-blur-md border border-red-500/10 p-12 hover:bg-[#1a0505]/60 hover:border-red-500/30 transition-all duration-500"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center mb-8 shadow-inner shadow-red-500/10">
                            <XCircle className="h-8 w-8 text-red-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-red-50 mb-6">The Old Way</h3>
                        <ul className="space-y-6 text-red-100/70 text-lg">
                            <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <span>Scattered documents across email & local drives.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <span>Unbillable hours spent on administrative chaos.</span>
                            </li>
                             <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <span>Data security vulnerabilities & compliance risks.</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Solution Glass Card - Highly emphasized */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="group relative rounded-[2.5rem] bg-teal-950/40 backdrop-blur-xl border border-teal-500/30 p-12 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="relative z-10 h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-900/20 flex items-center justify-center mb-8 shadow-inner shadow-teal-500/20">
                            <CheckCircle2 className="h-8 w-8 text-teal-400" />
                        </div>
                        <h3 className="relative z-10 text-3xl font-bold text-white mb-6">The Advyon Edge</h3>
                         <ul className="relative z-10 space-y-6 text-teal-50/90 text-lg">
                            <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
                                <span>Unified Intelligent Platform for all workflows.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
                                <span>AI-driven automation reclaiming 20+ hours/week.</span>
                            </li>
                             <li className="flex items-start gap-4">
                                <span className="mt-2 h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
                                <span>Bank-grade encryption & automated compliance.</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
             </div>
        </section>

        {/* FEATURES GRID - Transparent to show depth */}
        <section className="py-32 relative">
             <div className="container mx-auto px-6 lg:px-12">
                 <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="mb-24 text-center"
                 >
                    <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-teal-200">
                        Built for the Future of Law
                    </h2>
                    <p className="text-xl text-emerald-100/60 max-w-3xl mx-auto">
                        Every tool you need, reimagined with intelligence at the core.
                    </p>
                 </motion.div>

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
                            <Card className="h-full bg-white/5 backdrop-blur-sm border-white/5 hover:bg-white/10 hover:border-teal-500/30 transition-all duration-300 group overflow-hidden rounded-3xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-900/20">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
                                        <feature.icon className="h-6 w-6 text-teal-400" />
                                    </div>
                                    <CardTitle className="text-xl font-bold text-teal-50 group-hover:text-white transition-colors">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-emerald-100/60 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                 </motion.div>
             </div>
        </section>

        {/* TESTIMONIALS - Left Aligned to balance Orb */}
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
                            "Advyon didn't just organize our files; it fundamentally changed how we practice law. The AI insights are scary good."
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
                    
                    {/* Floating Glass Stats - Right Side (Over Orb?) */}
                    {/* We make these extra transparent so the Orb can be seen drifting behind/around them */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 gap-6"
                    >
                        {[
                            { val: "20h+", label: "Saved Weekly", col: "text-teal-400" },
                            { val: "99%", label: "Satisfaction", col: "text-amber-400" },
                            { val: "0", label: "Breaches", col: "text-purple-400" },
                            { val: "3x", label: "Faster Billing", col: "text-blue-400" }
                        ].map((stat, i) => (
                             <motion.div 
                                key={i}
                                variants={fadeInUp}
                                className={`bg-black/20 backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:bg-black/40 transition-colors duration-300 ${i % 2 !== 0 ? 'mt-12' : ''}`}
                             >
                                <h3 className={`text-4xl font-bold ${stat.col} mb-2`}>{stat.val}</h3>
                                <p className="text-sm font-medium text-emerald-100/50 uppercase tracking-widest">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>

        {/* CTA SECTION - Full Width Glass */}
        <section className="relative py-32">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-teal-900 to-emerald-950 px-6 py-32 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-teal-500/20"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                    
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

                    <h2 className="relative z-10 text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                        Ready to elevate your practice?
                    </h2>
                    <p className="relative z-10 mx-auto max-w-2xl text-xl leading-8 text-emerald-100/80 mb-12">
                        Join the platform building the future of legal work. No credit card required.
                    </p>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
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
                </motion.div>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
