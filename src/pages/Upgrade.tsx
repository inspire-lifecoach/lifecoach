
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ArrowLeft, CreditCard, Calendar, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const premiumFeatures = [
  "All personality tests with detailed analysis",
  "Compatibility reports for relationships",
  "Career path recommendations",
  "Weekly personalized insights",
  "Exclusive journal analysis tools",
  "Priority support",
  "Ad-free experience"
];

const Upgrade = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState(false);
  
  // Mock form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Upgrade Successful",
        description: "Welcome to PersonaWise Premium! Enjoy your new benefits.",
      });
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Upgrade to Premium</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Unlock all features and take your self-discovery journey to the next level
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Features */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Premium Features</CardTitle>
                <CardDescription>Everything you get with your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column: Payment */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Plan</CardTitle>
                <CardDescription>Select a billing period that works for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="monthly" onValueChange={(value) => setBillingPeriod(value as "monthly" | "annual")}>
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="monthly" className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-center">
                      <div className="text-3xl font-bold">$9.99<span className="text-lg font-normal text-gray-500">/month</span></div>
                      <p className="text-sm text-gray-500 mt-1">Billed monthly</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="annual" className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-center">
                      <div className="text-3xl font-bold">$95.88<span className="text-lg font-normal text-gray-500">/year</span></div>
                      <p className="text-sm text-gray-500 mt-1">$7.99/month, billed annually</p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                      <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <div className="relative">
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          required
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          required
                        />
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : `Subscribe for ${billingPeriod === "monthly" ? "$9.99/month" : "$95.88/year"}`}
                  </Button>
                </form>
                
                <div className="text-center text-sm text-gray-500">
                  <p>Your subscription will automatically renew. Cancel anytime.</p>
                  <p className="mt-1">We use secure encryption to protect your payment information.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
