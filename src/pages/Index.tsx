
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parseCSV, ParsedData } from "@/utils/csvParser";
import FileUploader from "@/components/FileUploader";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FileSpreadsheet, BarChart2, PieChart, Table, ArrowRight, Database, Zap, Users, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card className="bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Check if we have a previously uploaded file
  useEffect(() => {
    const storedFileName = localStorage.getItem("csvFileName");
    if (storedFileName) {
      // Check if we have data in the query cache
      const cachedData = queryClient.getQueryData<ParsedData>(["csvData", storedFileName]);
      if (cachedData) {
        // We already have data, no need to fetch it again
        console.log("Found cached data for", storedFileName);
      }
    }
  }, [queryClient]);
  
  const { data: parsedData, refetch } = useQuery({
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
    
    // The rest of the logic is now in the FileUploader component
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
  
  const advancedFeatures = [
    {
      icon: <Database className="h-6 w-6 text-deep-green" />,
      title: "Data Storage",
      description: "Your data is securely stored and accessible anytime, allowing for seamless analysis across sessions."
    },
    {
      icon: <Zap className="h-6 w-6 text-deep-green" />,
      title: "Fast Processing",
      description: "Advanced algorithms process even large datasets quickly, giving you results within seconds."
    },
    {
      icon: <Users className="h-6 w-6 text-deep-green" />,
      title: "Team Collaboration",
      description: "Share your insights with teammates and collaborate on data analysis projects."
    },
    {
      icon: <Lock className="h-6 w-6 text-deep-green" />,
      title: "Secure Access",
      description: "Your data is protected with enterprise-grade security and access controls."
    }
  ];

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-12 mt-4">
        <h1 className="text-4xl font-bold mb-4 text-deep-green">Unlock Insights From Your Data</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload any CSV file and instantly generate visualizations and insights. No complex setup required.
        </p>
        
        {!isAuthenticated && (
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild className="bg-deep-green hover:bg-deep-green/90">
              <a href="/signup">Sign up for free</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/login">Log in</a>
            </Button>
          </div>
        )}
      </div>
      
      {isAuthenticated && (
        <div className="bg-white p-8 rounded-lg shadow-sm border mb-12">
          <FileUploader onFileUpload={handleFileUpload} />
        </div>
      )}
      
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
      
      <div className="mb-12 bg-gradient-to-r from-mint/20 to-deep-green/10 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose InsightViz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advancedFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
      
      <div className="text-center mb-16">
        <h2 className="text-2xl font-semibold mb-4">Ready to explore your data?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of data professionals who use InsightViz to extract valuable insights from their data.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {isAuthenticated ? (
            <Button className="bg-deep-green hover:bg-deep-green/90" onClick={() => window.scrollTo(0, 0)}>
              Upload your CSV now
            </Button>
          ) : (
            <>
              <Button asChild className="bg-deep-green hover:bg-deep-green/90">
                <a href="/signup">Get started for free</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/login">Log in to your account</a>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
