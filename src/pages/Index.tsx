
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseCSV, ParsedData } from "@/utils/csvParser";
import FileUploader from "@/components/FileUploader";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FileSpreadsheet, BarChart2, PieChart, Table, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card className="bg-white">
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-full bg-mint/20 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { data: parsedData, isLoading, refetch } = useQuery({
    queryKey: ["csvData", selectedFile?.name],
    queryFn: async () => {
      if (!selectedFile) return null;
      try {
        return await parseCSV(selectedFile);
      } catch (error) {
        toast.error("Failed to parse CSV file");
        return null;
      }
    },
    enabled: !!selectedFile,
  });
  
  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    
    // Store file reference in localStorage (just the name, not the file itself)
    localStorage.setItem("csvFileName", file.name);
    
    // Refetch data with the new file
    await refetch();
    
    // After data is loaded, navigate to dashboard
    if (parsedData) {
      navigate("/dashboard");
    }
  };

  const features = [
    {
      icon: <BarChart2 className="h-6 w-6 text-deep-green" />,
      title: "Visual Insights",
      description: "Automatically generates charts and graphs that highlight key trends in your data."
    },
    {
      icon: <PieChart className="h-6 w-6 text-deep-green" />,
      title: "Distribution Analysis",
      description: "Understand categorical data through intuitive pie charts and distribution visualizations."
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6 text-deep-green" />,
      title: "Data Profiling",
      description: "Get summaries of column types, missing values, outliers, and basic statistics."
    },
    {
      icon: <Table className="h-6 w-6 text-deep-green" />,
      title: "Interactive Tables",
      description: "View and search through your data with an intuitive tabular interface."
    }
  ];

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-12 mt-4">
        <h1 className="text-4xl font-bold mb-4 text-deep-green">Unlock Insights From Your Data</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload any CSV file and instantly generate visualizations and insights. No complex setup required.
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border mb-12">
        <FileUploader onFileUpload={handleFileUpload} />
      </div>
      
      {parsedData && (
        <div className="bg-mint/10 p-6 rounded-lg border border-mint animate-fade-in mb-12">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-xl font-medium text-deep-green">File successfully processed!</h3>
              <p className="text-muted-foreground">
                {parsedData.summary.totalRows} rows × {parsedData.summary.totalColumns} columns
              </p>
            </div>
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="bg-deep-green hover:bg-deep-green/90"
            >
              <span>View Dashboard</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
