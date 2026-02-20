import React, { useEffect, useRef, useState } from 'react';
import { 
    Send, 
    Paperclip, 
    Bot, 
    User, 
    Search, 
    FileText, 
    Hash, 
    Briefcase, 
    X,
    Sparkles, 
    Trash2,
    Check,
    ChevronDown,
    FileType,
    Loader2,
    MessageSquare,
    Plus,
    Menu,
    History
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAIStore } from '@/store/useAIStore';
import { useCasesStore } from '@/store/cases';
import { useCommunityStore } from '@/store/useCommunityStore';
import { useDocumentsStore } from '@/store/documents';
import api from '@/lib/api/api'; // Import API client

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// --- Components ---

const ChatMessage = ({ message }) => {
    const isAI = message.role === 'assistant' || message.type === 'ai'; // Handle both API and local formats
    const text = message.content || message.text;
    const context = message.context || []; // Context might be attached to message in some formats

    return (
        <div className={cn(
            "flex w-full gap-4 p-4",
            isAI ? "bg-muted/30" : "bg-background"
        )}>
            <div className={cn(
                "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border",
                isAI ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border"
            )}>
                {isAI ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className="flex-1 space-y-2 overflow-hidden">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium leading-none">
                        {isAI ? 'AI Assistant' : 'You'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp || message.createdAt).toLocaleTimeString()}
                    </span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm break-words leading-relaxed text-muted-foreground">
                   {isAI ? (
                       <ReactMarkdown>{text}</ReactMarkdown>
                   ) : (
                       <p className="whitespace-pre-wrap">{text}</p>
                   )}
                </div>
                 {context && context.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {context.map((ctx, i) => (
                            <Badge key={i} variant="outline" className="text-xs font-normal bg-background/50">
                                {ctx.type === 'case' && <Briefcase className="mr-1 h-3 w-3" />}
                                {ctx.type === 'thread' && <Hash className="mr-1 h-3 w-3" />}
                                {ctx.type === 'document' && <FileText className="mr-1 h-3 w-3" />}
                                {ctx.title || 'Context Item'}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ContextSelector = ({ onSelect, activeContext }) => {
    // ... items ...
    const { cases, fetchCases } = useCasesStore();
    const { threads, fetchThreads } = useCommunityStore();
    const { cache: docCache, fetchDocuments } = useDocumentsStore();

    useEffect(() => {
        fetchCases();
        fetchThreads();
    }, []);

    const [search, setSearch] = useState('');

    const isSelected = (id) => activeContext.some(item => item.id === id);

    const getDocsForCase = (caseId) => docCache[`${caseId}::__root__`]?.items || [];

    const handleCaseExpand = (caseId) => {
        if (caseId) {
            fetchDocuments({ caseId });
        }
    };

    const filteredCases = cases?.filter(c => 
        c.title?.toLowerCase().includes(search.toLowerCase()) || 
        c.caseNumber?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const filteredThreads = threads?.filter(t => 
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.content?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="flex flex-col h-full"> 
            <div className="px-4 py-2 border-b">
                 <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search context..." 
                        className="pl-8" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <Tabs defaultValue="cases" className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                    <TabsTrigger value="cases" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground flex-1">
                        Cases
                    </TabsTrigger>
                     <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground flex-1">
                        Documents
                    </TabsTrigger>
                     <TabsTrigger value="community" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground flex-1">
                        Community
                    </TabsTrigger>
                </TabsList>

                {/* CASES TAB */}
                <TabsContent value="cases" className="flex-1 overflow-hidden p-0 m-0">
                     <ScrollArea className="h-full">
                        <div className="p-4 space-y-2">
                            {filteredCases.map(c => {
                                const selected = isSelected(c.id || c._id);
                                return (
                                    <button
                                        key={c.id || c._id}
                                        onClick={() => onSelect({ type: 'case', id: c.id || c._id, title: c.title, data: c })}
                                        className={cn(
                                            "w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 group relative",
                                            selected ? "bg-primary/5 border-primary/50" : "hover:bg-muted/50"
                                        )}
                                    >
                                        <Briefcase className={cn("h-5 w-5 mt-0.5", selected ? "text-primary" : "text-muted-foreground")} />
                                        <div>
                                            <p className={cn("font-medium text-sm line-clamp-1", selected ? "text-primary" : "group-hover:text-primary")}>{c.title}</p>
                                            <p className="text-xs text-muted-foreground">{c.caseNumber}</p>
                                        </div>
                                        {selected && <Check className="absolute right-3 top-3 h-4 w-4 text-primary" />}
                                    </button>
                                );
                            })}
                        </div>
                     </ScrollArea>
                </TabsContent>

                {/* DOCUMENTS TAB */}
                <TabsContent value="documents" className="flex-1 overflow-hidden p-0 m-0">
                    <ScrollArea className="h-full">
                         <div className="p-4">
                            <Accordion type="single" collapsible className="w-full" onValueChange={handleCaseExpand}>
                                {filteredCases.map(c => (
                                    <AccordionItem key={c.id || c._id} value={c.id || c._id} className="border-b-0 mb-2 border rounded-lg overflow-hidden">
                                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline">
                                            <div className="flex items-center gap-2 text-left">
                                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                <div className="flex flex-col">
                                                     <span className="text-sm font-medium">{c.title}</span>
                                                     <span className="text-[10px] text-muted-foreground">{c.caseNumber}</span>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="p-0 bg-muted/20">
                                            <div className="flex flex-col p-2 gap-1">
                                                {getDocsForCase(c.id || c._id).length === 0 ? (
                                                    <p className="text-xs text-muted-foreground p-2 text-center">No documents found.</p>
                                                ) : (
                                                    getDocsForCase(c.id || c._id).map(doc => {
                                                         const selected = isSelected(doc.id || doc._id);
                                                         return (
                                                            <button
                                                                key={doc.id || doc._id}
                                                                onClick={() => onSelect({ type: 'document', id: doc.id || doc._id, title: doc.name || doc.fileName, data: doc })}
                                                                className={cn(
                                                                    "w-full text-left px-3 py-2 rounded-md flex items-center gap-2 transition-colors",
                                                                    selected ? "bg-primary/10 text-primary" : "hover:bg-background text-muted-foreground hover:text-foreground"
                                                                )}
                                                            >
                                                                <div className="shrink-0">
                                                                    {selected ? <Check className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                                                                </div>
                                                                <span className="text-xs truncate">{doc.name || doc.fileName}</span>
                                                            </button>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                             {filteredCases.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-8">No cases found to list documents.</p>
                            )}
                         </div>
                    </ScrollArea>
                </TabsContent>

                {/* COMMUNITY TAB */}
                 <TabsContent value="community" className="flex-1 overflow-hidden p-0 m-0">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-2">
                             {filteredThreads.map(t => {
                                const selected = isSelected(t.id || t._id);
                                return (
                                    <button
                                        key={t.id || t._id}
                                        onClick={() => onSelect({ type: 'thread', id: t.id || t._id, title: t.title, data: t })}
                                        className={cn(
                                            "w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 group relative",
                                            selected ? "bg-primary/5 border-primary/50" : "hover:bg-muted/50"
                                        )}
                                    >
                                        <Hash className={cn("h-5 w-5 mt-0.5", selected ? "text-primary" : "text-muted-foreground")} />
                                        <div>
                                            <p className={cn("font-medium text-sm line-clamp-1", selected ? "text-primary" : "group-hover:text-primary")}>{t.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <span>{t.author?.name || 'User'}</span>
                                                <span>•</span>
                                                <span>{t.replies?.length || 0} replies</span>
                                            </div>
                                        </div>
                                         {selected && <Check className="absolute right-3 top-3 h-4 w-4 text-primary" />}
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
};

// --- Main Page ---

const AIToolsPage = () => {
    // Local State
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeContext, setActiveContext] = useState([]); // Array of selected context items
    const scrollRef = useRef(null);

    // Initial Fetch: Get User chats
    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await api.getChats();
            setChats(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch chats:", error);
            // toast.error("Failed to load chat history");
        }
    };

    // Fetch messages when active chat changes
    useEffect(() => {
        if (activeChatId) {
            const loadChat = async () => {
                setIsLoading(true);
                try {
                    const res = await api.getChat(activeChatId);
                    if (res.data.data) {
                        setMessages(res.data.data.messages || []);
                        // Optionally restore context if stored in DB
                        // if (res.data.data.context) ... 
                    }
                } catch (error) {
                    toast.error("Failed to load chat");
                } finally {
                    setIsLoading(false);
                }
            };
            loadChat();
        } else {
            // New chat state
            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: "# Hello! \nI'm your **Advyon AI Assistant**. \n\nI can help you analyze cases, draft documents, or research community discussions. \n\n**To get started:**\n1. Type a question below.\n2. Use the **Clip Icon** to attach specific cases or threads as context.",
                timestamp: new Date()
            }]);
        }
    }, [activeChatId]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!input.trim() && activeContext.length === 0) return;

        const userMsgText = input;
        setInput('');
        setIsLoading(true);

        // Optimistic Update
        const tempUserMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: userMsgText,
            context: activeContext,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, tempUserMsg]);

        try {
            // Context Payload
            const contextPayload = activeContext.length > 0 ? {
                items: activeContext.map(c => ({ type: c.type, id: c.id, title: c.title, data: c.data }))
            } : undefined;

            const res = await api.createOrUpdateChat({
                chatId: activeChatId || undefined,
                message: userMsgText,
                context: contextPayload
            });

            const updatedChat = res.data.data;
            
            // If new chat created, update ID and list
            if (!activeChatId && updatedChat) {
                setActiveChatId(updatedChat._id);
                fetchChats(); // Refresh sidebar list
            }

            // Update messages with real response (including AI reply)
            if (updatedChat && updatedChat.messages) {
                setMessages(updatedChat.messages);
            }

        } catch (error) {
            console.error(error);
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            };
            toast.error("Failed to get response form AI");
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = () => {
        setActiveChatId(null);
        setActiveContext([]);
        setIsSidebarOpen(false); // Mobile: close sidebar
    };

    const handleDeleteChat = async (e, chatId) => {
        e.stopPropagation();
        if (!confirm("Delete this chat?")) return;
        
        try {
            await api.deleteChat(chatId);
            setChats(prev => prev.filter(c => c._id !== chatId));
            if (activeChatId === chatId) {
                handleNewChat();
            }
            toast.success("Chat deleted");
        } catch (error) {
            toast.error("Failed to delete chat");
        }
    };

    const toggleContext = (item) => {
        setActiveContext(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.filter(i => i.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    };

    const removeContext = (index) => {
        setActiveContext(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] w-full bg-background relative overflow-hidden">
            
            {/* Sidebar (Desktop: Visible, Mobile: Drawer) */}
            <div className="hidden md:flex flex-col w-64 border-r bg-muted/10 shrink-0">
                <div className="p-4 border-b h-16 flex items-center justify-between shrink-0">
                    <span className="font-semibold text-sm flex items-center gap-2">
                        <History className="h-4 w-4" /> History
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleNewChat}>
                        <Plus className="h-4 w-4 mr-1" /> New
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {chats.map(chat => (
                            <button
                                key={chat._id}
                                onClick={() => setActiveChatId(chat._id)}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group",
                                    activeChatId === chat._id ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span className="truncate flex-1 pr-2">{chat.title || "New Chat"}</span>
                                <div 
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded transition-opacity"
                                    onClick={(e) => handleDeleteChat(e, chat._id)}
                                >
                                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                </div>
                            </button>
                        ))}
                        {chats.length === 0 && (
                            <div className="text-xs text-muted-foreground text-center py-8">
                                No recent chats
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t text-xs text-muted-foreground text-center">
                    Using OpenRouter AI
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background/50 backdrop-blur z-10 w-full">
                    <div className="flex items-center gap-2">
                         {/* Mobile Sidebar Trigger */}
                         <div className="md:hidden mr-2">
                            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 p-0">
                                    <div className="h-full flex flex-col">
                                        <div className="p-4 border-b h-16 flex items-center justify-between">
                                            <span className="font-semibold">Chat History</span>
                                            <Button variant="ghost" size="sm" onClick={handleNewChat}>
                                                <Plus className="h-4 w-4" /> New
                                            </Button>
                                        </div>
                                        <ScrollArea className="flex-1">
                                            <div className="p-2 space-y-1">
                                                {chats.map(chat => (
                                                    <button
                                                        key={chat._id}
                                                        onClick={() => { setActiveChatId(chat._id); setIsSidebarOpen(false); }}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group",
                                                            activeChatId === chat._id ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                                        )}
                                                    >
                                                        <span className="truncate flex-1 pr-2">{chat.title}</span>
                                                        <Trash2 
                                                            className="h-3 w-3 opacity-50 hover:opacity-100 hover:text-destructive" 
                                                            onClick={(e) => handleDeleteChat(e, chat._id)}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Sparkles className="h-5 w-5 text-primary" />
                        <h1 className="text-lg font-semibold tracking-tight">Advyon AI Assistant</h1>
                        {/* <Badge variant="outline" className="ml-2 font-normal text-xs text-muted-foreground border-primary/20 bg-primary/5">
                            Beta
                        </Badge> */}
                    </div>
                </header>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative w-full min-h-0">
                    <ScrollArea className="flex-1 h-full w-full">
                        <div className="flex flex-col px-4 py-8 md:px-8 mx-auto max-w-4xl space-y-8 pb-4">
                             {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Bot className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">How can I help you today?</h3>
                                        <p className="text-muted-foreground max-w-md mx-auto mt-2">
                                            I can analyze legal documents, summarize cases, draft clauses, and more. 
                                            Attach a case or thread to get started.
                                        </p>
                                    </div>
                                </div>
                             )}
                            {messages.map((msg, idx) => (
                                <ChatMessage key={msg.id || idx} message={msg} />
                            ))}
                            {isLoading && (
                                <div className="flex w-full gap-4 p-4">
                                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-primary/10 border-primary/20 text-primary">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium leading-none">AI Assistant</span>
                                        </div>
                                        <div className="text-muted-foreground text-sm flex items-center gap-2">
                                             <Loader2 className="h-3 w-3 animate-spin"/> Thinking...
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                </div>

                {/* Footer Area with Context & Input */}
                <div className="shrink-0 border-t bg-background w-full">
                    {/* Input Form */}
                    <div className="p-4 pt-2">
                        <div className="mx-auto max-w-4xl relative">
                            {/* Active Context Bar */}
                            {activeContext.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-2 mb-2 px-4 py-1">
                                    {activeContext.map((ctx, i) => (
                                        <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1 bg-muted/50 border hover:bg-muted animate-in fade-in slide-in-from-bottom-2">
                                            {ctx.type === 'case' && <Briefcase className="h-3 w-3 text-blue-500" />}
                                            {ctx.type === 'thread' && <Hash className="h-3 w-3 text-green-500" />}
                                            {ctx.type === 'document' && <FileText className="h-3 w-3 text-orange-500" />}
                                            <span className="max-w-[200px] truncate font-normal">{ctx.title}</span>
                                            <button onClick={() => removeContext(i)} className="ml-1 hover:bg-background rounded-full p-0.5 transition-colors">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 rounded-xl border bg-background p-2 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 shadow-sm">
                                
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button size="icon" variant="ghost" className="h-10 w-10 shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted" type="button">
                                            <Paperclip className="h-5 w-5" />
                                            <span className="sr-only">Attach context</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0 flex flex-col">
    <SheetHeader className="px-6 py-4 border-b shrink-0">
        <SheetTitle>Add Context</SheetTitle>
        <SheetDescription>Attach cases, documents, or threads to your query.</SheetDescription>
    </SheetHeader>
                                        <ContextSelector 
                                            activeContext={activeContext}
                                            onSelect={(item) => {
                                                toggleContext(item);
                                            }} 
                                        />
                                    </SheetContent>
                                </Sheet>

                                <div className="flex-1 min-w-0">
                                    <Input 
                                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2 h-auto max-h-32 min-h-[2.5rem] resize-none" 
                                        placeholder="Type your message..." 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    size="icon" 
                                    disabled={isLoading || (!input.trim() && activeContext.length === 0)}
                                    className={cn(
                                        "h-10 w-10 shrink-0 rounded-lg transition-all",
                                        input.trim() || activeContext.length > 0 ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                    <span className="sr-only">Send</span>
                                </Button>
                            </form>
                            <div className="mt-2 text-center text-xs text-muted-foreground">
                                AI can make mistakes. Please double check important information.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIToolsPage;
