import React, { useEffect, useState } from 'react';
import { useMyClients } from '@/services/users/userService';
import { shareCaseAccess, revokeCaseAccess } from '@/services/caseAccess/caseAccessService';
import { useCasesStore } from '@/store/cases';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Search, 
  Mail,
  Eye, 
  UserPlus, 
  Phone
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { data: response, isLoading, mutate } = useMyClients();
  const { cases, fetchCases } = useCasesStore();
  const clients = response?.data || [];
  const [search, setSearch] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    caseId: '',
    role: 'viewer',
  });
  const [isInviting, setIsInviting] = useState(false);
  const [removingClientId, setRemovingClientId] = useState('');

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);
 
  const filteredClients = clients.filter(client => 
    (client.displayName || client.fullName)?.toLowerCase().includes(search.toLowerCase()) || 
    client.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInviteClient = async (event) => {
    event.preventDefault();

    if (!inviteForm.email.trim()) {
      toast.error('Client email is required');
      return;
    }

    if (!inviteForm.caseId) {
      toast.error('Please select a case');
      return;
    }

    setIsInviting(true);
    try {
      await shareCaseAccess({
        email: inviteForm.email.trim(),
        caseId: inviteForm.caseId,
        role: inviteForm.role,
      });

      toast.success('Client access granted successfully');
      setIsAddClientOpen(false);
      setInviteForm({ email: '', caseId: '', role: 'viewer' });
      await mutate();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to add client access';
      toast.error(message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveAccess = async (client) => {
    if (!client?.caseId || !client?.id) {
      toast.error('Missing case or client identifier');
      return;
    }

    const confirmed = window.confirm(
      `Remove ${client.displayName || client.fullName || client.email} from this case?`,
    );

    if (!confirmed) {
      return;
    }

    setRemovingClientId(client.id);
    try {
      await revokeCaseAccess(client.caseId, client.id);
      toast.success('Client access removed');
      await mutate();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to remove client access';
      toast.error(message);
    } finally {
      setRemovingClientId('');
    }
  };

  const handleOpenCase = (client) => {
    if (!client?.caseId) {
      toast.error('No linked case found for this client');
      return;
    }

    navigate(`/dashboard/workspace/${client.caseId}`);
  };

  const handleEmailClient = (client) => {
    if (!client?.email) {
      toast.error('Client email not available');
      return;
    }

    const subject = encodeURIComponent('Case update from Advyon');
    window.location.href = `mailto:${client.email}?subject=${subject}`;
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">My Clients</h1>
           <p className="text-muted-foreground mt-1">Manage your client relationships and cases.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddClientOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Client List</CardTitle>
            <CardDescription>
              {clients.length} total clients across your active cases.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-64">
             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Search by name or email..." 
               className="pl-8" 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quick Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src={client.avatarUrl} alt={client.displayName} />
                            <AvatarFallback>{client.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{client.displayName || client.fullName || 'Client'}</p>
                            <p className="text-xs text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                               <Phone className="mr-2 h-3 w-3" />
                               {client.phone || 'N/A'}
                            </div>
                         </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.accessStatus === 'active' ? 'default' : 'secondary'} className="capitalize">
                          {client.accessStatus || 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleOpenCase(client)}
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            Open Case
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleEmailClient(client)}
                          >
                            <Mail className="mr-1.5 h-3.5 w-3.5" />
                            Email
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8"
                            onClick={() => handleRemoveAccess(client)}
                            disabled={removingClientId === client.id}
                          >
                            {removingClientId === client.id ? 'Removing...' : 'Remove Access'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                     <TableCell colSpan={4} className="h-24 text-center">
                        No clients found.
                     </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Existing Client</DialogTitle>
            <DialogDescription>
              Link an existing user account to one of your cases by email.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleInviteClient}>
            <div className="space-y-2">
              <label htmlFor="client-email" className="text-sm font-medium text-foreground">
                Client Email
              </label>
              <Input
                id="client-email"
                type="email"
                placeholder="client@example.com"
                value={inviteForm.email}
                onChange={(event) =>
                  setInviteForm((prev) => ({ ...prev, email: event.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="client-case" className="text-sm font-medium text-foreground">
                Assign Case
              </label>
              <select
                id="client-case"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={inviteForm.caseId}
                onChange={(event) =>
                  setInviteForm((prev) => ({ ...prev, caseId: event.target.value }))
                }
                required
              >
                <option value="">Select a case</option>
                {cases.map((item) => (
                  <option key={item.id || item._id} value={item.id || item._id}>
                    {item.title} ({item.ref || item.caseNumber || item.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="client-role" className="text-sm font-medium text-foreground">
                Access Role
              </label>
              <select
                id="client-role"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={inviteForm.role}
                onChange={(event) =>
                  setInviteForm((prev) => ({ ...prev, role: event.target.value }))
                }
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddClientOpen(false)}
                disabled={isInviting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isInviting}>
                {isInviting ? 'Adding...' : 'Add Client'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
