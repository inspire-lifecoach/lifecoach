
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Journal from "./pages/Journal";
import PersonaTest from "./pages/PersonaTest";
import PersonaTestResult from "./pages/PersonaTestResult";
import TestResult from "./pages/TestResult";
import Recommendations from "./pages/Recommendations";
import Tests from "./pages/Tests";
import Insights from "./pages/Insights";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./pages/Auth";
import MBTITest from "./pages/MBTITest";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Upgrade from "./pages/Upgrade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/persona-test" element={<PersonaTest />} />
            <Route path="/mbti-test" element={<MBTITest />} />
            <Route path="/test-result/:testType/:personalityType" element={<TestResult />} />
            <Route path="/persona-test-result" element={<PersonaTestResult />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upgrade" element={<Upgrade />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
