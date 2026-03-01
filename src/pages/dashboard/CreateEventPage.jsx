import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Gavel, 
  FileText, 
  Users, 
  AlertCircle, 
  ArrowLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCasesStore } from '@/store/cases';
import api from '@/lib/api/api';
import { getCaseSharedUsers } from '@/services/caseAccess/caseAccessService';

const eventTypeConfig = {
  hearing: { icon: Gavel, label: 'Court Hearing', color: 'text-amber-500' },
  meeting: { icon: Users, label: 'Client Meeting', color: 'text-blue-500' },
  filing: { icon: FileText, label: 'Filing Deadline', color: 'text-purple-500' },
  deadline: { icon: AlertCircle, label: 'Task Deadline', color: 'text-red-500' },
  other: { icon: CalendarIcon, label: 'Other Event', color: 'text-gray-500' }
};

const CreateEventPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const typeParam = searchParams.get('type');
    const dateParam = searchParams.get('date');
    
    // Store
    const { cases, fetchCases } = useCasesStore();
    
    // Local State
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventType: typeParam || 'hearing',
        date: dateParam ? new Date(dateParam) : new Date(),
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        caseId: '',
        participants: []
    });

    useEffect(() => {
        if (cases.length === 0) fetchCases();
    }, [cases.length, fetchCases]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCaseSelect = async (val) => {
        const selectedCase = cases.find(c => (c.id === val || c._id === val));
        let newParticipants = [...formData.participants];

        if (selectedCase) {
            // Add lawyer (creator)
            if (selectedCase.createdBy) {
                const lawyerId = selectedCase.createdBy._id || selectedCase.createdBy.id || selectedCase.createdBy;
                if (lawyerId && !newParticipants.includes(lawyerId.toString())) {
                    newParticipants.push(lawyerId.toString());
                }
            }
            // Add primary client
            if (selectedCase.clientId) {
                const clientId = selectedCase.clientId._id || selectedCase.clientId.id || selectedCase.clientId;
                if (clientId && !newParticipants.includes(clientId.toString())) {
                    newParticipants.push(clientId.toString());
                }
            }
            
            // Add all other stakeholders (shared access users)
            try {
                const sharedUsers = await getCaseSharedUsers(val);
                if (sharedUsers && Array.isArray(sharedUsers)) {
                    sharedUsers.forEach(user => {
                        const id = user.userId?._id || user.userId?.id || user.userId || user.id || user._id;
                        if (id && !newParticipants.includes(id.toString())) {
                            newParticipants.push(id.toString());
                        }
                    });
                }
            } catch (err) {
                console.error("Failed to fetch shared users for case:", err);
            }
        }
        
        setFormData(prev => ({ 
            ...prev, 
            caseId: val,
            participants: newParticipants
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Validate
            if (!formData.caseId) {
                toast.error("Please select a related case");
                setIsLoading(false);
                return;
            }
            if (!formData.title.trim()) {
                toast.error("Event title is required");
                setIsLoading(false);
                return;
            }

            // Call API
            await api.post('/schedules', formData);
            
            toast.success("Event scheduled successfully");
            navigate('/dashboard/schedule');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create event");
        } finally {
            setIsLoading(false);
        }
    };

    const SelectedIcon = eventTypeConfig[formData.eventType]?.icon || CalendarIcon;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-full xl:max-w-7xl mx-auto py-6 px-4 md:px-6 lg:px-8"
        >
            <Button 
                variant="ghost" 
                className="mb-6 pl-0 hover:pl-2 transition-all" 
                onClick={() => navigate('/dashboard/schedule')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Schedule
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Section */}
                <div className="lg:col-span-2">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-xl shadow-xl">
                        <CardHeader className="border-b border-border/40 pb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={cn("p-2 rounded-lg bg-primary/10", eventTypeConfig[formData.eventType]?.color)}>
                                    <SelectedIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Schedule New Event</CardTitle>
                                    <CardDescription>Enter details for your new calendar entry</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-6 pt-6">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium">Event Title</Label>
                                    <Input 
                                        id="title" 
                                        placeholder="e.g., Initial Hearing vs. Smith" 
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        className="h-11 text-lg bg-background/50"
                                        autoFocus
                                        required
                                    />
                                </div>

                                {/* Event Type & Case Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label>Event Type</Label>
                                        <Select 
                                            value={formData.eventType} 
                                            onValueChange={(val) => handleInputChange('eventType', val)}
                                        >
                                            <SelectTrigger className="h-10 bg-background/50">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hearing">
                                                    <div className="flex items-center gap-2">
                                                        <Gavel className="h-4 w-4 text-amber-500" /> Court Hearing
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="meeting">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-blue-500" /> Client Meeting
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="filing">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-purple-500" /> Filing Deadline
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="deadline">
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4 text-red-500" /> Task Deadline
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="other">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="h-4 w-4 text-gray-500" /> Other
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Link to Case <span className="text-red-500">*</span></Label>
                                        <Select 
                                            value={formData.caseId} 
                                            onValueChange={handleCaseSelect}
                                        >
                                            <SelectTrigger className={cn("h-10 bg-background/50", !formData.caseId && "border-amber-500/50")}>
                                                <SelectValue placeholder="Select a case..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cases.map(c => (
                                                    <SelectItem key={c.id || c._id} value={c.id || c._id}>
                                                        <span className="font-medium">{c.ref}</span> - {c.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Date & Time Section */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="space-y-2 md:col-span-1">
                                        <Label>Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal bg-background/50 h-10",
                                                        !formData.date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.date}
                                                    onSelect={(d) => handleInputChange('date', d)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Start Time</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                type="time" 
                                                className="pl-9 bg-background/50 h-10" 
                                                value={formData.startTime}
                                                onChange={(e) => handleInputChange('startTime', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>End Time</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                type="time" 
                                                className="pl-9 bg-background/50 h-10" 
                                                value={formData.endTime}
                                                onChange={(e) => handleInputChange('endTime', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label>Location / Meeting Link</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            className="pl-9 bg-background/50 h-10" 
                                            placeholder="e.g., Courtroom 2A or Zoom Link" 
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label>Notes & Agenda</Label>
                                    <Textarea 
                                        placeholder="Add important details, required documents, or meeting agenda..." 
                                        className="min-h-[120px] bg-background/50 resize-y"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                    />
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-end gap-3 pt-6 pb-6 bg-muted/20 border-t border-border/40 rounded-b-xl">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => navigate(-1)}
                                    className="hover:bg-background/80"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="min-w-[140px] shadow-lg shadow-primary/20"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scheduling...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm Event
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        <Card className="bg-primary/5 border-primary/10 shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg">Event Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className={cn("mt-1 p-1.5 rounded-md bg-background border", eventTypeConfig[formData.eventType]?.color)}>
                                        <SelectedIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground/90 leading-tight">
                                            {formData.title || "Untitled Event"}
                                        </p>
                                        <p className="text-sm text-muted-foreground capitalize mt-1">
                                            {eventTypeConfig[formData.eventType]?.label}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="h-px bg-primary/10 w-full" />
                                
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CalendarIcon className="h-4 w-4 opacity-70" />
                                        <span>
                                            {formData.date ? format(formData.date, "EEEE, MMMM do, yyyy") : "No date selected"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4 opacity-70" />
                                        <span>
                                            {formData.startTime} - {formData.endTime}
                                        </span>
                                    </div>
                                    {formData.location && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4 opacity-70" />
                                            <span className="truncate">{formData.location}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 text-sm text-muted-foreground">
                            <p className="flex gap-2">
                                <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                <span>
                                    Reminders will be sent automatically to all participants 24 hours before the event.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CreateEventPage;
