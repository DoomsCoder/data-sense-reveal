
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
import { Loader2, Upload } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState<string>("");
  
  // Get cached data or file from localStorage
  useEffect(() => {
    const storedFileName = localStorage.getItem("csvFileName");
    if (storedFileName) {
      setFileName(storedFileName);
    } else {
      // No filename in localStorage, redirect to home
      toast.error("Please upload a CSV file first");
      navigate("/");
    }
  }, [navigate]);
  
  // Get data from query cache
  const { data, isLoading, error } = useQuery({
    queryKey: ["csvData", fileName],
    queryFn: async () => {
      // Check if we already have the data in cache
      const existingData = queryClient.getQueryData<ParsedData>(["csvData", fileName]);
      if (existingData) return existingData;
      
      // If no data in cache but we have filename, show error and redirect
      toast.error("Session expired. Please upload your file again.");
      navigate("/");
      return null;
    },
    enabled: !!fileName,
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
  
  if (error || !data) {
    return (
      <div className="container mx-auto max-w-6xl py-8">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Unable to load dashboard</h2>
            <p className="text-muted-foreground mb-6">
              There was an error processing your file or no file has been uploaded.
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Exploring data from {fileName}</p>
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
