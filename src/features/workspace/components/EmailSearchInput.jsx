import React, { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EmailSearchInput = ({ onInvite }) => {
  const [email, setEmail] = useState('');

  const handleInvite = () => {
    if (email.trim() && email.includes('@')) {
      onInvite(email);
      setEmail('');
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input 
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           placeholder="Search by email to invite..." 
           className="pl-9"
        />
      </div>
      <Button onClick={handleInvite} className="gap-2">
        <UserPlus className="w-4 h-4" />
        Invite
      </Button>
    </div>
  );
};

export default EmailSearchInput;
