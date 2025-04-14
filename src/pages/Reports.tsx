import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ParsedData } from "@/utils/csvParser";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/visualizations/DataTable";
import { 
  Table, 
  TableRow, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableBody 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  InfoIcon, 
  LayoutGrid, 
  Loader2, 
  Upload 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const Reports = () => {
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
  
  const handleExportCSV = () => {
    if (!data) return;
    
    // Convert data to CSV
    const headers = data.headers.join(',');
    const rows = data.rows.map(row => {
      return data.headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : String(value !== undefined ? value : '');
      }).join(',');
    }).join('\n');
    
    const csv = `${headers}\n${rows}`;
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace('.csv', '')}_export.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV file exported successfully");
  };
  
  const handleExportJSON = () => {
    if (!data) return;
    
    // Create download link
    const blob = new Blob([JSON.stringify(data.rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace('.csv', '')}_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("JSON file exported successfully");
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-deep-green mb-4" />
          <h3 className="text-lg font-medium">Loading reports...</h3>
          <p className="text-muted-foreground">Preparing your data</p>
        </div>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="container mx-auto max-w-6xl py-8">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Unable to load reports</h2>
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
        <h1 className="text-3xl font-bold mb-2">Data Reports</h1>
        <p className="text-muted-foreground">Detailed analysis of {fileName}</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleExportCSV}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </Button>
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleExportJSON}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export as JSON
        </Button>
      </div>
      
      <Tabs defaultValue="table" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Data Table
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            Column Summary
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="mt-0">
          <DataTable data={data.rows} title="Complete Dataset" />
        </TabsContent>
        
        <TabsContent value="summary" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Column Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[70vh]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-[200px]">Column</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Unique Values</TableHead>
                      <TableHead>Missing Values</TableHead>
                      <TableHead>Stats</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(data.summary.columnSummaries).map(([column, info]) => (
                      <TableRow key={column}>
                        <TableCell className="font-medium">{column}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            info.dataType === 'numeric' 
                              ? 'bg-deep-green/10 text-deep-green' 
                              : 'bg-mint/20 text-deep-green'
                          }`}>
                            {info.dataType === 'numeric' ? 'Numeric' : 'Categorical'}
                          </span>
                        </TableCell>
                        <TableCell>{info.uniqueValues}</TableCell>
                        <TableCell>
                          {info.missingValues > 0 ? (
                            <span className="text-amber-500">
                              {info.missingValues} ({((info.missingValues / data.summary.totalRows) * 100).toFixed(1)}%)
                            </span>
                          ) : (
                            "0"
                          )}
                        </TableCell>
                        <TableCell>
                          {info.dataType === 'numeric' ? (
                            <div className="text-xs">
                              <div>Min: {info.min?.toFixed(2)}</div>
                              <div>Max: {info.max?.toFixed(2)}</div>
                              <div>Mean: {info.mean?.toFixed(2)}</div>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
