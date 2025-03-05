
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chart } from "@/components/ui/chart";
import { Share2, Download, ArrowRight } from "lucide-react";

interface TestResultState {
  personalityType: string;
  testType: string;
  details: any;
}

// MBTI type descriptions
const mbtiDescriptions: Record<string, { title: string, description: string, traits: string[] }> = {
  'INTJ': {
    title: 'The Architect',
    description: 'Imaginative and strategic thinkers with a plan for everything.',
    traits: ['Strategic', 'Independent', 'Perfectionist', 'Private', 'Analytical']
  },
  'INTP': {
    title: 'The Logician',
    description: 'Innovative inventors with an unquenchable thirst for knowledge.',
    traits: ['Logical', 'Original', 'Curious', 'Objective', 'Abstract']
  },
  'ENTJ': {
    title: 'The Commander',
    description: 'Bold, imaginative and strong-willed leaders, always finding a way.',
    traits: ['Decisive', 'Efficient', 'Strategic', 'Ambitious', 'Leadership']
  },
  'ENTP': {
    title: 'The Debater',
    description: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
    traits: ['Innovative', 'Knowledgeable', 'Original', 'Charismatic', 'Debate-loving']
  },
  'INFJ': {
    title: 'The Advocate',
    description: 'Quiet and mystical, yet very inspiring and tireless idealists.',
    traits: ['Insightful', 'Principled', 'Creative', 'Altruistic', 'Reserved']
  },
  'INFP': {
    title: 'The Mediator',
    description: 'Poetic, kind and altruistic people, always eager to help a good cause.',
    traits: ['Idealistic', 'Harmonious', 'Open-minded', 'Creative', 'Compassionate']
  },
  'ENFJ': {
    title: 'The Protagonist',
    description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
    traits: ['Charismatic', 'Empathetic', 'Reliable', 'Natural leader', 'Altruistic']
  },
  'ENFP': {
    title: 'The Campaigner',
    description: 'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.',
    traits: ['Enthusiastic', 'Creative', 'Sociable', 'Energetic', 'Perceptive']
  },
  'ISTJ': {
    title: 'The Logistician',
    description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.',
    traits: ['Organized', 'Reliable', 'Practical', 'Logical', 'Dutiful']
  },
  'ISFJ': {
    title: 'The Defender',
    description: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
    traits: ['Supportive', 'Reliable', 'Observant', 'Patient', 'Detail-oriented']
  },
  'ESTJ': {
    title: 'The Executive',
    description: 'Excellent administrators, unsurpassed at managing things – or people.',
    traits: ['Organized', 'Practical', 'Logical', 'Dutiful', 'Traditional']
  },
  'ESFJ': {
    title: 'The Consul',
    description: 'Extraordinarily caring, social and popular people, always eager to help.',
    traits: ['Supportive', 'Reliable', 'Conscientious', 'Traditional', 'Social']
  },
  'ISTP': {
    title: 'The Virtuoso',
    description: 'Bold and practical experimenters, masters of all kinds of tools.',
    traits: ['Versatile', 'Practical', 'Spontaneous', 'Independent', 'Logical']
  },
  'ISFP': {
    title: 'The Adventurer',
    description: 'Flexible and charming artists, always ready to explore and experience something new.',
    traits: ['Artistic', 'Experimental', 'Sensitive', 'Harmonious', 'Passionate']
  },
  'ESTP': {
    title: 'The Entrepreneur',
    description: 'Smart, energetic and very perceptive people, who truly enjoy living on the edge.',
    traits: ['Energetic', 'Practical', 'Perceptive', 'Spontaneous', 'Direct']
  },
  'ESFP': {
    title: 'The Entertainer',
    description: 'Spontaneous, energetic and enthusiastic people – life is never boring around them.',
    traits: ['Enthusiastic', 'Sociable', 'Spontaneous', 'Practical', 'Observant']
  }
};

const TestResult = () => {
  const { personalityType } = useParams<{ personalityType: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as TestResultState;
  
  // If no personalityType in URL, use the one from state
  const resultType = personalityType || (state?.personalityType || 'UNKNOWN');
  const testType = state?.testType || 'mbti';

  // For Big Five results (format: OCEAN-80-70-60-90-40)
  const renderBigFiveResult = () => {
    if (!resultType.startsWith('OCEAN-')) return null;

    const [_, O, C, E, A, N] = resultType.split('-').map(Number);
    
    const data = [
      { subject: 'Openness', A: O },
      { subject: 'Conscientiousness', A: C },
      { subject: 'Extraversion', A: E },
      { subject: 'Agreeableness', A: A },
      { subject: 'Neuroticism', A: N },
    ];

    return (
      <>
        <h2 className="text-2xl font-bold mb-4">Your Big Five Profile</h2>
        <div className="h-80 w-full mb-8">
          <Chart type="radar" data={data} height={300} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Openness to Experience: {O}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your level of creativity, curiosity, and preference for variety and novelty.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Conscientiousness: {C}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your tendency to be organized, disciplined, dependable, and achievement-focused.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Extraversion: {E}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your orientation toward the outside world and social interactions.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Agreeableness: {A}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your tendency to be compassionate, cooperative, and considerate toward others.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Neuroticism: {N}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your tendency toward negative emotions and emotional reactivity.</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  // For Enneagram results (format: Type-1 or Type-2/3)
  const renderEnneagramResult = () => {
    if (!resultType.startsWith('Type-')) return null;

    const types = resultType.replace('Type-', '').split('/');
    
    const enneagramDescriptions: Record<string, { title: string, description: string }> = {
      '1': {
        title: 'The Reformer',
        description: 'Principled, purposeful, self-controlled, and perfectionistic'
      },
      '2': {
        title: 'The Helper',
        description: 'Generous, demonstrative, people-pleasing, and possessive'
      },
      '3': {
        title: 'The Achiever',
        description: 'Adaptable, excelling, driven, and image-conscious'
      },
      '4': {
        title: 'The Individualist',
        description: 'Expressive, dramatic, self-absorbed, and temperamental'
      },
      '5': {
        title: 'The Investigator',
        description: 'Perceptive, innovative, secretive, and isolated'
      },
      '6': {
        title: 'The Loyalist',
        description: 'Engaging, responsible, anxious, and suspicious'
      },
      '7': {
        title: 'The Enthusiast',
        description: 'Spontaneous, versatile, acquisitive, and scattered'
      },
      '8': {
        title: 'The Challenger',
        description: 'Self-confident, decisive, willful, and confrontational'
      },
      '9': {
        title: 'The Peacemaker',
        description: 'Receptive, reassuring, complacent, and resigned'
      }
    };

    return (
      <>
        <h2 className="text-2xl font-bold mb-4">Your Enneagram Type</h2>
        {types.map(type => (
          <Card key={type} className="mb-4">
            <CardHeader>
              <CardTitle>Type {type}: {enneagramDescriptions[type]?.title || 'Unknown'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{enneagramDescriptions[type]?.description || 'No description available'}</p>
            </CardContent>
          </Card>
        ))}
      </>
    );
  };

  // For MBTI results
  const renderMBTIResult = () => {
    if (testType !== 'mbti' && testType !== 'quick') return null;
    
    const typeInfo = mbtiDescriptions[resultType] || {
      title: 'Unknown Type',
      description: 'We could not determine your personality type.',
      traits: []
    };

    return (
      <>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{resultType}</h1>
          <h2 className="text-2xl text-muted-foreground">{typeInfo.title}</h2>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About Your Type</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{typeInfo.description}</p>
          </CardContent>
        </Card>

        <h3 className="text-xl font-semibold mb-4">Key Traits</h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {typeInfo.traits.map((trait, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 text-violet-800 dark:text-violet-200 rounded-full"
            >
              {trait}
            </span>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Display based on test type */}
      {testType === 'mbti' || testType === 'quick' ? renderMBTIResult() : null}
      {testType === 'big5' ? renderBigFiveResult() : null}
      {testType === 'enneagram' ? renderEnneagramResult() : null}
      
      <div className="flex flex-col sm:flex-row gap-4 my-8">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {/* Handle sharing */}}
        >
          <Share2 className="mr-2 h-4 w-4" /> Share Result
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={() => {/* Handle download */}}
        >
          <Download className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </div>
      
      <Card className="mb-8 border-2 border-violet-200 dark:border-violet-800">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
          <CardTitle>What's Next?</CardTitle>
          <CardDescription>Continue your self-discovery journey</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4">Now that you know your personality type, explore personalized recommendations tailored just for you.</p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            onClick={() => navigate('/recommendations')}
          >
            Get Personalized Recommendations <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-center">
        <Button 
          variant="outline"
          onClick={() => navigate('/tests')}
        >
          Take Another Test
        </Button>
      </div>
    </div>
  );
};

export default TestResult;
