
import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  ClipboardList, 
  BookHeart, 
  LineChart, 
  ArrowLeft, 
  User, 
  LogIn,
  LayoutDashboard,
  Crown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if we're on a page that needs a back button
  const showBackButton = 
    !['/', '/tests', '/insights', '/journal', '/recommendations', '/auth', '/dashboard', '/profile', '/upgrade'].includes(location.pathname);

  // Navigation items with tooltips
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ClipboardList, label: "Tests", path: "/tests" },
    { icon: BookHeart, label: "Journal", path: "/journal" },
    { icon: LineChart, label: "Insights", path: "/insights" },
  ];

  // User-specific navigation items
  const userNavItems = user ? [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: User, label: "Profile", path: "/profile" },
  ] : [
    { icon: LogIn, label: "Login", path: "/auth" },
  ];

  return (
    <nav className="w-full py-4 px-4 sm:px-6 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="mr-2"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go back</p>
              </TooltipContent>
            </Tooltip>
          )}
          <h1 
            className="text-xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600"
            onClick={() => navigate('/')}
          >
            PersonaWise
          </h1>
        </div>
        
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(item.path)}
                  aria-label={item.label}
                  className={location.pathname === item.path ? "bg-gray-100 dark:bg-gray-800" : ""}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {/* Premium upgrade button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-yellow-500"
                onClick={() => navigate('/upgrade')}
                aria-label="Upgrade to Premium"
              >
                <Crown className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upgrade to Premium</p>
            </TooltipContent>
          </Tooltip>
          
          {userNavItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(item.path)}
                  aria-label={item.label}
                  className={location.pathname === item.path ? "bg-gray-100 dark:bg-gray-800" : ""}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
