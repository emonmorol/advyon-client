import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Briefcase, 
  Users, 
  Gavel,
  FileText,
  AlertCircle,
  X,
  ExternalLink,
  Video
} from 'lucide-react';
import { format } from 'date-fns';
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

const ScheduleDetailModal = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  const eventType = eventTypeConfig[event.eventType] || eventTypeConfig.other;
  const EventIcon = eventType.icon;
  const status = statusConfig[event.status] || statusConfig.scheduled;

  const formatEventDate = (date) => {
    try {
      return format(new Date(date), 'EEEE, MMMM d, yyyy');
    } catch {
      return 'Date not available';
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    // Handle HH:mm format
    if (typeof time === 'string' && time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    return time;
  };

  const isUrl = (str) => /^https?:\/\//.test(str);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/40">
        <DialogHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", eventType.color)}>
                <EventIcon className="h-5 w-5" />
              </div>
              <div>
                <Badge variant="outline" className={cn("text-xs", eventType.color)}>
                  {eventType.label}
                </Badge>
              </div>
            </div>
            <Badge className={cn("text-xs", status.color)}>
              {status.label}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-semibold text-card-foreground">
            {event.title}
          </DialogTitle>
          {event.description && (
            <DialogDescription className="text-muted-foreground">
              {event.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date & Time */}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-card-foreground">{formatEventDate(event.date)}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-card-foreground">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
          </div>

          {/* Location / Meet Link */}
          {event.location && (
            <div className="flex items-center gap-3 text-sm">
              {isUrl(event.location) ? (
                <Video className="h-4 w-4 text-blue-500 flex-shrink-0" />
              ) : (
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              {isUrl(event.location) ? (
                <a
                  href={event.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-500 hover:text-blue-400 hover:underline transition-colors truncate max-w-[340px]"
                >
                  <span className="truncate">{event.location}</span>
                  <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                </a>
              ) : (
                <span className="text-card-foreground">{event.location}</span>
              )}
            </div>
          )}

          {/* Case Reference */}
          {event.caseId && typeof event.caseId === 'object' && (
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-card-foreground">
                {event.caseId?.title || 'Linked Case'} 
                {event.caseId?.ref && <span className="text-muted-foreground ml-1">({event.caseId.ref})</span>}
              </span>
            </div>
          )}

          {/* Participants */}
          {event.participants && event.participants.length > 0 && (
            <div className="flex items-start gap-3 text-sm">
              <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {event.participants.map((p, i) => (
                  <div 
                    key={p._id || i} 
                    className="flex items-center gap-2 bg-secondary/50 rounded-full px-3 py-1"
                  >
                    {p.profileImage ? (
                      <img src={p.profileImage} alt="" className="h-5 w-5 rounded-full" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium">
                        {(p.name || p.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs text-card-foreground">{p.name || p.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDetailModal;
