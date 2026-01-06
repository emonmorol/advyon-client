import React, { useState } from 'react';
import { Users, Link as LinkIcon, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import EmailSearchInput from './EmailSearchInput';
import ParticipantRow from './ParticipantRow';

const ParticipantsModal = ({ 
  isOpen, 
  onClose,
  participants: initialParticipants = [] 
}) => {
  // Mock State
  const [participants, setParticipants] = useState([
     { id: '1', name: 'You', email: 'you@example.com', role: 'admin', avatar: '' },
     { id: '2', name: 'John Doe', email: 'john@example.com', role: 'editor', avatar: '' },
     ...initialParticipants
  ]);

  const handleInvite = (email) => {
    // Simulate invitation
    const newParticipant = {
      id: Math.random().toString(),
      name: '',
      email,
      role: 'viewer',
      avatar: ''
    };
    setParticipants([...participants, newParticipant]);
    toast.success(`Invitation sent to ${email}`);
  };

  const handleUpdateRole = (id, newRole) => {
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, role: newRole } : p
    ));
    toast.success('Role updated');
  };

  const handleRemove = (id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
    toast.success('Participant removed');
  };

  const copyLink = () => {
    navigator.clipboard.writeText('https://advyon.com/case/join/abc-123');
    toast.success('Invite link copied to clipboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
             <Users className="w-5 h-5 text-primary" />
             Manage Access
          </DialogTitle>
          <DialogDescription>
            Invite colleagues, clients, or other lawyers to this case.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Invite Section */}
          <div className="space-y-4">
             <EmailSearchInput onInvite={handleInvite} />
             
             <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                   <LinkIcon className="w-4 h-4" />
                   Anyone with the link can view
                </span>
                <Button variant="link" size="sm" onClick={copyLink} className="h-auto p-0">
                   Copy Link
                </Button>
             </div>
          </div>

          <Separator />

          {/* List Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">People with access</h4>
            <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto -mx-2 px-2">
               {participants.map(p => (
                  <ParticipantRow 
                     key={p.id} 
                     participant={p} 
                     onUpdateRole={handleUpdateRole}
                     onRemove={handleRemove}
                  />
               ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantsModal;
