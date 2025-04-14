
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, X, FileSpreadsheet, ArrowRight } from "lucide-react";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      
      // Check if file is CSV
      if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        toast.error("Please upload a CSV file.");
        return;
      }
      
      setSelectedFile(file);
      toast.success(`File "${file.name}" selected.`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleAnalyzeFile = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer text-center ${
            isDragActive ? "file-drop-active" : "border-muted-foreground/25"
          }`}
        >
          <input {...getInputProps()} />
          <div className="mx-auto flex flex-col items-center max-w-md">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">
              {isDragActive ? "Drop your CSV file here" : "Upload a CSV file"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your file here or click to browse
            </p>
            <Button type="button" variant="outline">
              Select CSV File
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FileSpreadsheet className="h-10 w-10 text-deep-green mr-3" />
              <div>
                <h3 className="font-medium truncate">{selectedFile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClearFile}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Button 
            onClick={handleAnalyzeFile} 
            className="w-full bg-deep-green hover:bg-deep-green/90"
          >
            <span>Analyze Data</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
