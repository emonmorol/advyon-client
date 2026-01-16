import React, { useState } from 'react';
import { useMyClients } from '@/services/users/userService';
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
  MessageSquare, 
  Eye, 
  UserPlus, 
  MoreHorizontal,
  Mail,
  Phone
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ClientsPage() {
  const { data: response, isLoading } = useMyClients();
  const clients = response?.data || [];
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter(client => 
    client.displayName?.toLowerCase().includes(search.toLowerCase()) || 
    client.email?.toLowerCase().includes(search.toLowerCase())
  );

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
        <Button className="bg-primary hover:bg-primary/90">
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
                  <TableHead className="text-right">Actions</TableHead>
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
                            <p className="font-medium text-foreground">{client.displayName}</p>
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
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                               <Eye className="mr-2 h-4 w-4" />
                               View Case Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
    </div>
  );
}
