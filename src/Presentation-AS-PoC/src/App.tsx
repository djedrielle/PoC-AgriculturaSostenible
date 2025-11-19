import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FarmerTokenize from "./pages/farmer/Tokenize";
import FarmerValidation from "./pages/farmer/Validation";
import FarmerAnalytics from "./pages/farmer/Analytics";
import InvestorMarket from "./pages/investor/Market";
import InvestorWallet from "./pages/investor/Wallet";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Farmer Routes */}
          <Route path="/farmer/tokenize" element={<Layout><FarmerTokenize /></Layout>} />
          <Route path="/farmer/validation" element={<Layout><FarmerValidation /></Layout>} />
          <Route path="/farmer/analytics" element={<Layout><FarmerAnalytics /></Layout>} />
          
          {/* Investor Routes */}
          <Route path="/investor/market" element={<Layout><InvestorMarket /></Layout>} />
          <Route path="/investor/wallet" element={<Layout><InvestorWallet /></Layout>} />
          
          {/* Auth Route */}
          <Route path="/login" element={<Login />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
