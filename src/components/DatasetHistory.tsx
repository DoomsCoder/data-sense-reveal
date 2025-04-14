
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Download, Loader2, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DatasetHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: datasets, isLoading, error } = useQuery({
    queryKey: ["dataset-history"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('dataset_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const handleViewDataset = (fileName: string) => {
    localStorage.setItem("csvFileName", fileName);
    navigate("/dashboard");
    toast.success(`Loaded dataset: ${fileName}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Dataset History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-deep-green" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Dataset History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading dataset history</p>
        </CardContent>
      </Card>
    );
  }

  if (!datasets || datasets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Dataset History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            You haven't analyzed any datasets yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Dataset History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dataset</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Analyzed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datasets.map((dataset) => (
              <TableRow key={dataset.id}>
                <TableCell className="font-medium">{dataset.file_name}</TableCell>
                <TableCell>{(dataset.file_size / 1024).toFixed(2)} KB</TableCell>
                <TableCell>{formatDistanceToNow(new Date(dataset.created_at), { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mr-2"
                    onClick={() => handleViewDataset(dataset.file_name)}
                  >
                    <BarChart className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DatasetHistory;
