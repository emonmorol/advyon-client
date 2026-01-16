import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Eye, FileEdit, Settings } from 'lucide-react';

const PermissionsToggles = ({ role, onChange }) => {
  const getRoleIcon = (r) => {
    switch (r) {
      case 'viewer': return <Eye className="w-4 h-4 mr-2" />;
      case 'editor': return <FileEdit className="w-4 h-4 mr-2" />;
      case 'admin': return <Settings className="w-4 h-4 mr-2" />;
      default: return null;
    }
  };

  const getRoleLabel = (r) => {
    switch (r) {
      case 'viewer': return 'Viewer';
      case 'editor': return 'Editor';
      case 'admin': return 'Admin';
      default: return r;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 font-normal text-muted-foreground hover:text-foreground">
          {getRoleIcon(role)}
          {getRoleLabel(role)}
          <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onChange('viewer')}>
           <Eye className="w-4 h-4 mr-2" /> Viewer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('editor')}>
           <FileEdit className="w-4 h-4 mr-2" /> Editor
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('admin')}>
           <Settings className="w-4 h-4 mr-2" /> Admin
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PermissionsToggles;
