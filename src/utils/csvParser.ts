
import Papa from 'papaparse';

export interface ParsedData {
  headers: string[];
  rows: Record<string, string | number>[];
  summary: DataSummary;
}

export interface ColumnSummary {
  dataType: 'numeric' | 'categorical' | 'unknown';
  uniqueValues: number;
  missingValues: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
}

export interface DataSummary {
  totalRows: number;
  totalColumns: number;
  columnSummaries: Record<string, ColumnSummary>;
  missingValueColumns: string[];
}

export const parseCSV = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const headers = results.meta.fields || [];
          const rows = results.data as Record<string, string | number>[];
          
          // Generate data summary
          const summary = generateDataSummary(rows, headers);
          
          resolve({
            headers,
            rows,
            summary
          });
        } catch (error) {
          reject(new Error("Failed to process CSV data"));
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const generateDataSummary = (
  rows: Record<string, string | number>[],
  headers: string[]
): DataSummary => {
  const missingValueColumns: string[] = [];
  const columnSummaries: Record<string, ColumnSummary> = {};

  // Process each column
  headers.forEach(header => {
    const values = rows.map(row => row[header]);
    const nonNullValues = values.filter(value => value !== null && value !== undefined && value !== '');
    
    // Determine data type
    const allNumeric = nonNullValues.every(value => typeof value === 'number' || !isNaN(Number(value)));
    const dataType = allNumeric ? 'numeric' : 'categorical';
    
    // Count unique values
    const uniqueValues = new Set(nonNullValues).size;
    
    // Count missing values
    const missingValues = rows.length - nonNullValues.length;
    if (missingValues > 0) {
      missingValueColumns.push(header);
    }
    
    // Calculate statistics for numeric columns
    let min, max, mean, median;
    if (dataType === 'numeric') {
      const numericValues = nonNullValues.map(v => typeof v === 'number' ? v : Number(v));
      min = Math.min(...numericValues);
      max = Math.max(...numericValues);
      mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
      
      // Calculate median
      const sortedValues = [...numericValues].sort((a, b) => a - b);
      const midPoint = Math.floor(sortedValues.length / 2);
      median = sortedValues.length % 2 !== 0
        ? sortedValues[midPoint]
        : (sortedValues[midPoint - 1] + sortedValues[midPoint]) / 2;
    }
    
    columnSummaries[header] = {
      dataType,
      uniqueValues,
      missingValues,
      ...(dataType === 'numeric' ? { min, max, mean, median } : {})
    };
  });

  return {
    totalRows: rows.length,
    totalColumns: headers.length,
    columnSummaries,
    missingValueColumns
  };
};

export const getColumnDataType = (
  data: Record<string, string | number>[],
  columnName: string
): 'numeric' | 'categorical' => {
  const values = data
    .map(row => row[columnName])
    .filter(val => val !== null && val !== undefined && val !== '');
  
  if (values.length === 0) return 'categorical';
  
  // Check if all values are numbers
  const allNumeric = values.every(value => 
    typeof value === 'number' || 
    (typeof value === 'string' && !isNaN(Number(value)))
  );
  
  return allNumeric ? 'numeric' : 'categorical';
};
