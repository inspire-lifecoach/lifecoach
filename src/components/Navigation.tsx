
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
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if we're on a page that needs a back button
  const showBackButton = 
    !['/', '/tests', '/insights', '/journal', '/recommendations', '/auth', '/dashboard', '/profile'].includes(location.pathname);

  return (
    <nav className="w-full py-4 px-4 sm:px-6 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 
            className="text-xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600"
            onClick={() => navigate('/')}
          >
            PersonaWise
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            aria-label="Home"
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/tests')}
            aria-label="Tests"
          >
            <ClipboardList className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/journal')}
            aria-label="Journal"
          >
            <BookHeart className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/insights')}
            aria-label="Insights"
          >
            <LineChart className="h-5 w-5" />
          </Button>
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/dashboard')}
                aria-label="Dashboard"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/profile')}
                aria-label="Profile"
              >
                <User className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/auth')}
              aria-label="Login"
            >
              <LogIn className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
