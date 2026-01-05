import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, Brain, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSmartUpload } from '@/hooks/useSmartUpload';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * SmartFileUploader - A document upload component with AI analysis visualization
 * 
 * Features:
 * - Drag-and-drop file upload with react-dropzone
 * - Real-time upload progress
 * - Animated AI analysis state with breathing brain icon
 * - Success state showing document category and confidence score
 * 
 * @param {object} props
 * @param {string} props.caseId - The case ID for document upload
 * @param {function} props.onUploadComplete - Callback when upload and analysis completes
 * @param {string} props.className - Additional CSS classes
 * @param {object} props.acceptedFileTypes - MIME types to accept
 */
export const SmartFileUploader = ({
  caseId,
  folderName,
  onUploadComplete,
  className,
  acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
}) => {
  const {
    upload,
    isUploading,
    uploadProgress,
    status,
    analysisResult,
    error,
    reset,
  } = useSmartUpload(caseId);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      upload({ file: acceptedFiles[0], folderName });
    }
  }, [upload, folderName]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: false,
    disabled: status !== 'idle',
  });

  // Notify parent on completion
  useEffect(() => {
    if (status === 'completed' && analysisResult && onUploadComplete) {
      onUploadComplete({
        documentCategory: analysisResult.documentCategory,
        confidenceScore: analysisResult.confidenceScore,
      });
    }
  }, [status, analysisResult, onUploadComplete]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {/* IDLE STATE */}
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                {...getRootProps()}
                className={cn(
                  'relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200',
                  'hover:scale-[1.02] hover:border-primary hover:bg-secondary/50',
                  isDragActive && !isDragReject && 'scale-[1.02] border-primary bg-secondary/50',
                  isDragReject && 'border-destructive bg-destructive/10',
                  'border-border bg-card'
                )}
              >
                <input {...getInputProps()} />
                
                <motion.div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <CloudUpload className="h-8 w-8 text-primary" />
                </motion.div>
                
                <h3 className="mb-2 font-sans text-lg font-semibold text-foreground">
                  {isDragActive ? 'Drop your document here' : 'Upload Document'}
                </h3>
                
                <p className="mb-4 text-sm text-muted-foreground">
                  Drag & drop your file here, or click to browse
                </p>
                
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOC, DOCX
                </p>
              </div>
            </motion.div>
          )}

          {/* UPLOADING STATE */}
          {status === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="py-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="mb-4 font-sans text-lg font-semibold text-foreground">
                Uploading Document...
              </h3>
              
              {/* Progress Bar */}
              <div className="mx-auto max-w-xs">
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-teal-bright"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {uploadProgress}% complete
                </p>
              </div>
            </motion.div>
          )}

          {/* ANALYZING STATE - The "Wow" moment */}
          {status === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="py-8 text-center"
            >
              {/* Pulsing Brain Icon with Breathing Animation */}
              <div className="relative mx-auto mb-6 h-20 w-20">
                {/* Glow rings */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-accent/20 to-teal-bright/20"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full bg-gradient-to-r from-teal-accent/30 to-teal-bright/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.3, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.2,
                  }}
                />
                
                {/* Brain icon with breathing effect */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-accent"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Brain className="h-10 w-10 text-primary-foreground" />
                </motion.div>
              </div>
              
              <h3 className="mb-2 font-sans text-lg font-semibold text-foreground">
                AI is reading your document...
              </h3>
              
              {/* Shimmer text effect */}
              <motion.p
                className="text-sm text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                Analyzing content and extracting insights
              </motion.p>
            </motion.div>
          )}

          {/* SUCCESS STATE */}
          {status === 'completed' && analysisResult && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 20 
              }}
              className="py-6 text-center"
            >
              {/* Success Icon */}
              <motion.div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
              >
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </motion.div>
              
              <h3 className="mb-4 font-sans text-lg font-semibold text-foreground">
                Analysis Complete!
              </h3>
              
              {/* Category Badge */}
              <motion.div
                className="mb-4 flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  <FileText className="h-4 w-4" />
                  {analysisResult.documentCategory}
                </span>
              </motion.div>
              
              {/* Confidence Score */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-muted-foreground">
                  Confidence Score
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(analysisResult.confidenceScore * 100)}%
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    confident
                  </span>
                </p>
              </motion.div>
              
              {/* Upload Another Button */}
              <Button
                variant="outline"
                onClick={reset}
                className="gap-2"
              >
                <CloudUpload className="h-4 w-4" />
                Upload Another
              </Button>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {status === 'failed' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="py-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              
              <h3 className="mb-2 font-sans text-lg font-semibold text-foreground">
                Upload Failed
              </h3>
              
              <p className="mb-6 text-sm text-muted-foreground">
                {error?.message || 'An unexpected error occurred'}
              </p>
              
              <Button
                variant="outline"
                onClick={reset}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SmartFileUploader;
