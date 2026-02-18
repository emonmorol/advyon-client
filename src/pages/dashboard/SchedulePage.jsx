import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Calendar, 
  Plus, 
  Gavel, 
  Users, 
  FileText, 
  AlertCircle, 
  Clock, 
  MapPin,
  Loader2,
  CalendarDays,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isToday, isFuture, isPast } from 'date-fns';
import { useScheduleStore } from '@/store/useScheduleStore';
import ScheduleDetailModal from '@/features/schedule/components/ScheduleDetailModal';
import { cn } from '@/lib/utils';

const eventTypeConfig = {
  hearing: { icon: Gavel, label: 'Court Hearing', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  meeting: { icon: Users, label: 'Meeting', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  filing: { icon: FileText, label: 'Filing Deadline', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
  deadline: { icon: AlertCircle, label: 'Deadline', color: 'bg-red-500/10 text-red-500 border-red-500/30' },
  other: { icon: Calendar, label: 'Other', color: 'bg-gray-500/10 text-gray-500 border-gray-500/30' }
};

const statusConfig = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-500/10 text-blue-500' },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-500' },
  postponed: { label: 'Postponed', color: 'bg-amber-500/10 text-amber-500' }
};

const filterTabs = [
  { id: 'all', label: 'All Events' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' }
];

const SchedulePage = () => {
  const navigate = useNavigate();
  const { events, isLoading, error, fetchEvents, selectedEvent, getEventById, clearSelectedEvent } = useScheduleStore();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = async (event) => {
    if (event._id) {
      await getEventById(event._id);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    clearSelectedEvent();
  };

  const filteredEvents = useMemo(() => {
    let filtered = [...(events || [])];

    // Apply date filter
    if (activeFilter === 'today') {
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.date);
        return isToday(eventDate);
      });
    } else if (activeFilter === 'upcoming') {
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.date);
        return isFuture(eventDate) || isToday(eventDate);
      });
    } else if (activeFilter === 'past') {
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.date);
        return isPast(eventDate) && !isToday(eventDate);
      });
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(e => e.eventType === typeFilter);
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    return filtered;
  }, [events, activeFilter, typeFilter]);

  const formatEventDate = (date) => {
    try {
      const d = new Date(date);
      if (isToday(d)) return 'Today';
      return format(d, 'EEE, MMM d');
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    if (typeof time === 'string' && time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    return time;
  };

  const cardStyle = "border-border/40 bg-card backdrop-blur-sm shadow-lg transition-all hover:border-accent/40 hover:shadow-xl cursor-pointer";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 p-6 md:p-8 bg-background min-h-screen"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-accent" />
            Schedule & Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your hearings, meetings, and important deadlines
          </p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/schedule/new')}
          className="bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 hover:scale-105 transition-all"
        >
          <Plus className="mr-2 h-5 w-5" />
          Schedule New Event
        </Button>
      </motion.div>

      {/* Filter Tabs & Type Filter */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Date Filter Tabs */}
        <div className="flex gap-2 bg-secondary/50 rounded-lg p-1">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeFilter === tab.id
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hearing">Court Hearing</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="filing">Filing Deadline</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-medium">Failed to load events</p>
          <p className="text-muted-foreground text-sm mt-1">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => fetchEvents()}>
            Try Again
          </Button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <motion.div variants={item} className="text-center py-20">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">
            {activeFilter === 'all' 
              ? "You haven't scheduled any events yet." 
              : `No ${activeFilter} events to display.`}
          </p>
          <Button onClick={() => navigate('/dashboard/schedule/new')} className="bg-accent text-accent-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Your First Event
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredEvents.map((event, index) => {
            const eventType = eventTypeConfig[event.eventType] || eventTypeConfig.other;
            const EventIcon = eventType.icon;
            const status = statusConfig[event.status] || statusConfig.scheduled;

            return (
              <motion.div
                key={event._id || index}
                variants={item}
                initial="hidden"
                animate="show"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className={cn(cardStyle, "group")}
                  onClick={() => handleEventClick(event)}
                >
                  <CardContent className="p-5">
                    {/* Header with Type & Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn("p-2 rounded-lg", eventType.color)}>
                        <EventIcon className="h-5 w-5" />
                      </div>
                      <Badge className={cn("text-xs", status.color)}>
                        {status.label}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-card-foreground group-hover:text-accent transition-colors line-clamp-1 mb-2">
                      {event.title}
                    </h3>

                    {/* Date & Time */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatEventDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Case Reference */}
                    {event.caseId && (
                      <div className="mt-3 pt-3 border-t border-border/40">
                        <Badge variant="outline" className="text-xs">
                          {event.caseId.ref || event.caseId.title || 'Linked Case'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Detail Modal */}
      <ScheduleDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </motion.div>
  );
};

export default SchedulePage;
