
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parseCSV, ParsedData } from "@/utils/csvParser";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BarChart from "@/components/visualizations/BarChart";
import PieChart from "@/components/visualizations/PieChart";
import DataTable from "@/components/visualizations/DataTable";
import DataSummary from "@/components/DataSummary";
import DatasetHistory from "@/components/DatasetHistory";
import { Loader2, Upload, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState<string>("");
  const { isAuthenticated, user } = useAuth();
  
  // Get cached data or file from localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    
    const storedFileName = localStorage.getItem("csvFileName");
    if (storedFileName) {
      setFileName(storedFileName);
    }
  }, [navigate, isAuthenticated]);
  
  // Get data from query cache
  const { data, isLoading, error } = useQuery({
    queryKey: ["csvData", fileName],
    queryFn: async () => {
      // Check if we already have the data in cache
      const existingData = queryClient.getQueryData<ParsedData>(["csvData", fileName]);
      if (existingData) return existingData;
      
      // If no data in cache and no redirect was performed, show empty state
      return null;
    },
    enabled: !!fileName && isAuthenticated,
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-deep-green mb-4" />
          <h3 className="text-lg font-medium">Loading your dashboard...</h3>
          <p className="text-muted-foreground">Analyzing your data</p>
        </div>
      </div>
    );
  }

  if (!fileName || error || !data) {
    return (
      <div className="container mx-auto max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="mb-8">
          <DatasetHistory />
        </div>
        
        <Card className="text-center p-8 mb-8">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">No Data Currently Active</h2>
            <p className="text-muted-foreground mb-6">
              Select a dataset from your history above or upload a new CSV file to start analyzing.
            </p>
            <Button onClick={() => navigate("/")} className="bg-deep-green hover:bg-deep-green/90">
              <Upload className="mr-2 h-4 w-4" />
              Upload a CSV File
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Exploring data from {fileName}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4">
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["csvData", fileName] })}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button className="bg-deep-green hover:bg-deep-green/90" onClick={() => navigate("/")}>
            <Upload className="mr-2 h-4 w-4" />
            Upload New File
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <DatasetHistory />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <DataSummary summary={data.summary} fileName={fileName} />
        </div>
        <div className="lg:col-span-2">
          <DataTable data={data.rows} title="Data Preview" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <BarChart data={data.rows} title="Column Distribution" />
        <PieChart data={data.rows} title="Category Breakdown" />
      </div>
    </div>
  );
};

export default Dashboard;
