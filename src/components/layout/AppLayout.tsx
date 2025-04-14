
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default AppLayout;
