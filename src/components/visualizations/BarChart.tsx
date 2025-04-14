
import React, { useState, useMemo } from "react";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getColumnDataType } from "@/utils/csvParser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BarChartProps {
  data: Record<string, string | number>[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const columns = useMemo(() => Object.keys(data[0] || {}), [data]);
  
  const categoricalColumns = useMemo(() => 
    columns.filter(col => getColumnDataType(data, col) === 'categorical'),
    [columns, data]
  );
  
  const numericColumns = useMemo(() => 
    columns.filter(col => getColumnDataType(data, col) === 'numeric'),
    [columns, data]
  );
  
  const [xAxis, setXAxis] = useState<string>(categoricalColumns[0] || columns[0]);
  const [yAxis, setYAxis] = useState<string>(numericColumns[0] || columns[1]);
  
  const chartData = useMemo(() => {
    if (!xAxis || !yAxis) return [];
    
    if (getColumnDataType(data, xAxis) === 'categorical') {
      // Count/aggregate values for the category
      const countMap = new Map();
      data.forEach(row => {
        const xValue = String(row[xAxis] || 'N/A');
        const yValue = typeof row[yAxis] === 'number' ? row[yAxis] : 0;
        
        if (countMap.has(xValue)) {
          countMap.set(xValue, countMap.get(xValue) + Number(yValue));
        } else {
          countMap.set(xValue, Number(yValue));
        }
      });
      
      // Convert to chart data format
      return Array.from(countMap.entries()).map(([category, value]) => ({
        [xAxis]: category,
        [yAxis]: value
      }));
    } else {
      // Both are numeric - create bins
      return data.map(row => ({
        [xAxis]: row[xAxis],
        [yAxis]: row[yAxis]
      }));
    }
  }, [data, xAxis, yAxis]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">X-Axis</label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map(column => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Y-Axis</label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map(column => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey={xAxis} 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => typeof value === 'string' && value.length > 10 
                  ? `${value.substring(0, 10)}...` 
                  : value
                }
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis} fill="#379683" name={yAxis} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;
