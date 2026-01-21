import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCasesStore } from '@/store/cases';
// Assuming useScheduleStore will be created or direct API call
import api from '@/lib/api/api'; 

const CreateEventPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const typeParam = searchParams.get('type');
    
    // Store
    const { cases, fetchCases } = useCasesStore();
    
    // Local State
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventType: typeParam || 'hearing',
        date: new Date(),
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        caseId: '',
        participants: []
    });

    React.useEffect(() => {
        if (cases.length === 0) fetchCases();
    }, [cases.length, fetchCases]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Validate
            if (!formData.caseId) {
                toast.error("Please select a case");
                setIsLoading(false);
                return;
            }

            // Call API to create event on server
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

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Schedule New Event</h1>
                <p className="text-muted-foreground">Add a hearing, meeting, or deadline to your calendar.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input 
                            id="title" 
                            placeholder="e.g., Initial Hearing" 
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            required
                        />
                    </div>

                    {/* Type & Case Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Event Type</Label>
                            <Select 
                                value={formData.eventType} 
                                onValueChange={(val) => handleInputChange('eventType', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hearing">Court Hearing</SelectItem>
                                    <SelectItem value="meeting">Client Meeting</SelectItem>
                                    <SelectItem value="filing">Filing Deadline</SelectItem>
                                    <SelectItem value="deadline">Task Deadline</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Case Link</Label>
                            <Select 
                                value={formData.caseId} 
                                onValueChange={(val) => handleInputChange('caseId', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a case" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cases.map(c => (
                                        <SelectItem key={c.id || c._id} value={c.id || c._id}>
                                            {c.title} ({c.ref})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Date & Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-1">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
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
                                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    type="time" 
                                    className="pl-9" 
                                    value={formData.startTime}
                                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    type="time" 
                                    className="pl-9" 
                                    value={formData.endTime}
                                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label>Location / Link</Label>
                        <div className="relative">
                            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                className="pl-9" 
                                placeholder="e.g., Room 304, High Court or https://zoom.us/..." 
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label>Additional Notes</Label>
                        <Textarea 
                            placeholder="Add agenda, document requirements, or case notes..." 
                            className="min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Scheduling...' : 'Schedule Event'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateEventPage;
