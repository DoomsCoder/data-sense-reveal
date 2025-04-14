
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Home, BarChartBig, FileText } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/reports", label: "Reports", icon: FileText }
  ];
  
  return (
    <nav className="h-16 border-b flex items-center px-6 bg-white">
      <div className="flex items-center">
        <BarChartBig className="h-6 w-6 text-deep-green mr-2" />
        <h1 className="text-xl font-semibold text-deep-green">DataSenseReveal</h1>
      </div>
      
      <div className="flex ml-auto space-x-1">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? "default" : "ghost"}
            asChild
            className={location.pathname === item.path ? "bg-mint text-deep-green hover:bg-mint/90" : ""}
          >
            <Link to={item.path} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
