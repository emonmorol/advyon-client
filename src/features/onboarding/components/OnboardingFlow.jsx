import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/auth/auth.service';
import {
    Scale,
    CheckCircle2,
    Globe,
    User,
    AtSign,
    Briefcase,
    Award,
    Building,
    Calendar,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepInput from './StepInput';
import SelectInput from './SelectInput';
import { FloatingParticles, MouseSpotlight } from './VisualEffects';
import RippleBackground from '@/components/ui/RippleBackground';

// ✅ import your zustand store
import { useOnboardingStore } from '@/store/onboarding';
import { onboardingSchema, validateForm } from '@/lib/validation/authSchemas';

export default function OnboardingFlow() {
    const {
        role,
        profile,
        step,
        setStep,
        setRole,
        updateProfile,
        resetOnboarding,
    } = useOnboardingStore();

    const navigate = useNavigate();
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for back
    const [loading, setLoading] = useState(false);

    const isLawyer = role === 'lawyer';
    const totalSteps = isLawyer ? 5 : 4;

    // WBS-SM-MVP-02: Zod-backed per-step validation
    const isStepValid = () => {
        if (step === 2) {
            const result = onboardingSchema.safeParse({
                role: role || 'client',
                profile: { fullName: profile.fullName || '' },
            });
            // Check if fullName specifically has errors
            if (!result.success) {
                const nameError = result.error.issues.find(i => i.path.includes('fullName'));
                if (nameError) return false;
            }
            return (profile.fullName || '').trim().length >= 2;
        }
        if (step === 3 && !(profile.displayName || '').trim()) return false;
        return true;
    };

    const nextStep = () => {
        if (!isStepValid()) return;

        // Step 4: Role selection
        if (step === 4) {
            // If user didn't choose lawyer, treat as client and finish
            if (!isLawyer) {
                finishOnboarding('client');
                return;
            }
        }

        // Step 5: Lawyer credentials
        if (step === 5) {
            finishOnboarding('lawyer');
            return;
        }

        setDirection(1);
        setStep(step + 1);
    };

    const skipStep = () => {
        // "Skip all steps" -> Default to Client/User
        finishOnboarding('client');
    };

    const finishOnboarding = async (finalRole) => {
        setLoading(true);

        try {
            // ✅ Build payload matching backend onboardValidation
            const payload = {
                role: finalRole, // 'client' | 'lawyer'
                profile: {
                    fullName: profile.fullName,
                    displayName: profile.displayName,
                    phone: profile.phone || undefined,
                    avatarUrl: profile.avatarUrl || undefined,
                    preferredLanguage: profile.preferredLanguage || 'English',
                    timezone: profile.timezone || undefined,
                    address: profile.address || undefined,

                    // Only send lawyer fields if lawyer
                    barRegistrationNumber:
                        finalRole === 'lawyer' ? profile.barRegistrationNumber || undefined : undefined,
                    barCouncilName:
                        finalRole === 'lawyer' ? profile.barCouncilName || undefined : undefined,
                    yearsOfExperience:
                        finalRole === 'lawyer'
                            ? Number(profile.yearsOfExperience || 0) // Ensure number
                            : undefined,
                    primaryPracticeArea:
                        finalRole === 'lawyer' ? profile.primaryPracticeArea || 'Corporate Law' : undefined,
                },
            };

            // WBS-SM-MVP-02: Validate full payload with Zod before API call
            const { success, errors } = validateForm(onboardingSchema, payload);
            if (!success) {
                const firstError = Object.values(errors)[0];
                toast.error('Validation Error', { description: firstError || 'Please fix the highlighted fields.' });
                setLoading(false);
                return;
            }

            // Call API
            await authService.onboardUser(payload);

            toast.success("Profile Setup Complete!", {
                description: finalRole === 'lawyer' ? "Welcome, Counselor." : "Welcome to Advyon."
            });

            // Delay slightly for UX then redirect
            setTimeout(() => {
                resetOnboarding();
                navigate(finalRole === 'lawyer' ? '/dashboard/workspace' : '/dashboard');
            }, 1000);

        } catch (error) {
            console.error("Onboarding failed:", error);
            toast.error("Setup Failed", {
                description: error.response?.data?.message || "Please check your details and try again."
            });
            setLoading(false);
        }
    };

    // Animation Variants
    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen w-full flex flex-col font-sans relative selection:bg-[#3A7573]/30 selection:text-white overflow-hidden">

            {/* Background */}
            <RippleBackground />
            <FloatingParticles />
            <MouseSpotlight />

            {/* Header */}
            <header className="relative z-20 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3C726F] to-[#1C4645] flex items-center justify-center shadow-lg shadow-black/20 border border-white/10">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">ADVYON</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-20">
                <div className="w-full max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
                    >
                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-slate-100">
                            <motion.div
                                className="h-full bg-[#3A7573]"
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / totalSteps) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        <div className="p-8 md:p-10 min-h-[420px] flex flex-col">

                            <AnimatePresence mode="wait" custom={direction}>
                                {/* STEP 1: Language */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        className="flex-1 flex flex-col space-y-6"
                                    >
                                        <div className="space-y-2 text-center">
                                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-[#3A7573] mb-4">
                                                <Globe size={32} />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-800">Preferred Language</h2>
                                            <p className="text-slate-500">Choose your primary language for the workspace.</p>
                                        </div>

                                        <SelectInput
                                            icon={Globe}
                                            label="Language"
                                            value={profile.preferredLanguage || 'English'}
                                            onChange={(val) => updateProfile({ preferredLanguage: val })}
                                            options={[
                                                { value: 'English', label: 'English (US)' },
                                                { value: 'Spanish', label: 'Spanish' },
                                                { value: 'French', label: 'French' },
                                                { value: 'German', label: 'German' },
                                                { value: 'Hindi', label: 'Hindi' },
                                            ]}
                                        />
                                    </motion.div>
                                )}

                                {/* STEP 2: Full Name */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        className="flex-1 flex flex-col space-y-6"
                                    >
                                        <div className="space-y-2 text-center">
                                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-[#3A7573] mb-4">
                                                <User size={32} />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-800">What's your name?</h2>
                                            <p className="text-slate-500">This will be displayed on your profile.</p>
                                        </div>

                                        <StepInput
                                            icon={User}
                                            label="Full Name"
                                            placeholder="e.g. John Doe"
                                            value={profile.fullName}
                                            onChange={(val) => updateProfile({ fullName: val })}
                                        />
                                    </motion.div>
                                )}

                                {/* STEP 3: Username */}
                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        className="flex-1 flex flex-col space-y-6"
                                    >
                                        <div className="space-y-2 text-center">
                                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-[#3A7573] mb-4">
                                                <AtSign size={32} />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-800">Pick a username</h2>
                                            <p className="text-slate-500">Your unique handle on Advyon.</p>
                                        </div>

                                        <StepInput
                                            icon={AtSign}
                                            label="Username"
                                            placeholder="e.g. johnd_law"
                                            value={profile.displayName}
                                            onChange={(val) => updateProfile({ displayName: val })}
                                        />
                                    </motion.div>
                                )}

                                {/* STEP 4: Role Selection */}
                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        className="flex-1 flex flex-col space-y-6"
                                    >
                                        <div className="space-y-2 text-center">
                                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-[#3A7573] mb-4">
                                                <Briefcase size={32} />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-800">Professional Status</h2>
                                            <p className="text-slate-500">Are you practicing law?</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Option 1: Client/User */}
                                            <div
                                                onClick={() => setRole('client')}
                                                className={`
                            flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-300
                            ${!isLawyer
                                                        ? 'border-[#3A7573] bg-teal-50 shadow-md ring-1 ring-[#3A7573]'
                                                        : 'border-slate-200 hover:border-[#3A7573]/50 hover:bg-slate-50'
                                                    }
                          `}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                                ${!isLawyer
                                                                ? 'bg-[#3A7573] text-white'
                                                                : 'bg-slate-200 text-slate-500'
                                                            }
                              `}
                                                    >
                                                        <User size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-slate-800">I need Legal Help</p>
                                                        <p className="text-xs text-slate-500">I want to find lawyers & manage cases</p>
                                                    </div>
                                                </div>
                                                {!isLawyer && (
                                                    <CheckCircle2 size={24} className="text-[#3A7573]" />
                                                )}
                                            </div>

                                            {/* Option 2: Lawyer */}
                                            <div
                                                onClick={() => setRole('lawyer')}
                                                className={`
                            flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-300
                            ${isLawyer
                                                        ? 'border-[#3A7573] bg-teal-50 shadow-md ring-1 ring-[#3A7573]'
                                                        : 'border-slate-200 hover:border-[#3A7573]/50 hover:bg-slate-50'
                                                    }
                          `}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                                ${isLawyer
                                                                ? 'bg-[#3A7573] text-white'
                                                                : 'bg-slate-200 text-slate-500'
                                                            }
                              `}
                                                    >
                                                        <Scale size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-slate-800">I am a Lawyer</p>
                                                        <p className="text-xs text-slate-500">I want to manage clients & practice</p>
                                                    </div>
                                                </div>
                                                {isLawyer && (
                                                    <CheckCircle2 size={24} className="text-[#3A7573]" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 5: Lawyer Credentials (Conditional) */}
                                {step === 5 && (
                                    <motion.div
                                        key="step5"
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1 custom-scrollbar"
                                    >
                                        <div className="text-center mb-2">
                                            <h2 className="text-xl font-bold text-slate-800">Lawyer Credentials</h2>
                                            <p className="text-xs text-slate-500">We need this to verify your profile.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <StepInput
                                                icon={Award}
                                                label="Bar Registration No."
                                                placeholder="BC/XXXX/YYYY"
                                                value={profile.barRegistrationNumber}
                                                onChange={(val) =>
                                                    updateProfile({ barRegistrationNumber: val })
                                                }
                                            />
                                            <StepInput
                                                icon={Calendar}
                                                label="Years of Experience"
                                                type="number"
                                                placeholder="e.g. 5"
                                                value={profile.yearsOfExperience || ''}
                                                onChange={(val) =>
                                                    updateProfile({
                                                        yearsOfExperience: Number(val || 0),
                                                    })
                                                }
                                            />
                                        </div>

                                        <StepInput
                                            icon={Building}
                                            label="Bar Council Name"
                                            placeholder="e.g. Bar Council of Delhi"
                                            value={profile.barCouncilName}
                                            onChange={(val) =>
                                                updateProfile({ barCouncilName: val })
                                            }
                                        />

                                        <SelectInput
                                            icon={Briefcase}
                                            label="Primary Practice Area"
                                            value={profile.primaryPracticeArea || 'Corporate Law'}
                                            onChange={(val) =>
                                                updateProfile({ primaryPracticeArea: val })
                                            }
                                            options={[
                                                { value: 'Corporate Law', label: 'Corporate Law' },
                                                { value: 'Criminal Law', label: 'Criminal Law' },
                                                { value: 'Family Law', label: 'Family Law' },
                                                { value: 'Intellectual Property', label: 'Intellectual Property' },
                                                { value: 'Civil Litigation', label: 'Civil Litigation' },
                                            ]}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Footer */}
                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                <button
                                    onClick={skipStep}
                                    className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors px-2 py-1"
                                >
                                    Skip All
                                </button>

                                <motion.button
                                    onClick={nextStep}
                                    disabled={loading || !isStepValid()}
                                    whileHover={
                                        !isStepValid()
                                            ? {}
                                            : {
                                                scale: 1.02,
                                                boxShadow:
                                                    '0 10px 15px -3px rgba(58, 117, 115, 0.2)',
                                            }
                                    }
                                    whileTap={!isStepValid() ? {} : { scale: 0.98 }}
                                    className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md
                    ${!isStepValid()
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                            : 'bg-[#1C4645] hover:bg-[#153837] text-white shadow-teal-900/10'
                                        }
                  `}
                                >
                                    {loading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            {step === totalSteps || (step === 4 && !isLawyer)
                                                ? 'Finish'
                                                : 'Continue'}
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer Decoration */}
            <div className="absolute bottom-4 right-8 z-10 hidden lg:block">
                <p className="text-[#B0C4C3]/60 text-xs">© 2025 Advyon Inc.</p>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
        </div>
    );
}
