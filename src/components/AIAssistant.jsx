import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, ShieldCheck, AlertCircle, MessageSquare,
  Mic, FileText, PieChart, X, Sparkles, GripVertical,
  CheckSquare, Square, Upload, ExternalLink, Users,
  Gavel, RefreshCw, ThumbsUp, ThumbsDown, Lightbulb,
  Send, Paperclip, Copy, BookOpen, TrendingUp
} from 'lucide-react';
import { useAIStore } from '../store/useAIStore';

const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * AIAssistant - A comprehensive AI Suggestions Engine
 * Provides context-aware insights, recommendations, and interactive chat
 */
const AIAssistant = ({
  isOpen = false,
  onClose,
  caseData = {},
  width = 380,
  onWidthChange
}) => {
  const [chatInput, setChatInput] = useState('');
  const [isResizing, setIsResizing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('suggestions'); // 'suggestions' or 'chat'
  const panelRef = useRef(null);
  const chatEndRef = useRef(null);

  // Mock data for suggestions
  const [nextSteps, setNextSteps] = useState([
    { id: 1, text: "Prepare and file motion by Dec 15, 2024", completed: false, priority: "high" },
    { id: 2, text: "Review witness statements for inconsistencies", completed: false, priority: "medium" },
    { id: 3, text: "Schedule deposition with key witness", completed: true, priority: "low" }
  ]);

  const [missingDocs, setMissingDocs] = useState([
    { id: 1, name: "Police Report - Incident #2024-892", referenced: "Case Summary" },
    { id: 2, name: "Medical Records - Dr. Smith", referenced: "Witness Statement" }
  ]);

  const legalSections = [
    { id: 1, code: "Section 302", title: "Punishment for murder", relevant: 95 },
    { id: 2, code: "Section 34", title: "Acts done by several persons", relevant: 88 }
  ];

  const similarCases = [
    { id: 1, title: "Miranda rights in traffic stops", replies: 12, views: 234 },
    { id: 2, title: "Evidence admissibility in DUI", replies: 8, views: 156 }
  ];

  const recentOrders = [
    { id: 1, title: "State v. Martinez - Suppression", date: "Dec 1, 2024", court: "Supreme Court" },
    { id: 2, title: "Updated DUI guidelines", date: "Nov 28, 2024", court: "Appeals Court" }
  ];

  const quickQuestions = [
    "Summarize this case",
    "What's missing?",
    "Suggest next steps",
    "Find similar cases"
  ];

  // Handlers
  const toggleStep = (id) => {
    setNextSteps(prev => prev.map(step =>
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  const dismissStep = (id) => {
    setNextSteps(prev => prev.filter(step => step.id !== id));
  };

  const dismissDoc = (id) => {
    setMissingDocs(prev => prev.filter(doc => doc.id !== id));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  /* AI Store Integration */
  const { sendMessage, isSending } = useAIStore();

  const handleSendMessage = async (message = chatInput) => {
    if (!message.trim()) return;

    // Optimistic UI update
    setChatMessages(prev => [...prev, {
      type: 'user',
      text: message,
      timestamp: new Date()
    }]);

    setChatInput('');
    setIsTyping(true);

    try {
        const response = await sendMessage(caseData.id || 'general', message);
        // Assuming response is the text or object with response field
        const responseText = response?.response || "I have processed your request.";
        
        setChatMessages(prev => [...prev, {
            type: 'ai',
            text: responseText,
            timestamp: new Date()
        }]);
    } catch (error) {
         setChatMessages(prev => [...prev, {
            type: 'ai',
            text: "Sorry, I encountered an error processing your request.",
            timestamp: new Date()
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
    setActiveTab('chat');
  };

  // Resize logic
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 320;
      const maxWidth = 700;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        onWidthChange?.(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, onWidthChange]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Animation variants
  const containerVariants = {
    hidden: { x: width, opacity: 0 },
    visible: {
      x: 0, opacity: 1,
      transition: {
        type: "spring", damping: 25, stiffness: 200,
        staggerChildren: 0.05, delayChildren: 0.1
      }
    },
    exit: { x: width, opacity: 0, transition: { type: "spring", damping: 30, stiffness: 300 } }
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 20, stiffness: 200 } }
  };

  if (!isOpen) return null;

  return (
    <motion.aside
      ref={panelRef}
      style={{ width: `${width}px` }}
      className="fixed right-0 top-16 h-[calc(100vh-4.75rem)] bg-background/95 backdrop-blur-md border-l border-border flex flex-col shadow-2xl z-40 rounded-2xl overflow-hidden"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Resize Handle */}
      <motion.div
        onMouseDown={handleMouseDown}
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-accent/50 transition-colors group z-10",
          isResizing && "bg-accent"
        )}
        whileHover={{ scale: 1.5 }}
      >
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-accent rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.2 }}
        >
          <GripVertical size={12} className="text-accent-foreground" />
        </motion.div>
      </motion.div>

      <div className="flex flex-col h-full overflow-hidden">
        {/* AI Header */}
        <motion.div
          className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-background to-primary/10"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles size={16} className="text-accent" />
              </motion.div>
              Advyon AI
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleRefresh}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
              title="Refresh suggestions"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95, rotate: 180 }}
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 0.5 }}
            >
              <RefreshCw size={14} />
            </motion.button>
            <motion.button
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
              title="AI Settings"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={14} />
            </motion.button>
            <motion.button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
              title="Close AI Assistant"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={16} />
            </motion.button>
          </div>
        </motion.div>

        {/* Case Context */}
        {caseData.caseName && (
          <motion.div
            className="p-3 bg-primary/10 border-b border-border"
            variants={itemVariants}
          >
            <p className="text-xs text-muted-foreground">Analyzing Case:</p>
            <p className="text-sm font-semibold text-accent">{caseData.caseName}</p>
            {caseData.caseNumber && (
              <p className="text-xs text-muted-foreground">{caseData.caseNumber}</p>
            )}
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div className="flex border-b border-border" variants={itemVariants}>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={cn(
              "flex-1 py-2 text-xs font-medium transition-colors relative",
              activeTab === 'suggestions' ? "text-accent" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Lightbulb size={14} className="inline mr-1" />
            Suggestions
            {activeTab === 'suggestions' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              "flex-1 py-2 text-xs font-medium transition-colors relative",
              activeTab === 'chat' ? "text-accent" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquare size={14} className="inline mr-1" />
            Chat
            {activeTab === 'chat' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'suggestions' ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 space-y-6"
              >
                {/* Next Steps */}
                <div>
                  <h4 className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wider flex items-center gap-2">
                    <CheckSquare size={12} /> Next Steps
                  </h4>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {nextSteps.map((step) => (
                        <motion.div
                          key={step.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={cn(
                            "p-2 rounded bg-card border transition-colors group",
                            step.priority === 'high' ? 'border-destructive/50' :
                              step.priority === 'medium' ? 'border-accent/50' : 'border-border'
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => toggleStep(step.id)}
                              className="mt-0.5 text-teal-400 hover:text-teal-300"
                            >
                              {step.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                            </button>
                            <div className="flex-1">
                              <p className={cn(
                                "text-xs",
                                step.completed ? "text-muted-foreground line-through" : "text-foreground"
                              )}>
                                {step.text}
                              </p>
                            </div>
                            <button
                              onClick={() => dismissStep(step.id)}
                              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {nextSteps.length === 0 && (
                      <div className="text-xs text-muted-foreground italic text-center py-4">
                        No pending tasks
                      </div>
                    )}
                  </div>
                </div>

                {/* Missing Documents */}
                <div>
                  <h4 className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wider flex items-center gap-2">
                    <AlertCircle size={12} /> Missing Documents
                  </h4>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {missingDocs.map((doc) => (
                        <motion.div
                          key={doc.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-2 rounded bg-accent/10 border border-accent/30 group"
                        >
                          <div className="flex items-start gap-2">
                            <AlertCircle size={14} className="text-accent mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-foreground font-medium">{doc.name}</p>
                              <p className="text-[10px] text-muted-foreground">Referenced in: {doc.referenced}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button className="text-amber-400 hover:text-amber-300 p-1">
                                <Upload size={12} />
                              </button>
                              <button
                                onClick={() => dismissDoc(doc.id)}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {missingDocs.length === 0 && (
                      <div className="flex items-center gap-2 p-3 bg-emerald-900/10 border border-emerald-500/30 rounded">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">All documents present</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Relevant Legal Sections */}
                <div>
                  <h4 className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wider flex items-center gap-2">
                    <BookOpen size={12} /> Relevant Legal Sections
                  </h4>
                  <div className="space-y-2">
                    {legalSections.map((section) => (
                      <motion.button
                        key={section.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="w-full p-2 rounded bg-card border border-border hover:border-primary/50 text-left transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-primary">{section.code}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{section.title}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-[10px] text-primary">{section.relevant}%</div>
                            <ExternalLink size={10} className="text-muted-foreground" />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Similar Cases */}
                <div>
                  <h4 className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wider flex items-center gap-2">
                    <Users size={12} /> Similar Cases
                  </h4>
                  <div className="space-y-2">
                    {similarCases.map((case_) => (
                      <motion.button
                        key={case_.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="w-full p-2 rounded bg-card border border-border hover:border-primary/50 text-left transition-colors"
                      >
                        <p className="text-xs text-foreground font-medium mb-1">{case_.title}</p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span>{case_.replies} replies</span>
                          <span>•</span>
                          <span>{case_.views} views</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Recent Court Orders */}
                <div>
                  <h4 className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wider flex items-center gap-2">
                    <Gavel size={12} /> Recent Court Orders
                  </h4>
                  <div className="space-y-2">
                    {recentOrders.map((order) => (
                      <motion.button
                        key={order.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="w-full p-2 rounded bg-card border border-border hover:border-primary/50 text-left transition-colors"
                      >
                        <p className="text-xs text-foreground font-medium mb-1">{order.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{order.court}</span>
                          <span>•</span>
                          <span>{order.date}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                {/* Quick Questions */}
                <div className="p-4 border-b border-border">
                  <h4 className="text-xs uppercase text-gray-500 font-bold mb-2">Quick Questions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quickQuestions.map((question, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => handleQuickQuestion(question)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-[10px] p-2 bg-card border border-border hover:border-primary/50 rounded text-foreground transition-colors"
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageSquare size={32} className="text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Ask me anything about this case</p>
                    </div>
                  )}

                  {chatMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-2",
                        msg.type === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={cn(
                        "max-w-[85%] rounded-lg p-2",
                        msg.type === 'user'
                          ? "bg-primary/10 border border-primary/20 text-foreground"
                          : "bg-card border border-border text-foreground"
                      )}>
                        <p className="text-xs">{msg.text}</p>
                        {msg.type === 'ai' && (
                          <div className="flex items-center gap-2 mt-2">
                            <button className="text-muted-foreground hover:text-primary transition-colors">
                              <Copy size={10} />
                            </button>
                            <button className="text-muted-foreground hover:text-emerald-500 transition-colors">
                              <ThumbsUp size={10} />
                            </button>
                            <button className="text-muted-foreground hover:text-destructive transition-colors">
                              <ThumbsDown size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <div className="bg-card border border-border rounded-lg p-3">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Input (Always visible) */}
        <motion.div
          className="p-3 bg-background border-t border-border"
          variants={itemVariants}
        >
          <div className="relative mb-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Advyon AI anything..."
              className="w-full bg-card border border-border rounded-md pl-3 pr-20 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <div className="absolute right-2 top-1.5 flex items-center gap-1">
              <motion.button
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Paperclip size={12} />
              </motion.button>
              <motion.button
                onClick={() => handleSendMessage()}
                disabled={!chatInput.trim()}
                className="text-primary hover:text-primary/80 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send size={12} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default AIAssistant;
