import React from 'react';
import { X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import PermissionsToggles from './PermissionsToggles';

const ParticipantRow = ({ participant, onUpdateRole, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={participant.avatar} />
          <AvatarFallback>{participant.name ? participant.name[0] : participant.email[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{participant.name || 'Invited User'}</p>
          <p className="text-xs text-muted-foreground mt-1">{participant.email}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <PermissionsToggles 
          role={participant.role} 
          onChange={(newRole) => onUpdateRole(participant.id, newRole)}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
          onClick={() => onRemove(participant.id)}
          title="Remove Access"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ParticipantRow;
