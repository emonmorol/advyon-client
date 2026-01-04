import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  FileText,
  Plus,
  Upload,
  MessageSquare,
  Gavel,
  Sparkles,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../services/auth/authService";
import { useCases } from "../services/cases/caseService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: userData } = useCurrentUser();
  const { data: casesData } = useCases({ limit: 100 }); // Fetch enough to calculate basic stats

  const user = userData?.data?.user;
  const profile = userData?.data?.profile;
  const allCases = casesData?.data || [];

  // --- Computed Stats ---
  const activeCasesCount = allCases.filter(c => c.status === 'active').length;

  // Upcoming Hearings (Next 7 days)
  const upcomingHearingsCount = allCases.filter(c => {
    if (!c.nextDeadline) return false;
    const deadline = new Date(c.nextDeadline);
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    return deadline >= now && deadline <= sevenDaysFromNow;
  }).length;

  // Pending Review (arbitrary logic: status 'review' or 'pending')
  const pendingReviewCount = allCases.filter(c => ['review', 'pending'].includes(c.status?.toLowerCase())).length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const cardStyle = "border-border/40 bg-card backdrop-blur-sm shadow-xl transition-all hover:border-accent/40 hover:shadow-2xl bg-background";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 bg-background p-8 min-h-screen text-foreground"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-bold tracking-tight text-black">Overview</h2>
            <Link to="/dashboard/community">
              <Button variant="outline" size="sm" className="h-8 shadow-sm hover:bg-accent/10 hover:text-accent border-accent/20">
                <Users className="mr-2 h-4 w-4" />
                Community Hub
              </Button>
            </Link>
          </div>
          <p className="text-gray-600 mt-1">
            Welcome back, {profile?.fullName || user?.fullName || 'Advocate'}. You have <span className="text-accent font-semibold">{allCases.filter(c => c.urgency === 'high').length} urgent tasks</span> today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={() => navigate('/dashboard/cases/new')}
            className="bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 hover:scale-105 transition-all"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Case
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Active Cases", value: activeCasesCount, sub: "Total active", icon: Briefcase, color: "text-blue-400" },
          { title: "Upcoming Hearings", value: upcomingHearingsCount, sub: "Next 7 days", icon: Gavel, color: "text-amber-400" },
          { title: "Pending Review", value: pendingReviewCount, sub: "Documents & Evidence", icon: FileText, color: "text-red-400" },
          { title: "Client Messages", value: "08", sub: "3 new inquiries", icon: MessageSquare, color: "text-emerald-400" } // Static for now
        ].map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className={cardStyle}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.sub}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Column */}
        <motion.div variants={item} className="space-y-8 lg:col-span-2">

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Add Client", icon: UserPlus, color: "bg-blue-500/10 text-blue-400" },
              { label: "Upload File", icon: Upload, color: "bg-purple-500/10 text-purple-400" },
              { label: "Court Date", icon: Calendar, color: "bg-amber-500/10 text-amber-400" },
              { label: "AI Analysis", icon: Sparkles, color: "bg-emerald-500/10 text-emerald-400" },
            ].map((action, i) => (
              <button key={i} className={`flex flex-col items-center justify-center gap-3 rounded-xl ${cardStyle} p-6 transition-transform hover:-translate-y-1`}>
                <div className={`rounded-full p-3 ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-card-foreground">{action.label}</span>
              </button>
            ))}
          </div>

          {/* AI Insights Panel */}
          <Card className={`${cardStyle} border-accent/20 bg-teal-accent`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-foreground">
                <Sparkles className="h-5 w-5 text-accent" />
                Advyon AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-background p-4 text-sm text-background-foreground border border-accent/20 shadow-sm">
                <span className="mb-2 block font-semibold text-accent">Analysis Complete: State v. Johnson</span>
                The evidence analysis identified 3 missing timestamps in the witness testimony. Recommendation: Request supplementary statement.
              </div>
              <div className="rounded-lg bg-background p-4 text-sm text-background-foreground border border-accent/20 shadow-sm ">
                <span className="mb-2 block font-semibold text-accent">Legal Update Alert</span>
                New Supreme Court ruling on "Digital Privacy" may impact your current case <span className="text-white underline decoration-accent/50 underline-offset-4">TechCorp v. StartUp</span>.
              </div>
            </CardContent>
          </Card>

          {/* Recent Cases Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Recent Matters</h3>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {allCases.slice(0, 5).map((c, i) => (
                <Card key={c._id || c.id || i} className={`${cardStyle} group cursor-pointer border-l-4 border-l-transparent hover:border-l-accent`}>
                  <CardContent className="flex items-center justify-between p-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary p-2 text-muted-foreground group-hover:text-primary-foreground">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-card-foreground group-hover:text-accent">{c.title}</h4>
                        <p className="text-xs text-muted-foreground">{c.caseType} • {c.nextDeadline ? new Date(c.nextDeadline).toLocaleDateString() : 'No Deadline'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden w-24 md:block">
                        <div className="h-1.5 w-full rounded-full bg-primary">
                          <div className="h-1.5 rounded-full bg-accent transition-all duration-1000" style={{ width: `${c.progress || 0}%` }} />
                        </div>
                        <p className="mt-1 text-right text-[10px] text-muted-foreground">{c.progress || 0}%</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${c.status === 'Active' ? 'bg-teal-accent/10 text-teal-bright' : 'bg-muted text-muted-foreground'}`}>
                        {c.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {allCases.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                  No recent cases found.
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={item} className="space-y-8">

          {/* Today's Schedule (Static - No API yet) */}
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="text-card-foreground">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { time: "09:00 AM", event: "Team Standup", type: "Internal" },
                { time: "11:30 AM", event: "Court Hearing: Johnson", type: "Court", urgent: true },
                { time: "02:00 PM", event: "Client Call: TechCorp", type: "Client" },
                { time: "04:30 PM", event: "Review Evidence", type: "Work" },
              ].map((ev, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-16 text-sm font-medium text-muted-foreground">{ev.time}</span>
                  <div className="relative flex-1 border-l-2 border-surface pl-4 pb-2 last:pb-0">
                    <div className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${ev.urgent ? 'bg-red-400 animate-pulse' : 'bg-accent'}`} />
                    <p className="text-sm font-medium text-card-foreground">{ev.event}</p>
                    <p className="text-xs text-muted-foreground">{ev.type}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Client Requests (Static - No API yet) */}
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-card-foreground">
                <span>Client Requests</span>
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">2 New</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Sarah Connor", msg: "Requesting access to case files", time: "10m ago" },
                { name: "John Doe", msg: "Uploaded new evidence photos", time: "1h ago" },
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-background border border-accent/20 shadow-sm p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-background-foreground font-bold">
                    {req.name[0]}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-background-foreground">{req.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{req.msg}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-primary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-primary">
                View All Requests
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity (Static - No API yet) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-background-foreground">Activity Feed</h3>
            <div className="space-y-4 rounded-xl bg-primary/10 p-4">
              {[
                { text: "System updated auto-backups", time: "Just now", icon: SettingsIcon },
                { text: "Adv. Michael closed Case #892", time: "2h ago", icon: Briefcase },
                { text: "New billing cycle started", time: "1d ago", icon: TrendingUp },
              ].map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-teal-accent" />
                  <div>
                    <p className="text-xs text-background-foreground">{act.text}</p>
                    <p className="text-[10px] text-background-foreground">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
}

const SettingsIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export default Dashboard;
