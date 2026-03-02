import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  FolderOpen,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  Briefcase,
  Tag,
  Calendar,
  File,
  X,
  Grid,
  List,
  Archive,
  RefreshCw,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAllDocuments, archiveDocument, restoreDocument, deleteDocument } from '@/services/documents/documentService';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Category color mapping
const categoryColors = {
  Affidavit: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  Evidence: 'bg-green-500/10 text-green-500 border-green-500/30',
  Contract: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  'Court Filing': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  Correspondence: 'bg-pink-500/10 text-pink-500 border-pink-500/30',
  'Legal Brief': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30',
  Pleading: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
  Discovery: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  Motion: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
  Order: 'bg-teal-500/10 text-teal-500 border-teal-500/30',
  Judgment: 'bg-red-500/10 text-red-500 border-red-500/30',
  Settlement: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  Other: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  Uncategorized: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

// Processing status colors
const statusColors = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30', icon: Clock },
  processing: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30', icon: Loader2 },
  completed: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30', icon: CheckCircle },
  failed: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30', icon: AlertCircle },
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// Format date
const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Document Card Component
const DocumentCard = ({ document, onArchive, onRestore, onDelete }) => {
  const navigate = useNavigate();
  const category = document.aiAnalysis?.documentCategory || 'Uncategorized';
  const categoryStyle = categoryColors[category] || categoryColors.Uncategorized;
  const status = statusColors[document.processingStatus] || statusColors.pending;
  const StatusIcon = status.icon;
  const caseData = document.caseId;
  const isArchived = document.status === 'archived';

  const handleView = () => {
    if (document.id) {
      navigate(`/dashboard/workspace/doc/${document.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className="group relative bg-card border border-border/50 rounded-xl p-4 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
    >
      {/* Status indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {isArchived && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
            <Archive size={10} />
            Archived
          </span>
        )}
        <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border', status.bg, status.text, status.border)}>
          <StatusIcon size={10} className={document.processingStatus === 'processing' ? 'animate-spin' : ''} />
          {document.processingStatus}
        </div>
      </div>

      {/* File icon and name */}
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-accent/10 flex-shrink-0">
          <FileText size={20} className="text-accent" />
        </div>
        <div className="min-w-0 flex-1 pr-24">
          <h3 className="font-semibold text-foreground truncate" title={document.fileName}>
            {document.fileName}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatFileSize(document.fileSize)} • {document.fileType}
          </p>
        </div>
      </div>

      {/* Category badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', categoryStyle)}>
          <Tag size={8} className="inline mr-1" />
          {category}
        </span>
        {document.aiAnalysis?.confidenceScore > 0 && (
          <span className="text-[10px] text-muted-foreground">
            {Math.round(document.aiAnalysis.confidenceScore * 100)}% confidence
          </span>
        )}
      </div>

      {/* Case link */}
      {caseData && (
        <Link
          to={`/dashboard/workspace/${caseData.id}`}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors mb-3"
        >
          <Briefcase size={12} />
          <span className="truncate">{caseData.title || caseData.caseNumber || caseData.id}</span>
        </Link>
      )}

      {/* Upload date */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Calendar size={12} />
        <span>Uploaded {formatDate(document.uploadedAt)}</span>
      </div>

      {/* AI Summary preview */}
      {document.aiAnalysis?.summary && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 italic">
          "{document.aiAnalysis.summary.slice(0, 100)}..."
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleView}
          className="flex-1 h-8 text-xs hover:bg-accent/10 hover:text-accent"
        >
          <Eye size={14} className="mr-1" />
          View
        </Button>
        {document.cloudinaryUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(document.cloudinaryUrl, '_blank')}
            className="flex-1 h-8 text-xs hover:bg-accent/10 hover:text-accent"
          >
            <Download size={14} className="mr-1" />
            Download
          </Button>
        )}

        {/* Three-dot Action Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-secondary">
              <MoreVertical size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 z-50">
            {isArchived ? (
              <DropdownMenuItem onClick={() => onRestore(document)} className="cursor-pointer gap-2">
                <RefreshCw size={14} />
                <span>Unarchive</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onArchive(document)} className="cursor-pointer gap-2">
                <Archive size={14} />
                <span>Archive</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(document)}
              className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground gap-2"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3 bg-card border border-border/50 rounded-xl p-4">
    <div className={cn('p-2 rounded-lg', color)}>
      <Icon size={18} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

// Main Page Component
const MyDocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'archived'
  const [deleteTarget, setDeleteTarget] = useState(null); // document to delete

  // Fetch documents filtered by tab status
  const { data, error, isLoading, mutate } = useAllDocuments({
    category: selectedCategory || undefined,
    processingStatus: selectedStatus || undefined,
    status: activeTab,
  });

  const documents = data?.data?.documents || [];
  const categoryStats = data?.data?.categoryStats || {};
  const total = data?.data?.total || 0;

  // Filter documents by search query
  const filteredDocuments = useMemo(() => {
    if (!searchQuery) return documents;
    const query = searchQuery.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.fileName?.toLowerCase().includes(query) ||
        doc.aiAnalysis?.summary?.toLowerCase().includes(query) ||
        doc.caseId?.title?.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  // Get unique categories for filter
  const categories = Object.keys(categoryStats);

  const hasActiveFilters = selectedCategory || selectedStatus || searchQuery;

  const handleArchive = async (document) => {
    try {
      await archiveDocument(document.id);
      toast.success('Document archived successfully');
      mutate();
    } catch (err) {
      console.error(err);
      toast.error('Failed to archive document');
    }
  };

  const handleRestore = async (document) => {
    try {
      await restoreDocument(document.id);
      toast.success('Document unarchived successfully');
      mutate();
    } catch (err) {
      console.error(err);
      toast.error('Failed to unarchive document');
    }
  };

  const handleDeleteClick = (document) => {
    setDeleteTarget(document);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const caseId = deleteTarget.caseId?.id || deleteTarget.caseId;
      await deleteDocument(caseId, deleteTarget.id);
      toast.success('Document deleted successfully');
      setDeleteTarget(null);
      mutate();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete document');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FolderOpen className="text-accent" size={32} />
              My Documents
            </h1>
            <p className="text-muted-foreground mt-1">
              All your documents across all cases in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className={cn('h-9 px-3', viewMode === 'grid' ? 'text-accent' : '')}
            >
              {viewMode === 'grid' ? <Grid size={18} /> : <List size={18} />}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Active / Archived Tab Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 mb-6 border-b border-border/50"
      >
        <button
          onClick={() => setActiveTab('active')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'active'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <FileText size={14} className="inline mr-1.5" />
          Active
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'archived'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Archive size={14} className="inline mr-1.5" />
          Archived
        </button>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <StatsCard icon={File} label="Total Documents" value={total} color="bg-accent" />
        <StatsCard
          icon={CheckCircle}
          label="AI Analyzed"
          value={categoryStats['Uncategorized'] ? total - (categoryStats['Uncategorized'] || 0) : total}
          color="bg-green-500"
        />
        <StatsCard icon={Tag} label="Categories" value={categories.length} color="bg-purple-500" />
        <StatsCard
          icon={Loader2}
          label="Processing"
          value={documents.filter((d) => d.processingStatus === 'processing').length}
          color="bg-blue-500"
        />
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border/50 rounded-xl p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents by name, summary, or case..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
            />
          </div>

          {/* Filter toggle */}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <Filter size={16} className="mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-5 h-5 bg-accent text-accent-foreground rounded-full text-xs flex items-center justify-center">
                {[selectedCategory, selectedStatus, searchQuery].filter(Boolean).length}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" className="shrink-0 text-muted-foreground">
              <X size={16} className="mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border/50">
                {/* Category filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} ({categoryStats[cat]})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Processing Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
          <p className="text-muted-foreground">Loading your documents...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
          <p className="text-muted-foreground">Failed to load documents. Please try again.</p>
          <Button onClick={() => mutate()} className="mt-4">
            Retry
          </Button>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 bg-card border border-border/50 rounded-xl"
        >
          {activeTab === 'archived' ? (
            <Archive className="w-16 h-16 text-muted-foreground/30 mb-4" />
          ) : (
            <FolderOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
          )}
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {hasActiveFilters ? 'No documents found' : activeTab === 'archived' ? 'No archived documents' : 'No documents yet'}
          </h3>
          <p className="text-muted-foreground text-sm text-center max-w-md">
            {hasActiveFilters
              ? 'No documents match your current filters. Try adjusting your search or filters.'
              : activeTab === 'archived'
              ? 'You have no archived documents. Archive documents from the Active tab.'
              : "You haven't uploaded any documents yet. Upload documents via your case workspace."}
          </p>
          {hasActiveFilters && (
            <Button className="mt-4">
              Clear Filters
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'flex flex-col gap-3'
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id || doc._id}
                document={doc}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDelete={handleDeleteClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Results count */}
      {!isLoading && !error && filteredDocuments.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Showing {filteredDocuments.length} of {total} documents
        </motion.p>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.fileName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyDocumentsPage;
