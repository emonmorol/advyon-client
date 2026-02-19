import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Users, 
    Briefcase, 
    FileText, 
    TrendingUp, 
    Activity, 
    Scale,
    Calendar,
    PieChart as PieChartIcon,
    BarChart3,
    LineChart as LineChartIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useAnalyticsStore } from "@/store/useAnalyticsStore";
import { Loader2 } from "lucide-react";
import { 
    PieChart, 
    Pie, 
    Cell, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    LineChart,
    Line,
    Legend
} from 'recharts';

// Chart color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatCard = ({ title, value, description, icon: Icon, trend, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color === 'blue' ? 'text-blue-500' : color === 'green' ? 'text-green-500' : color === 'red' ? 'text-red-500' : color === 'purple' ? 'text-purple-500' : 'text-amber-500'}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {trend && <span className="text-green-500 font-medium mr-1">{trend}</span>}
                    {description}
                </p>
                <div className="mt-3 h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                        className={`h-full ${color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : color === 'red' ? 'bg-red-500' : color === 'purple' ? 'bg-purple-500' : 'bg-amber-500'}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 1, delay: delay + 0.2 }}
                    />
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

// Custom Pie Chart Component
const CaseDistributionChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No distribution data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="percentage"
                    nameKey="area"
                    label={({ area, percentage }) => `${area}: ${percentage}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                    }}
                    formatter={(value, name) => [`${value}%`, name]}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

// Cases Over Time Line Chart
const CasesTrendChart = ({ data }) => {
    // Mock data for trend - in production this would come from API
    const trendData = data?.length > 0 ? data : [
        { month: 'Jan', cases: 12 },
        { month: 'Feb', cases: 19 },
        { month: 'Mar', cases: 15 },
        { month: 'Apr', cases: 22 },
        { month: 'May', cases: 18 },
        { month: 'Jun', cases: 25 }
    ];

    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                    }}
                />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#0088FE" 
                    strokeWidth={2}
                    dot={{ fill: '#0088FE', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Cases"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

// Cases by Status Bar Chart
const CasesStatusChart = ({ data }) => {
    // Mock data for status - in production this would come from API
    const statusData = data?.length > 0 ? data : [
        { status: 'Active', count: 45 },
        { status: 'Pending', count: 12 },
        { status: 'Review', count: 8 },
        { status: 'Closed', count: 35 },
        { status: 'Archived', count: 20 }
    ];

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="status" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                    }}
                />
                <Bar dataKey="count" fill="#0088FE" radius={[4, 4, 0, 0]} name="Cases" />
            </BarChart>
        </ResponsiveContainer>
    );
};

// Revenue Chart
const RevenueChart = ({ data }) => {
    // Mock data - in production this would come from API
    const revenueData = data?.length > 0 ? data : [
        { month: 'Jan', revenue: 4500 },
        { month: 'Feb', revenue: 5200 },
        { month: 'Mar', revenue: 4800 },
        { month: 'Apr', revenue: 6100 },
        { month: 'May', revenue: 5500 },
        { month: 'Jun', revenue: 6700 }
    ];

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                    }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#00C49F" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const AnalyticsPage = () => {
    const { 
        stats: apiStats, 
        caseDistribution, 
        upcomingDeadlines, 
        fetchAnalytics, 
        isLoading 
    } = useAnalyticsStore();

    const [activeTab, setActiveTab] = useState('overview');

    React.useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (isLoading && !apiStats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    // Default stats if API fails or empty
    const stats = [
        { 
            title: "Active Cases", 
            value: apiStats?.activeCases || "0", 
            description: "Total active", 
            icon: Briefcase, 
            trend: "+0", 
            color: "blue", 
            delay: 0.1 
        },
        { 
            title: "Total Clients", 
            value: apiStats?.totalClients || "0", 
            description: "Registered clients", 
            icon: Users, 
            trend: "+0%", 
            color: "green", 
            delay: 0.2 
        },
        { 
            title: "Filings Due", 
            value: apiStats?.filingsDue || "0", 
            description: "Next 7 days", 
            icon: FileText, 
            trend: "0", 
            color: "red", 
            delay: 0.3 
        },
        { 
            title: "Billable Hours", 
            value: apiStats?.billableHours || "0", 
            description: "This month", 
            icon: Activity, 
            trend: "+0%", 
            color: "purple", 
            delay: 0.4 
        },
    ];

    const distributionData = caseDistribution?.length > 0 ? caseDistribution : [
        { area: 'Civil Law', percentage: 35 },
        { area: 'Criminal Law', percentage: 25 },
        { area: 'Family Law', percentage: 20 },
        { area: 'Corporate', percentage: 15 },
        { area: 'Other', percentage: 5 }
    ];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: PieChartIcon },
        { id: 'cases', label: 'Cases', icon: BarChart3 },
        { id: 'revenue', label: 'Revenue', icon: LineChartIcon }
    ];

    return (
        <div className="p-8 space-y-8 min-h-screen bg-background/50">
             <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Overview of your practice performance and key metrics.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === tab.id 
                                ? 'bg-primary text-primary-foreground' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <motion.div 
                        className="col-span-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Case Distribution by Area</CardTitle>
                                <CardDescription>Active cases by practice area</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CaseDistributionChart data={distributionData} />
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
                                    {upcomingDeadlines?.length > 0 ? (
                                        upcomingDeadlines.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                                <div>
                                                    <p className="text-sm font-medium">{item.task}</p>
                                                    <p className="text-xs text-muted-foreground">{item.case}</p>
                                                </div>
                                            </div>
                                            <div className="text-xs font-semibold bg-background px-2 py-1 rounded border">
                                                {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-muted-foreground">
                                            No upcoming deadlines
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            )}

            {/* Cases Tab */}
            {activeTab === 'cases' && (
                <div className="grid gap-4 md:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Cases Over Time</CardTitle>
                                <CardDescription>Monthly case trends</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CasesTrendChart data={caseDistribution} />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Cases by Status</CardTitle>
                                <CardDescription>Current case status distribution</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CasesStatusChart data={caseDistribution} />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            )}

            {/* Revenue Tab */}
            {activeTab === 'revenue' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Overview</CardTitle>
                            <CardDescription>Monthly revenue trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RevenueChart data={[]} />
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default AnalyticsPage;
