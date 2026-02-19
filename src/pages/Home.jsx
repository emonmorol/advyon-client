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

        {/* PROBLEM VS SOLUTION SECTION */}
        <section className="py-24 relative bg-[#001a18]">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why Modern Firms Switch</h2>
                    <p className="mt-4 text-lg text-emerald-100/60">Stop wrestling with outdated systems.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Problem */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-red-950/20 border border-red-900/30 rounded-3xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-6 text-red-400">
                            <XCircle className="h-6 w-6" />
                            <h3 className="text-xl font-bold">The Old Way</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Scattered emails and endless threads",
                                "Insecure file sharing via attachments",
                                "Manual billing and lost billable hours",
                                "Zero insights into firm performance"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-red-200/70">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/50 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    
                    {/* Solution */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-teal-950/40 border border-teal-500/30 rounded-3xl p-8 backdrop-blur-md shadow-lg shadow-teal-900/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="h-24 w-24" />
                        </div>
                        <div className="flex items-center gap-3 mb-6 text-teal-400">
                            <CheckCircle2 className="h-6 w-6" />
                            <h3 className="text-xl font-bold">The Advyon Way</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Unified dashboard for cases & clients",
                                "Bank-grade encrypted portal",
                                "Automated time tracking & invoicing",
                                "AI-driven analytics and drafting"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-teal-100">
                                    <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 relative overflow-hidden">
             {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#002220] to-[#001514] opacity-80" />
            
            <div className="container relative mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Your Path to Efficiency</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        {
                            icon: Globe,
                            title: "1. Connect",
                            desc: "Integrate your email, calendar, and existing case files in minutes."
                        },
                        {
                            icon: Zap,
                            title: "2. Automate",
                            desc: "Let AI handle document summaries, drafting, and scheduling."
                        },
                        {
                            icon: BarChart,
                            title: "3. Thrive",
                            desc: "Watch your billable hours and client satisfaction soar."
                        }
                    ].map((step, i) => (
                        <div key={i} className="relative group p-6">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:border-teal-500/50 group-hover:bg-teal-500/10 transition-all duration-300">
                                <step.icon className="h-8 w-8 text-teal-300" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-emerald-100/60">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-24 bg-[#001514]">
             <div className="container mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Loved by Lawyers</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            quote: "Advyon cut my administrative time by 50%. The AI summaries are a game changer.",
                            author: "Sarah J.",
                            role: "Family Law Attorney"
                        },
                        {
                            quote: "Finally, a legal platform that looks good and actually works. My clients love the portal.",
                            author: "Michael R.",
                            role: "Corporate Counsel"
                        },
                        {
                            quote: "The billing features alone paid for the subscription in the first month.",
                            author: "Elena V.",
                            role: "Solo Practitioner"
                        }
                    ].map((t, i) => (
                        <Card key={i} className="bg-white/5 border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <CardContent className="pt-6">
                                <div className="mb-4 text-teal-400">
                                    {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                                </div>
                                <p className="text-emerald-100/80 mb-6 italic">"{t.quote}"</p>
                                <div>
                                    <p className="font-bold text-white">{t.author}</p>
                                    <p className="text-xs text-emerald-100/50">{t.role}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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
