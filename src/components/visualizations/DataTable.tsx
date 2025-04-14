
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Search } from "lucide-react";

interface DataTableProps {
  data: Record<string, string | number>[];
  title: string;
}

const DataTable: React.FC<DataTableProps> = ({ data, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;
  
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  
  const filteredData = data.filter(row => 
    Object.values(row).some(
      val => String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex items-center w-1/3 relative">
            <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search data..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow>
                  {columns.map(column => (
                    <TableHead key={column} className="font-medium">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map(column => (
                        <TableCell key={`${rowIndex}-${column}`}>
                          {String(row[column] !== null && row[column] !== undefined ? row[column] : '-')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground">
                      {searchQuery ? "No results found" : "No data available"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {filteredData.length > pageSize && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;
