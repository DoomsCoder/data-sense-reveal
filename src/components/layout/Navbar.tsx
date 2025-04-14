
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Home, 
  BarChartBig, 
  FileText, 
  LogOut, 
  User,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  
  // Get user's name from metadata if available, otherwise use email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  
  const navItems = [
    { path: "/", label: "Home", icon: Home, requiresAuth: false },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, requiresAuth: true },
    { path: "/reports", label: "Reports", icon: FileText, requiresAuth: true }
  ];
  
  const filteredNavItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  return (
    <nav className="h-16 border-b flex items-center px-6 bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <BarChartBig className="h-6 w-6 text-deep-green mr-2" />
        <h1 className="text-xl font-semibold text-deep-green">InsightViz</h1>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex ml-auto space-x-1">
        {filteredNavItems.map((item) => (
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
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative ml-2">
                <User className="h-4 w-4 mr-2" />
                <span className="max-w-[100px] truncate">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-sm">{user?.email}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="text-red-500 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button className="bg-deep-green hover:bg-deep-green/90" asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden ml-auto">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <div className="flex flex-col h-full py-6">
              <div className="flex items-center mb-6">
                <BarChartBig className="h-6 w-6 text-deep-green mr-2" />
                <h1 className="text-xl font-semibold text-deep-green">InsightViz</h1>
              </div>
              
              <div className="flex flex-col space-y-2">
                {filteredNavItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    asChild
                    className={location.pathname === item.path ? "bg-mint text-deep-green hover:bg-mint/90 justify-start" : "justify-start"}
                    onClick={() => setOpen(false)}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
              
              <div className="mt-auto">
                {isAuthenticated ? (
                  <>
                    <div className="p-4 border rounded-md mb-4">
                      <div className="font-medium truncate">{userName}</div>
                      <div className="text-sm text-muted-foreground truncate">{user?.email}</div>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" asChild onClick={() => setOpen(false)}>
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button className="bg-deep-green hover:bg-deep-green/90" asChild onClick={() => setOpen(false)}>
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
