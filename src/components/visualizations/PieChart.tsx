
import React, { useState, useMemo } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getColumnDataType } from "@/utils/csvParser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PieChartProps {
  data: Record<string, string | number>[];
  title: string;
}

const COLORS = ["#379683", "#8ee3c1", "#5CDB95", "#a3e9d5", "#A8E6CF", "#d9f5ec"];

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const columns = useMemo(() => Object.keys(data[0] || {}), [data]);
  
  const categoricalColumns = useMemo(() => 
    columns.filter(col => getColumnDataType(data, col) === 'categorical'),
    [columns, data]
  );
  
  const [selectedColumn, setSelectedColumn] = useState<string>(categoricalColumns[0] || columns[0]);
  
  const chartData = useMemo(() => {
    if (!selectedColumn) return [];
    
    // Count occurrences of each category
    const counts: Record<string, number> = {};
    
    data.forEach(row => {
      const value = String(row[selectedColumn] || 'N/A');
      counts[value] = (counts[value] || 0) + 1;
    });
    
    // Convert to chart data format
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      // Limit to top 5 categories + "Other" if there are more
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [data, selectedColumn]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="mt-2">
          <label className="text-sm text-muted-foreground mb-1 block">Category</label>
          <Select value={selectedColumn} onValueChange={setSelectedColumn}>
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
      </CardHeader>
      <CardContent>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} items`, selectedColumn]} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChart;
