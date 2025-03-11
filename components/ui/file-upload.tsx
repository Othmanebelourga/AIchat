"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { FileIcon, X } from "lucide-react";
import { Button } from "./button";
import dynamic from "next/dynamic";

// Dynamically import the UploadIcon to prevent hydration issues
const UploadIcon = dynamic(() => import("lucide-react").then((mod) => mod.Upload), {
  ssr: false,
  loading: () => <div className="h-4 w-4" />
});

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
  selectedFiles?: File[];
  onFileRemove?: (file: File) => void;
}

export function FileUpload({
  onFilesSelected,
  acceptedFileTypes = ".pdf",
  maxFiles = 5,
  maxSize = 10, // 10MB default
  className,
  selectedFiles = [],
  onFileRemove,
  ...props
}: FileUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const filesArray = Array.from(files);
    const validFiles = filesArray.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
    
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleButtonClick}
          className="flex items-center gap-2"
        >
          <UploadIcon className="h-4 w-4" />
          Upload PDF
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          multiple={maxFiles > 1}
          className="hidden"
          {...props}
        />
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div 
              key={`${file.name}-${index}`} 
              className="flex items-center gap-2 text-sm p-2 bg-muted rounded-md"
            >
              <FileIcon className="h-4 w-4 text-blue-500" />
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)}MB
              </span>
              {onFileRemove && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => onFileRemove(file)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 