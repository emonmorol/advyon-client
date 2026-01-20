import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Users, 
    Briefcase, 
    FileText, 
    TrendingUp, 
    Activity, 
    Scale,
    Calendar
} from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, description, icon: Icon, trend, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 text-${color}-500`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {trend && <span className="text-green-500 font-medium mr-1">{trend}</span>}
                    {description}
                </p>
                <div className="mt-3 h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                        className={`h-full bg-${color}-500`}
                        initial={{ width: "0%" }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 1, delay: delay + 0.2 }}
                    />
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const AnalyticsPage = () => {
    // Mock Data (In real app, fetch from backend)
    const stats = [
        { title: "Active Cases", value: "24", description: "Standard load", icon: Briefcase, trend: "+2", color: "blue", delay: 0.1 },
        { title: "Total Clients", value: "145", description: "Steady growth", icon: Users, trend: "+4%", color: "green", delay: 0.2 },
        { title: "Filings Due", value: "7", description: "Within 7 days", icon: FileText, trend: "-2", color: "red", delay: 0.3 },
        { title: "Billable Hours", value: "128.5", description: "This month", icon: Activity, trend: "+12%", color: "purple", delay: 0.4 },
    ];

    return (
        <div className="p-8 space-y-8 min-h-screen bg-background/50">
             <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Overview of your practice performance and key metrics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <motion.div 
                    className="col-span-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Case Distribution</CardTitle>
                            <CardDescription>Active cases by practice area</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                               {['Corporate Litigation', 'Family Law', 'Intellectual Property', 'Real Estate'].map((area, i) => (
                                   <div key={i} className="space-y-1">
                                       <div className="flex justify-between text-sm">
                                           <span className="font-medium">{area}</span>
                                           <span className="text-muted-foreground">{[45, 25, 20, 10][i]}%</span>
                                       </div>
                                       <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                           <motion.div 
                                               className="h-full bg-primary"
                                               initial={{ width: "0%" }}
                                               animate={{ width: `${[45, 25, 20, 10][i]}%` }}
                                               transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                                           />
                                       </div>
                                   </div>
                               ))}
                           </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div 
                    className="col-span-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="h-full">
                         <CardHeader>
                            <CardTitle>Upcoming Deadlines</CardTitle>
                            <CardDescription>High priority tasks</CardDescription>
                         </CardHeader>
                         <CardContent>
                            <div className="space-y-4">
                                {[
                                    { case: 'Smith v. Jones', task: 'Submit Affidavit', date: 'Oct 24', color: 'red' },
                                    { case: 'TechCorp Merger', task: 'Review Contract', date: 'Oct 25', color: 'orange' },
                                    { case: 'Estate Plan', task: 'Client Meeting', date: 'Oct 26', color: 'blue' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-2 w-2 rounded-full bg-${item.color}-500`} />
                                            <div>
                                                <p className="text-sm font-medium">{item.task}</p>
                                                <p className="text-xs text-muted-foreground">{item.case}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs font-semibold bg-background px-2 py-1 rounded border">
                                            {item.date}
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
