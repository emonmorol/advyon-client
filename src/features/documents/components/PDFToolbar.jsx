import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  RotateCw,
  Maximize2
} from 'lucide-react';

/**
 * PDFToolbar - Toolbar for PDF controls
 * @param {number} zoom - Current zoom level (1 = 100%)
 * @param {number} page - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {function} onZoom - Callback for zoom changes
 * @param {function} onPageChange - Callback for page changes
 * @param {function} onSearch - Callback for search
 * @param {function} onRotate - Callback for rotation
 * @param {function} onFitToWidth - Callback for fit to width
 */
const PDFToolbar = ({ 
  zoom = 1, 
  page = 1, 
  totalPages = 1, 
  onZoom, 
  onPageChange,
  onSearch,
  onRotate,
  onFitToWidth
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleZoomIn = () => {
    if (onZoom && zoom < 3) {
      onZoom(Math.min(zoom + 0.25, 3));
    }
  };

  const handleZoomOut = () => {
    if (onZoom && zoom > 0.25) {
      onZoom(Math.max(zoom - 0.25, 0.25));
    }
  };

  const handlePrevPage = () => {
    if (onPageChange && page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (onPageChange && page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handlePageInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= totalPages && onPageChange) {
      onPageChange(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border rounded-t-lg">
      {/* Left Section - Page Navigation */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePrevPage}
          disabled={page <= 1}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={page}
            onChange={handlePageInput}
            className="w-12 h-8 text-center text-sm bg-muted border-border"
          />
          <span className="text-sm text-muted-foreground hidden sm:inline">/ {totalPages}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNextPage}
          disabled={page >= totalPages}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Center Section - Zoom Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleZoomOut}
          disabled={zoom <= 0.25}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted hidden sm:flex"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <span className="text-sm font-medium text-foreground min-w-[3rem] sm:min-w-[4rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted hidden sm:flex"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1 sm:mx-2 hidden sm:block" />

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onFitToWidth}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          title="Fit to width"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRotate}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted hidden sm:flex"
          title="Rotate"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Right Section - Search */}
      <div className="flex items-center gap-2 hidden lg:flex">
        {showSearch ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-32 lg:w-48 h-8 text-sm bg-muted border-border"
              autoFocus
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSearch(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PDFToolbar;
