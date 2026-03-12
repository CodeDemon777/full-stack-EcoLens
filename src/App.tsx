import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/Overview";
import Emissions from "./pages/Emissions";
import ScopeAnalysis from "./pages/ScopeAnalysis";
import Predictions from "./pages/Predictions";
import Recommendations from "./pages/Recommendations";
import Reports from "./pages/Reports";
import DigitalTwin from "./pages/DigitalTwin";
import OrganizationAnalyzer from "./pages/OrganizationAnalyzer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="emissions" element={<Emissions />} />
            <Route path="scope" element={<ScopeAnalysis />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="organization-analyzer" element={<OrganizationAnalyzer />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="reports" element={<Reports />} />
            <Route path="twin" element={<DigitalTwin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
