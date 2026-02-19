import LandingNavbar from '@/components/layout/LandingNavbar';
import Footer from '@/components/layout/Footer';
import LegalScene from '@/components/3d/LegalScene';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, Sparkles, Shield, Calendar, BarChart, Scale, FileText, 
  CheckCircle2, XCircle, Zap, Globe, MessageSquare 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#002220] text-white selection:bg-accent selection:text-white font-sans">
      
      {/* 3D Background - Fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LegalScene />
      </div>
      
      {/* Overlay Gradient for Text Readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-[#002220]/90 via-[#002220]/40 to-transparent pointer-events-none" />

      {/* Navigation */}
      <LandingNavbar />

      <main className="relative z-10 flex flex-col">
        
        {/* HERO SECTION - SPLIT SCREEN */}
        <section className="relative min-h-screen pt-20 flex items-center">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-2xl"
                    >
                        <motion.div variants={fadeIn} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium text-teal-300 backdrop-blur-md border border-white/10">
                            <Sparkles className="h-4 w-4" />
                            <span>The Future of Legal Tech is Here</span>
                        </motion.div>
                        
                        <motion.h1 variants={fadeIn} className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-7xl mb-6 leading-tight">
                            Order from <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                Chaos.
                            </span>
                        </motion.h1>
                        
                        <motion.p variants={fadeIn} className="text-lg text-emerald-100/80 sm:text-xl mb-8 leading-relaxed">
                            Advyon replaces scattered tools with a unified, intelligent platform. 
                            Automate workflows, secure client data, and leverage AI to drive your firm's growth.
                        </motion.p>
                        
                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                            <Link to="/auth/signup">
                                <Button size="lg" className="bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20 px-8 py-6 text-lg font-bold w-full sm:w-auto">
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Link to="/features">
                                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto">
                                    How it Works
                                </Button>
                            </Link>
                        </motion.div>
                        
                        <motion.div variants={fadeIn} className="mt-12 flex items-center gap-4 text-sm text-emerald-100/60">
                            <div className="flex -space-x-2">
                                {[1,2,3,4].map((i) => (
                                    <div key={i} className="h-8 w-8 rounded-full bg-white/10 border border-[#002220]" />
                                ))}
                            </div>
                            <p>Trusted by 500+ forward-thinking attorneys</p>
                        </motion.div>
                    </motion.div>
                    
                    {/* Right: Empty for 3D Object visibility */}
                    <div className="hidden lg:block h-full min-h-[600px]">
                        {/* The 3D object sits here visually */}
                    </div>
                </div>
            </div>
        </section>

        {/* PROBLEM / SOLUTION SECTION */}
        <section className="py-24 relative">
             <div className="container mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why Modern Firms Switch</h2>
                    <p className="mt-4 text-lg text-emerald-100/60">Stop wrestling with outdated systems.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Problem */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="rounded-3xl bg-[#1a0505]/60 backdrop-blur-xl border border-red-500/10 p-10 hover:border-red-500/30 transition-all duration-300"
                    >
                        <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                            <XCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-red-100 mb-4">The Manual Trap</h3>
                        <ul className="space-y-4 text-red-100/70">
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/50" />
                                <span>Scattered documents across email & local drives.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/50" />
                                <span>Unbillable hours spent on administrative chaos.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/50" />
                                <span>Data security vulnerabilities & compliance risks.</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Solution */}
                     <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="rounded-3xl bg-[#002220]/60 backdrop-blur-xl border border-teal-500/20 p-10 hover:border-teal-500/40 transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="h-12 w-12 rounded-full bg-teal-500/10 flex items-center justify-center mb-6 relative">
                            <CheckCircle2 className="h-6 w-6 text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-teal-50 mb-4 relative">The Advyon Edge</h3>
                         <ul className="space-y-4 text-teal-100/80 relative">
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-400" />
                                <span>Unified Intelligent Platform for all workflows.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-400" />
                                <span>AI-driven automation reclaiming 20+ hours/week.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-400" />
                                <span>Bank-grade encryption & automated compliance.</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
             </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 relative">
             <div className="container mx-auto px-6 lg:px-8">
                 <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white">
                        Built for the Future of Law
                    </h2>
                    <p className="text-emerald-100/60 max-w-2xl mx-auto">
                        Every tool you need, reimagined with intelligence at the core.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Shield, title: "Smart Security", desc: "Enterprise-grade encryption with AI threat detection." },
                        { icon: Zap, title: "Instant Analysis", desc: "Upload contracts and get AI summaries in seconds." },
                        { icon: Globe, title: "Global Access", desc: "Secure cloud infrastructure accessible from anywhere." },
                        { icon: Calendar, title: "Auto-Scheduling", desc: "AI coordinates meetings with clients automatically." },
                        { icon: MessageSquare, title: "Client Portal", desc: "Secure communication channel for seamless updates." },
                        { icon: Scale, title: "Case Intelligence", desc: "Predictive analytics for better case outcomes." }
                    ].map((feature, i) => (
                        <Card key={i} className="bg-[#002220]/40 backdrop-blur-md border-white/5 hover:bg-[#002220]/60 hover:border-teal-500/30 transition-all duration-300 group overflow-hidden">
                            <CardHeader>
                                <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="h-5 w-5 text-teal-400" />
                                </div>
                                <CardTitle className="text-teal-50 group-hover:text-white transition-colors">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-emerald-100/60 text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
             </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 relative">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-6">Trusted by Top Firms</h2>
                        <p className="text-emerald-100/70 text-lg mb-8">
                            "Advyon didn't just organize our files; it fundamentally changed how we practice law. The AI insights are scary good."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                            <div>
                                <h4 className="font-bold text-white">Sarah Jenkins</h4>
                                <p className="text-sm text-emerald-100/50">Partner, Jenkins & Co.</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Floating Glass Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#002220]/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-3xl font-bold text-teal-400 mb-1">20h+</h3>
                            <p className="text-sm text-emerald-100/60">Saved Weekly</p>
                        </div>
                        <div className="bg-[#002220]/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mt-8">
                            <h3 className="text-3xl font-bold text-amber-400 mb-1">99%</h3>
                            <p className="text-sm text-emerald-100/60">Client Satisfaction</p>
                        </div>
                         <div className="bg-[#002220]/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-3xl font-bold text-purple-400 mb-1">0</h3>
                            <p className="text-sm text-emerald-100/60">Data Breaches</p>
                        </div>
                         <div className="bg-[#002220]/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mt-8">
                            <h3 className="text-3xl font-bold text-blue-400 mb-1">3x</h3>
                            <p className="text-sm text-emerald-100/60">Faster Billings</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative py-24">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 to-emerald-900 px-6 py-24 text-center shadow-2xl sm:px-16">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <h2 className="relative z-10 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Ready to elevate your practice?
                    </h2>
                    <p className="relative z-10 mx-auto mt-6 max-w-xl text-lg leading-8 text-emerald-100">
                        Join the platform building the future of legal work.
                    </p>
                    <div className="relative z-10 mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/auth/signup">
                            <Button size="lg" className="bg-white text-teal-900 hover:bg-gray-100 font-bold px-8 py-6 text-lg">
                                Get Started Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
