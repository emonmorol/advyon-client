import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, HelpCircle, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import VerificationForm from '@/features/auth/components/VerificationForm';
import StatusTimeline from '@/components/ui/StatusTimeline';

const LawyerVerificationPage = () => {
    const [status, setStatus] = useState('pending'); // pending, submitted, verified, rejected
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStatus('submitted');
        setIsSubmitting(false);
    };

    const timelineSteps = [
        {
            title: "Document Submission",
            description: "Upload your Bar Council ID and provide enrollment details.",
            date: status !== 'pending' ? "Just now" : "",
        },
        {
            title: "Manual Review",
            description: "Our legal team verifies your credentials with the State Bar Council.",
            date: "Est. 24-48 hrs",
        },
        {
            title: "Verification Complete",
            description: "You get full access to Advyon's lawyer features.",
            date: "",
        }
    ];

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 space-y-8">
            {/* Header */}
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                            <Shield className="w-8 h-8 text-primary" />
                            Lawyer Verification
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Verify your profile to unlock exclusive features and build trust with clients.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        Verification Pending
                    </div>
                </motion.div>

                <div className="space-y-8">
                    {/* Top Row: Details and Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Verification Details */}
                        <Card className="border-border shadow-lg h-full">
                            <CardHeader>
                                <CardTitle>Verification Details</CardTitle>
                                <CardDescription>
                                    Please provide your Bar Council details for verification.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {status === 'pending' ? (
                                    <VerificationForm onSubmit={handleSubmit} isLoading={isSubmitting} />
                                ) : (
                                    <div className="py-12 text-center space-y-4">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground">Submission Received!</h3>
                                        <p className="text-muted-foreground max-w-md mx-auto">
                                            Thank you for submitting your details. Our team is reviewing your documents. You will be notified once the verification is complete.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Right: Verification Status */}
                        <Card className="border-border shadow-sm h-full">
                            <CardHeader>
                                <CardTitle>Verification Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <StatusTimeline
                                    steps={timelineSteps}
                                    currentStep={status === 'pending' ? 0 : 1}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom Row: Help & FAQ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Why Verify */}
                        <Card className="bg-primary/5 border-primary/20 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <HelpCircle className="w-5 h-5" />
                                    Why Verify?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3 text-sm text-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                                        <span>Get a "Verified Lawyer" badge on your profile</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                                        <span>Access to premium case leads</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                                        <span>Enhanced visibility in search results</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* FAQ */}
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>How long does it take?</AccordionTrigger>
                                        <AccordionContent>
                                            Verification typically takes 24-48 hours. We verify your details with the respective State Bar Council.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>What documents are accepted?</AccordionTrigger>
                                        <AccordionContent>
                                            We accept a clear photo or scan of your Bar Council ID card. Provisional certificates are also accepted for new enrollments.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Is my data safe?</AccordionTrigger>
                                        <AccordionContent>
                                            Yes, your documents are encrypted and only accessible by our verification team.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LawyerVerificationPage;
