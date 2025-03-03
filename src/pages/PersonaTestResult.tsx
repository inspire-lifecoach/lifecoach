
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

interface PersonalityDescription {
  type: string;
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
}

// Sample personality descriptions (would typically come from database)
const personalityDescriptions: Record<string, PersonalityDescription> = {
  'INTJ': {
    type: 'INTJ',
    name: 'The Architect',
    description: 'Imaginative and strategic thinkers, with a plan for everything. Independent and analytical, they drive to achieve their goals and implement their ideas.',
    strengths: ['Strategic', 'Independent', 'Innovative', 'Determined', 'Rational'],
    weaknesses: ['Overly critical', 'Dismissive of emotions', 'Perfectionistic', 'Can be insensitive'],
    careers: ['Scientist', 'Engineer', 'Professor', 'Lawyer', 'Judge']
  },
  'INTP': {
    type: 'INTP',
    name: 'The Logician',
    description: 'Innovative inventors with an unquenchable thirst for knowledge. They enjoy theoretical and abstract concepts, and excel at logical analysis.',
    strengths: ['Analytical', 'Original', 'Open-minded', 'Curious', 'Objective'],
    weaknesses: ['Disconnected', 'Overthinking', 'Difficulty with practical matters', 'Can be insensitive'],
    careers: ['Physicist', 'Mathematician', 'Software Developer', 'Philosopher', 'Researcher']
  },
  'ENTJ': {
    type: 'ENTJ',
    name: 'The Commander',
    description: 'Bold, imaginative, and strong-willed leaders, always finding a way – or making one. Natural leaders who can visualize and implement change.',
    strengths: ['Efficient', 'Energetic', 'Self-confident', 'Strategic', 'Charismatic'],
    weaknesses: ['Impatient', 'Stubborn', 'Arrogant', 'Intolerant', 'Cold and ruthless'],
    careers: ['Executive', 'Entrepreneur', 'Lawyer', 'Consultant', 'Political Leader']
  },
  // Default fallback for any personality type
  'DEFAULT': {
    type: 'Your Personality Type',
    name: 'Unique Individual',
    description: 'Your personality type reflects a unique combination of traits that influence how you interact with the world. Your specific strengths and preferences give you a particular perspective that is valuable in many contexts.',
    strengths: ['Unique combination of traits', 'Individual perspective', 'Personal growth potential'],
    weaknesses: ['Areas for development unique to your type'],
    careers: ['Careers aligned with your preferences and strengths']
  }
};

// Big Five descriptions
const big5Descriptions = {
  openness: [
    'You score low on openness, suggesting you prefer traditional, familiar experiences and concrete thinking.',
    'You score moderately on openness, suggesting a balance between tradition and new experiences.',
    'You score high on openness, suggesting you enjoy new experiences, abstract thinking, and creativity.'
  ],
  conscientiousness: [
    'You score low on conscientiousness, suggesting a more flexible, spontaneous approach to tasks.',
    'You score moderately on conscientiousness, suggesting a balance between organization and flexibility.',
    'You score high on conscientiousness, suggesting strong organization, reliability, and attention to detail.'
  ],
  extraversion: [
    'You score low on extraversion, suggesting you prefer solitary activities and may be more reserved.',
    'You score moderately on extraversion, suggesting a balance between social engagement and alone time.',
    'You score high on extraversion, suggesting you gain energy from social interaction and external stimulation.'
  ],
  agreeableness: [
    'You score low on agreeableness, suggesting a more competitive, questioning approach to relationships.',
    'You score moderately on agreeableness, suggesting a balance between accommodation and standing your ground.',
    'You score high on agreeableness, suggesting you value cooperation, empathy, and harmony in relationships.'
  ],
  neuroticism: [
    'You score low on neuroticism, suggesting you tend to be emotionally stable and less reactive to stress.',
    'You score moderately on neuroticism, suggesting a typical emotional response to stress.',
    'You score high on neuroticism, suggesting you may experience emotions more intensely and be more sensitive to stress.'
  ]
};

// Enneagram type descriptions
const enneagramDescriptions: Record<string, PersonalityDescription> = {
  '1': {
    type: 'Type 1',
    name: 'The Reformer',
    description: 'Principled, purposeful, self-controlled, and perfectionistic. You strive to live up to high internal standards and seek improvement in yourself and the world around you.',
    strengths: ['Ethical', 'Reliable', 'Productive', 'Wise', 'Idealistic'],
    weaknesses: ['Critical', 'Perfectionistic', 'Judgmental', 'Overly serious'],
    careers: ['Teacher', 'Judge', 'Editor', 'Researcher', 'Engineer']
  },
  '4': {
    type: 'Type 4',
    name: 'The Individualist',
    description: 'Sensitive, expressive, and self-aware. You value authenticity and seek to create beauty and meaning from your experiences.',
    strengths: ['Creative', 'Empathetic', 'Self-aware', 'Authentic', 'Passionate'],
    weaknesses: ['Moody', 'Self-conscious', 'Melancholic', 'Envious'],
    careers: ['Artist', 'Writer', 'Therapist', 'Designer', 'Musician']
  },
  '6': {
    type: 'Type 6',
    name: 'The Loyalist',
    description: 'Committed, security-oriented, and engaging. You are responsible and trustworthy, valuing loyalty and working for the safety and stability of those close to you.',
    strengths: ['Loyal', 'Responsible', 'Practical', 'Witty', 'Supportive'],
    weaknesses: ['Anxious', 'Suspicious', 'Indecisive', 'Reactive'],
    careers: ['Security Specialist', 'Project Manager', 'Administrator', 'Human Resources', 'Team Leader']
  },
  '7': {
    type: 'Type 7',
    name: 'The Enthusiast',
    description: 'Spontaneous, versatile, and optimistic. You seek diverse experiences and maintain a busy, fun-filled schedule to avoid missing out on life\'s adventures.',
    strengths: ['Optimistic', 'Versatile', 'Adventurous', 'Productive', 'Joyful'],
    weaknesses: ['Scattered', 'Impulsive', 'Commitment-phobic', 'Escapist'],
    careers: ['Entrepreneur', 'Marketer', 'Travel Writer', 'Event Planner', 'Consultant']
  },
  '8': {
    type: 'Type 8',
    name: 'The Challenger',
    description: 'Powerful, dominating, and self-confident. You exert strength and influence to protect yourself and those important to you.',
    strengths: ['Decisive', 'Confident', 'Protective', 'Direct', 'Resourceful'],
    weaknesses: ['Confrontational', 'Intimidating', 'Domineering', 'Impulsive'],
    careers: ['Executive', 'Entrepreneur', 'Attorney', 'Military Leader', 'Construction Manager']
  },
  '9': {
    type: 'Type 9',
    name: 'The Peacemaker',
    description: 'Easy-going, receptive, and supportive. You seek peace and harmony in your environment and inner life.',
    strengths: ['Patient', 'Supportive', 'Harmonizing', 'Diplomatic', 'Accepting'],
    weaknesses: ['Conflict-avoidant', 'Complacent', 'Stubborn', 'Disengaged'],
    careers: ['Counselor', 'Mediator', 'HR Professional', 'Social Worker', 'Advisor']
  }
};

const PersonaTestResult = () => {
  const { personalityType } = useParams<{ personalityType: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testType, setTestType] = useState('mbti');
  const [resultTitle, setResultTitle] = useState('');
  const [resultContent, setResultContent] = useState<React.ReactNode | null>(null);

  // Get state from navigation or use URL parameter
  const resultType = personalityType || (location.state?.personalityType || 'Unknown');
  const stateTestType = location.state?.testType || 'mbti';
  
  useEffect(() => {
    // Set the test type from navigation state
    setTestType(stateTestType);
    
    // Process the result based on test type
    processTestResult(resultType, stateTestType);
    
    // Fetch additional insights
    fetchInsights(resultType, stateTestType);
  }, [resultType, stateTestType]);

  const processTestResult = (result: string, type: string) => {
    switch (type) {
      case 'mbti':
      case 'quick':
        setResultTitle(`Your Personality Type: ${result}`);
        // Get MBTI description or default
        const mbtiDescription = personalityDescriptions[result] || personalityDescriptions['DEFAULT'];
        setResultContent(renderMBTIResult(mbtiDescription));
        break;
      case 'big5':
        setResultTitle('Your OCEAN Profile');
        // Parse the Big Five result format (OCEAN-O-C-E-A-N)
        const scores = result.split('-').slice(1).map(Number);
        setResultContent(renderBig5Result(scores));
        break;
      case 'enneagram':
        // Parse the Enneagram result format (Type-X)
        const enneagramType = result.split('-')[1];
        setResultTitle(`Your Enneagram Type: ${enneagramType}`);
        // Get Enneagram description
        const enneagramDescription = enneagramDescriptions[enneagramType] || personalityDescriptions['DEFAULT'];
        setResultContent(renderEnneagramResult(enneagramDescription));
        break;
      default:
        // Fallback to default
        setResultTitle(`Your Result: ${result}`);
        setResultContent(
          <p>Thank you for completing the assessment. Your result has been saved.</p>
        );
    }
  };

  const renderMBTIResult = (description: PersonalityDescription) => (
    <>
      <p>{description.description}</p>
      
      <div>
        <h3 className="font-medium mb-2">Strengths:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {description.strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Areas for Development:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {description.weaknesses.map((weakness, index) => (
            <li key={index}>{weakness}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Career Paths That Might Suit You:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {description.careers.map((career, index) => (
            <li key={index}>{career}</li>
          ))}
        </ul>
      </div>
    </>
  );

  const renderBig5Result = (scores: number[]) => {
    const dimensions = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];
    
    const getScoreLevel = (score: number) => {
      if (score < 40) return 0; // Low
      if (score < 70) return 1; // Moderate
      return 2; // High
    };
    
    return (
      <>
        <p className="mb-4">
          The Big Five personality test measures five key dimensions of your personality. 
          Here are your results:
        </p>
        
        {dimensions.map((dimension, index) => {
          const score = scores[index];
          const level = getScoreLevel(score);
          const description = big5Descriptions[dimension.toLowerCase() as keyof typeof big5Descriptions][level];
          
          return (
            <div key={dimension} className="mb-4">
              <h3 className="font-medium mb-1">{dimension}: {score}%</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
              {index < dimensions.length - 1 && <Separator className="my-4" />}
            </div>
          );
        })}
      </>
    );
  };

  const renderEnneagramResult = (description: PersonalityDescription) => (
    <>
      <p className="mb-4">{description.description}</p>
      
      <div>
        <h3 className="font-medium mb-2">Key Strengths:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {description.strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-4">
        <h3 className="font-medium mb-2">Growth Areas:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {description.weaknesses.map((weakness, index) => (
            <li key={index}>{weakness}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-4">
        <h3 className="font-medium mb-2">Potential Career Paths:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {description.careers.map((career, index) => (
            <li key={index}>{career}</li>
          ))}
        </ul>
      </div>
    </>
  );

  const fetchInsights = async (result: string, type: string) => {
    setIsLoading(true);
    
    try {
      // Call the generate insights function
      const response = await supabase.functions.invoke('generate_insights', {
        body: { 
          personalityType: result,
          testType: type,
          areas: ['career', 'relationships', 'personal_growth']
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      setInsights(response.data || null);
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load detailed insights. Using basic information instead."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendations = () => {
    navigate('/recommendations', { 
      state: { 
        personalityType: resultType,
        testType: testType
      } 
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
        {resultTitle}
      </h1>
      {testType === 'mbti' && (
        <h2 className="text-xl mb-6 text-center text-muted-foreground">
          {(personalityDescriptions[resultType] || personalityDescriptions['DEFAULT']).name}
        </h2>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About Your Result</CardTitle>
          <CardDescription>Key characteristics and traits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resultContent}
        </CardContent>
      </Card>
      
      {insights && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Personalized Insights</CardTitle>
            <CardDescription>AI-generated insights based on your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {insights.insights?.map((insight: any, index: number) => (
              <div key={index}>
                <h3 className="font-medium text-lg mb-2">{insight.title}</h3>
                <p className="text-muted-foreground mb-4">{insight.content}</p>
                {index < insights.insights.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
            
            {isLoading && <p className="text-center text-muted-foreground">Loading insights...</p>}
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/tests')}
        >
          Take Another Test
        </Button>
        <Button 
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          onClick={handleGetRecommendations}
        >
          Get Personalized Recommendations
        </Button>
      </div>
    </div>
  );
};

export default PersonaTestResult;
