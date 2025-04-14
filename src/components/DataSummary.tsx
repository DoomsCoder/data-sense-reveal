
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSummary as DataSummaryType } from "@/utils/csvParser";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, AlertTriangle } from "lucide-react";

interface DataSummaryProps {
  summary: DataSummaryType;
  fileName: string;
}

const DataSummary: React.FC<DataSummaryProps> = ({ summary, fileName }) => {
  const numericColumns = Object.entries(summary.columnSummaries)
    .filter(([_, info]) => info.dataType === 'numeric');
  
  const categoricalColumns = Object.entries(summary.columnSummaries)
    .filter(([_, info]) => info.dataType === 'categorical');
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-deep-green" />
          <CardTitle className="text-lg font-medium">Dataset Overview</CardTitle>
        </div>
        <div className="text-sm text-muted-foreground">
          {fileName}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-background p-4 rounded-md border">
            <div className="text-sm text-muted-foreground mb-1">Rows</div>
            <div className="text-2xl font-semibold">{summary.totalRows}</div>
          </div>
          <div className="bg-background p-4 rounded-md border">
            <div className="text-sm text-muted-foreground mb-1">Columns</div>
            <div className="text-2xl font-semibold">{summary.totalColumns}</div>
          </div>
          <div className="bg-background p-4 rounded-md border">
            <div className="text-sm text-muted-foreground mb-1">Missing Data</div>
            <div className="text-2xl font-semibold">
              {summary.missingValueColumns.length ? (
                <span className="flex items-center text-amber-500">
                  <AlertTriangle className="mr-1 h-5 w-5" />
                  {summary.missingValueColumns.length}
                </span>
              ) : (
                "None"
              )}
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-[300px] pr-4">
          {numericColumns.length > 0 && (
            <>
              <h3 className="text-md font-medium mb-2">Numeric Columns</h3>
              <div className="space-y-3">
                {numericColumns.map(([column, info]) => (
                  <div key={column} className="bg-background p-3 rounded-md border">
                    <div className="font-medium text-sm mb-1">{column}</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div className="text-muted-foreground">Range:</div>
                      <div>{info.min?.toFixed(2)} - {info.max?.toFixed(2)}</div>
                      <div className="text-muted-foreground">Mean:</div>
                      <div>{info.mean?.toFixed(2)}</div>
                      <div className="text-muted-foreground">Median:</div>
                      <div>{info.median?.toFixed(2)}</div>
                      <div className="text-muted-foreground">Missing:</div>
                      <div>{info.missingValues} ({((info.missingValues / summary.totalRows) * 100).toFixed(1)}%)</div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
            </>
          )}
          
          {categoricalColumns.length > 0 && (
            <>
              <h3 className="text-md font-medium mb-2">Categorical Columns</h3>
              <div className="space-y-3">
                {categoricalColumns.map(([column, info]) => (
                  <div key={column} className="bg-background p-3 rounded-md border">
                    <div className="font-medium text-sm mb-1">{column}</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div className="text-muted-foreground">Unique Values:</div>
                      <div>{info.uniqueValues}</div>
                      <div className="text-muted-foreground">Missing:</div>
                      <div>{info.missingValues} ({((info.missingValues / summary.totalRows) * 100).toFixed(1)}%)</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DataSummary;
