
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Personality Analysis",
    description: "Take popular tests like Myers-Briggs, Big Five, and Enneagram to discover your true self",
    icon: "🧠"
  },
  {
    title: "Relationship Coaching",
    description: "Get personalized advice for dating, conflict resolution, and social skills",
    icon: "💞"
  },
  {
    title: "Career Guidance",
    description: "Find the best career paths and productivity strategies for your personality type",
    icon: "💼"
  },
  {
    title: "Financial Mindset",
    description: "Understand your spending habits and receive tailored money management plans",
    icon: "💰"
  },
  {
    title: "Mental Well-being",
    description: "Improve emotional intelligence and discover your life purpose through AI coaching",
    icon: "🧘"
  },
  {
    title: "Personal Growth",
    description: "Track progress with personalized challenges and connect with like-minded people",
    icon: "🌱"
  }
];

const testimonials = [
  {
    quote: "PersonaWise helped me understand why I approach relationships the way I do. The advice is spot-on!",
    author: "Emma T., INFJ"
  },
  {
    quote: "The career suggestions matched my personality perfectly. I finally feel like I'm on the right path.",
    author: "Marcus L., Type 3 Enneagram"
  },
  {
    quote: "The financial insights helped me recognize my spending triggers. I've saved more in 3 months than the whole last year!",
    author: "Sophia R., Big Five Conscientious"
  }
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 to-blue-700/20 animate-gradient-x"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32 flex flex-col items-center text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
            PersonaWise
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-700 dark:text-gray-300">
            Your AI-Powered Life Coach & Advisor. Discover your personality, improve relationships, advance your career, and find your purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              onClick={() => navigate("/tests")}
            >
              Take a Personality Test
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/insights")}
            >
              Explore Insights
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How PersonaWise Helps You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-4">
                    <Card className="border-none shadow-md bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-gray-850">
                      <CardContent className="pt-10 pb-10 text-center">
                        <blockquote className="text-xl italic text-gray-700 dark:text-gray-300 mb-4">
                          "{testimonial.quote}"
                        </blockquote>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{testimonial.author}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <CarouselPrevious className="static transform-none mx-1" />
              <CarouselNext className="static transform-none mx-1" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unlock Your Full Potential</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Upgrade to Premium for advanced insights and personalized coaching
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-3xl font-bold">$0</div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {["Basic personality tests", "Limited insights", "Public community access"].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Current Plan</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-2 border-violet-500 dark:border-violet-400 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <div className="text-3xl font-bold">$9.99<span className="text-base font-normal">/month</span></div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {[
                    "All personality tests", 
                    "In-depth analysis & insights", 
                    "Relationship compatibility", 
                    "Career roadmaps", 
                    "Financial planning",
                    "AI-powered journaling"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  Upgrade Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Begin Your Self-Discovery Journey</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Unlock insights about your personality and receive tailored advice for every aspect of your life.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-indigo-700 hover:bg-gray-100"
            onClick={() => navigate("/tests")}
          >
            Start Your First Test
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
