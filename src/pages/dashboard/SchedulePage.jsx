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
              <motion.div
                key={event._id || index}
                variants={item}
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
