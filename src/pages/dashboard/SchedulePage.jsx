import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Calendar as CalendarIcon, 
  Plus, 
  Gavel, 
  Users, 
  FileText, 
  AlertCircle, 
  Clock, 
  MapPin,
  Loader2,
  CalendarDays,
  Filter,
  List,
  Grid3X3,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isToday, isFuture, isPast } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useScheduleStore } from '@/store/useScheduleStore';
import ScheduleDetailModal from '@/features/schedule/components/ScheduleDetailModal';
import { cn } from '@/lib/utils';

const eventTypeConfig = {
  hearing: { icon: Gavel, label: 'Court Hearing', color: '#f59e0b', bgColor: 'bg-amber-500/10' },
  meeting: { icon: Users, label: 'Meeting', color: '#3b82f6', bgColor: 'bg-blue-500/10' },
  filing: { icon: FileText, label: 'Filing Deadline', color: '#8b5cf6', bgColor: 'bg-purple-500/10' },
  deadline: { icon: AlertCircle, label: 'Deadline', color: '#ef4444', bgColor: 'bg-red-500/10' },
  other: { icon: CalendarIcon, label: 'Other', color: '#6b7280', bgColor: 'bg-gray-500/10' }
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

const viewConfig = [
  { id: 'dayGridMonth', label: 'Month', icon: Grid3X3 },
  { id: 'timeGridWeek', label: 'Week', icon: LayoutGrid },
  { id: 'timeGridDay', label: 'Day', icon: CalendarIcon },
  { id: 'list', label: 'List', icon: List }
];

const SchedulePage = () => {
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const { events, isLoading, error, fetchEvents, selectedEvent, getEventById, clearSelectedEvent } = useScheduleStore();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('dayGridMonth');
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Convert events to FullCalendar format
  useEffect(() => {
    if (events && events.length > 0) {
      const mapped = events.map(event => {
        const typeConfig = eventTypeConfig[event.eventType] || eventTypeConfig.other;
        const startDate = event.date ? new Date(event.date) : new Date();
        const startTime = event.startTime || '09:00';
        const endTime = event.endTime || '10:00';
        
        // Combine date and time for datetime events
        const [startHour = '9', startMin = '0'] = startTime.split(':');
        const [endHour = '10', endMin = '0'] = endTime.split(':');
        
        const start = new Date(startDate);
        start.setHours(parseInt(startHour) || 9, parseInt(startMin) || 0);
        
        const end = new Date(startDate);
        end.setHours(parseInt(endHour) || 10, parseInt(endMin) || 0);

        return {
          id: event._id,
          title: event.title,
          start: start,
          end: end,
          backgroundColor: typeConfig.color,
          borderColor: typeConfig.color,
          extendedProps: {
            eventType: event.eventType,
            status: event.status,
            location: event.location,
            caseId: typeof event.caseId === 'object' ? event.caseId : null
          }
        };
      });
      setCalendarEvents(mapped);
    } else {
      setCalendarEvents([]);
    }
  }, [events]);

  const handleEventClick = async (info) => {
    const eventId = info.event.id;
    if (eventId) {
      await getEventById(eventId);
      setIsModalOpen(true);
    }
  };

  const handleDateClick = (info) => {
    // Navigate to create event page with pre-filled date
    navigate(`/dashboard/schedule/new?date=${info.dateStr}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    clearSelectedEvent();
  };

  const handleViewChange = (newView) => {
    setViewMode(newView);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
    }
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

      {/* View Mode Switcher & Filters */}
      <motion.div variants={item} className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        
        {/* View Mode Switcher */}
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
          {viewConfig.map(view => (
            <button
              key={view.id}
              onClick={() => handleViewChange(view.id)}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                viewMode === view.id
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              title={view.label}
            >
              <view.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          ))}
        </div>

        {/* Date Filter & Type Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Date Filter Tabs */}
          <div className="flex gap-2 bg-secondary/50 rounded-lg p-1">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
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
              <SelectTrigger className="w-[160px]">
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
        </div>
      </motion.div>

      {/* Calendar View (Month/Week/Day) */}
      {(viewMode === 'dayGridMonth' || viewMode === 'timeGridWeek' || viewMode === 'timeGridDay') && (
        <motion.div variants={item} className="bg-card rounded-xl border border-border shadow-lg p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="[&_.fc]:font-sans [&_.fc]:text-sm [&_.fc-theme-standard td]:border-border [&_.fc-theme-standard th]:border-border [&_.fc-col-header-cell]:bg-muted/50 [&_.fc-daygrid-day]:hover:bg-muted/30 [&_.fc-event]:rounded-md [&_.fc-event]:px-2 [&_.fc-event]:py-1">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={viewMode}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: ''
                }}
                events={calendarEvents}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                height="auto"
                aspectRatio={1.8}
                eventDisplay="block"
                dayMaxEvents={3}
                nowIndicator={true}
                selectable={true}
                selectMirror={true}
                eventTimeFormat={{
                  hour: 'numeric',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
              />
            </div>
          )}
        </motion.div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
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
            <motion.div variants={item} className="flex items-center justify-center py-20">
              <div className="w-full max-w-xl rounded-xl border border-border/60 bg-card/60 p-8 text-center shadow-sm">
                <CalendarIcon className="h-14 w-14 text-accent mx-auto mb-4 opacity-80" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No schedule found</h3>
                <p className="text-muted-foreground mb-6">
                  {activeFilter === 'all'
                    ? 'No events are scheduled yet. Create one to get started.'
                    : `No ${activeFilter} schedule found for the selected filters.`}
                </p>
                <Button onClick={() => navigate('/dashboard/schedule/new')} className="bg-accent text-accent-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule New Event
                </Button>
              </div>
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
                      onClick={() => handleEventClick({ event: { id: event._id } })}
                    >
                      <CardContent className="p-5">
                        {/* Header with Type & Status */}
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn("p-2 rounded-lg", eventType.bgColor)} style={{ color: eventType.color }}>
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
                            <CalendarIcon className="h-3.5 w-3.5" />
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
                        {event.caseId && typeof event.caseId === 'object' && (
                          <div className="mt-3 pt-3 border-t border-border/40">
                            <Badge variant="outline" className="text-xs">
                              {event.caseId?.ref || event.caseId?.title || 'Linked Case'}
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
        </>
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
