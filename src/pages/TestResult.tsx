
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Share, Download, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// These components would be in separate files in a real application
// Let's define the props for our components
interface PersonalityDescriptionProps {
  personalityType: string;
  testType: string;
}

const PersonalityDescription = ({ personalityType, testType }: PersonalityDescriptionProps) => {
  // This would be more detailed in a real application
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">About {personalityType}</h3>
      <p className="text-gray-700 dark:text-gray-300">
        {getPersonalityDescription(personalityType, testType)}
      </p>
    </div>
  );
};

interface PersonalityTraitsProps {
  personalityType: string;
  testType: string;
}

const PersonalityTraits = ({ personalityType, testType }: PersonalityTraitsProps) => {
  const traits = getPersonalityTraits(personalityType, testType);
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Key Traits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {traits.map((trait, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
            <span>{trait}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getPersonalityTraits = (personalityType: string, testType: string) => {
  if (testType === "mbti") {
    const mbtiTraits: Record<string, string[]> = {
      'INTJ': ['Strategic', 'Independent', 'Decisive', 'Innovative', 'Private', 'Analytical', 'Reserved', 'Curious'],
      'INTP': ['Logical', 'Conceptual', 'Precise', 'Independent', 'Curious', 'Theoretical', 'Abstract', 'Detached'],
      'ENTJ': ['Efficient', 'Energetic', 'Strategic', 'Logical', 'Decisive', 'Ambitious', 'Assertive', 'Confident'],
      'ENTP': ['Inventive', 'Enthusiastic', 'Strategic', 'Versatile', 'Analytical', 'Theoretical', 'Original', 'Challenging'],
      'INFJ': ['Insightful', 'Principled', 'Idealistic', 'Complex', 'Deep', 'Creative', 'Empathetic', 'Visionary'],
      'INFP': ['Idealistic', 'Empathetic', 'Creative', 'Harmonious', 'Devoted', 'Curious', 'Reserved', 'Adaptable'],
      'ENFJ': ['Charismatic', 'Inspiring', 'Idealistic', 'Expressive', 'Persuasive', 'Diplomatic', 'Warm', 'Responsible'],
      'ENFP': ['Enthusiastic', 'Creative', 'Spontaneous', 'Energetic', 'Warm', 'Independent', 'Empathetic', 'Curious'],
      'ISTJ': ['Organized', 'Reliable', 'Practical', 'Logical', 'Dutiful', 'Structured', 'Responsible', 'Traditional'],
      'ISFJ': ['Warm', 'Considerate', 'Organized', 'Detailed', 'Loyal', 'Traditional', 'Practical', 'Supportive'],
      'ESTJ': ['Practical', 'Dependable', 'Efficient', 'Structured', 'Logical', 'Decisive', 'Traditional', 'Results-oriented'],
      'ESFJ': ['Supportive', 'Conscientious', 'Cooperative', 'Practical', 'Warm', 'Traditional', 'Loyal', 'Organized'],
      'ISTP': ['Analytical', 'Practical', 'Objective', 'Independent', 'Adaptable', 'Action-oriented', 'Logical', 'Spontaneous'],
      'ISFP': ['Gentle', 'Sensitive', 'Nurturing', 'Artistic', 'Peaceful', 'Warm', 'Adaptable', 'Present-focused'],
      'ESTP': ['Energetic', 'Action-oriented', 'Adaptable', 'Straightforward', 'Resourceful', 'Practical', 'Realistic', 'Spontaneous'],
      'ESFP': ['Enthusiastic', 'Friendly', 'Spontaneous', 'Energetic', 'Fun-loving', 'Cooperative', 'Practical', 'Present-oriented'],
      // Default set of traits if nothing matches
      'default': ['Analytical', 'Creative', 'Practical', 'Independent', 'Adaptable', 'Communicative', 'Detail-oriented', 'Big-picture thinker']
    };
    return mbtiTraits[personalityType] || mbtiTraits['default'];
  } else if (testType === "enneagram") {
    const enneagramTraits: Record<string, string[]> = {
      'Type 1': ['Principled', 'Purposeful', 'Self-controlled', 'Perfectionistic', 'Ethical', 'Organized', 'Rational', 'Improvement-oriented'],
      'Type 2': ['Caring', 'Interpersonal', 'Empathetic', 'Generous', 'People-pleasing', 'Possessive', 'Demonstrative', 'Helpful'],
      'Type 3': ['Success-oriented', 'Pragmatic', 'Adaptive', 'Ambitious', 'Image-conscious', 'Competitive', 'Efficient', 'Driven'],
      'Type 4': ['Self-aware', 'Expressive', 'Creative', 'Individualistic', 'Introspective', 'Aesthetic', 'Emotional', 'Authentic'],
      'Type 5': ['Analytical', 'Perceptive', 'Innovative', 'Isolated', 'Cerebral', 'Private', 'Independent', 'Knowledge-seeking'],
      'Type 6': ['Committed', 'Security-oriented', 'Loyal', 'Responsible', 'Cautious', 'Vigilant', 'Skeptical', 'Protective'],
      'Type 7': ['Enthusiastic', 'Versatile', 'Spontaneous', 'Productive', 'Optimistic', 'Scattered', 'Future-oriented', 'Adventurous'],
      'Type 8': ['Powerful', 'Decisive', 'Self-confident', 'Strong', 'Confrontational', 'Protective', 'Direct', 'Controlling'],
      'Type 9': ['Easygoing', 'Self-effacing', 'Accepting', 'Harmonious', 'Complacent', 'Reassuring', 'Agreeable', 'Peaceful'],
      // Default set of traits if nothing matches
      'default': ['Introspective', 'Self-aware', 'Growth-oriented', 'Adaptive', 'Resilient', 'Intuitive', 'Responsive', 'Self-motivated']
    };
    return enneagramTraits[personalityType] || enneagramTraits['default'];
  } else {
    // For Big Five or any other test type
    return ['Analytical', 'Creative', 'Practical', 'Independent', 'Adaptable', 'Communicative', 'Detail-oriented', 'Big-picture thinker'];
  }
};

const getPersonalityDescription = (personalityType: string, testType: string) => {
  if (testType === "mbti") {
    const mbtiDescriptions: Record<string, string> = {
      'INTJ': 'The Architect: Strategic, independent, and innovative with a drive to turn theories into plans.',
      'INTP': 'The Logician: Inventive, logical, and precise with a thirst for knowledge and analysis.',
      'ENTJ': 'The Commander: Efficient, energetic, and strategic with natural leadership abilities.',
      'ENTP': 'The Debater: Quick-thinking, curious, and intellectually adaptable with a love for ideas.',
      'INFJ': 'The Advocate: Insightful, principled, and creative with a focus on helping others.',
      'INFP': 'The Mediator: Idealistic, empathetic, and creative with strong personal values.',
      'ENFJ': 'The Protagonist: Charismatic, inspiring, and empathetic, focused on others\' growth.',
      'ENFP': 'The Campaigner: Enthusiastic, creative, and people-oriented with a love for possibilities.',
      'ISTJ': 'The Logistician: Practical, fact-minded, and reliable with a strong sense of duty.',
      'ISFJ': 'The Defender: Dedicated, warm, and protective with a desire to serve others.',
      'ESTJ': 'The Executive: Practical, traditional, and organized with a focus on getting things done.',
      'ESFJ': 'The Consul: Caring, social, and organized with a focus on harmony and cooperation.',
      'ISTP': 'The Virtuoso: Practical, logical, and precise with mastery of tools and mechanics.',
      'ISFP': 'The Adventurer: Flexible, artistic, and sensitive with a spontaneous approach to life.',
      'ESTP': 'The Entrepreneur: Energetic, action-oriented, and smart with an eye for opportunity.',
      'ESFP': 'The Entertainer: Spontaneous, energetic, and enthusiastic with a love for the spotlight.'
    };
    return mbtiDescriptions[personalityType] || `Description for ${personalityType} not available.`;
  } else if (testType === "enneagram") {
    const enneagramDescriptions: Record<string, string> = {
      'Type 1': 'The Reformer: Principled, purposeful, and self-controlled with a fear of corruption.',
      'Type 2': 'The Helper: Caring, interpersonal, and generous with a need to be needed.',
      'Type 3': 'The Achiever: Success-oriented, pragmatic, and adaptive with a drive for achievement.',
      'Type 4': 'The Individualist: Self-aware, expressive, and creative with a desire for uniqueness.',
      'Type 5': 'The Investigator: Innovative, perceptive, and analytical with a thirst for knowledge.',
      'Type 6': 'The Loyalist: Committed, security-oriented, and responsible with a fear of abandonment.',
      'Type 7': 'The Enthusiast: Versatile, spontaneous, and productive with a fear of missing out.',
      'Type 8': 'The Challenger: Powerful, dominating, and self-confident with a need for control.',
      'Type 9': 'The Peacemaker: Easygoing, self-effacing, and accepting with a desire for harmony.'
    };
    return enneagramDescriptions[personalityType] || `Description for ${personalityType} not available.`;
  } else {
    // For Big Five or any other test type
    return `Detailed description for ${personalityType} will appear here.`;
  }
};

const TestResult = () => {
  const { testType = "", personalityType = "" } = useParams();
  const navigate = useNavigate();
  
  const formattedTestType = testType.charAt(0).toUpperCase() + testType.slice(1);
  
  // Handle share functionality
  const handleShare = () => {
    // In a real app, implement proper sharing
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share your results with others",
    });
  };
  
  // Handle download functionality
  const handleDownload = () => {
    // In a real app, implement proper PDF generation
    toast({
      title: "Download started",
      description: "Your results are being prepared for download",
    });
  };
  
  // Handle recommendations
  const handleRecommendations = () => {
    navigate("/recommendations");
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
          Back to Test
        </Button>
        
        <Card className="mb-6">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-2xl">{formattedTestType} Test Results</CardTitle>
              <CardDescription>Your personality type is <span className="font-bold text-indigo-600 dark:text-indigo-400">{personalityType}</span></CardDescription>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <PersonalityDescription personalityType={personalityType} testType={testType} />
            
            {/* Trait breakdown with visual indicators */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Trait Breakdown</h3>
              {testType === "mbti" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Introversion (I)</span>
                      <span>Extraversion (E)</span>
                    </div>
                    <Progress value={personalityType.includes("E") ? 75 : 25} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sensing (S)</span>
                      <span>Intuition (N)</span>
                    </div>
                    <Progress value={personalityType.includes("N") ? 75 : 25} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Thinking (T)</span>
                      <span>Feeling (F)</span>
                    </div>
                    <Progress value={personalityType.includes("F") ? 75 : 25} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Judging (J)</span>
                      <span>Perceiving (P)</span>
                    </div>
                    <Progress value={personalityType.includes("P") ? 75 : 25} className="h-2" />
                  </div>
                </div>
              )}
            </div>
            
            <PersonalityTraits personalityType={personalityType} testType={testType} />
          </CardContent>
          <CardFooter>
            <Button onClick={handleRecommendations} className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              Get Personalized Recommendations
            </Button>
          </CardFooter>
        </Card>
        
        {/* Upgrade prompt */}
        <Card className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/40 dark:to-indigo-900/40 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="text-xl">Want more detailed insights?</CardTitle>
            <CardDescription>
              Upgrade to Premium for in-depth analysis of your personality type and how it impacts your relationships, career, and personal growth.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              onClick={() => navigate("/upgrade")}
            >
              Upgrade to Premium
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TestResult;
