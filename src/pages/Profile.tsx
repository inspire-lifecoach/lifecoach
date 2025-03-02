
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft } from "lucide-react";
import { useTestResults } from "@/hooks/useTests";

// Personality type options
const personalityTypes = [
  { value: "", label: "Not Specified" },
  { value: "INTJ", label: "INTJ - Architect" },
  { value: "INTP", label: "INTP - Logician" },
  { value: "ENTJ", label: "ENTJ - Commander" },
  { value: "ENTP", label: "ENTP - Debater" },
  { value: "INFJ", label: "INFJ - Advocate" },
  { value: "INFP", label: "INFP - Mediator" },
  { value: "ENFJ", label: "ENFJ - Protagonist" },
  { value: "ENFP", label: "ENFP - Campaigner" },
  { value: "ISTJ", label: "ISTJ - Logistician" },
  { value: "ISFJ", label: "ISFJ - Defender" },
  { value: "ESTJ", label: "ESTJ - Executive" },
  { value: "ESFJ", label: "ESFJ - Consul" },
  { value: "ISTP", label: "ISTP - Virtuoso" },
  { value: "ISFP", label: "ISFP - Adventurer" },
  { value: "ESTP", label: "ESTP - Entrepreneur" },
  { value: "ESFP", label: "ESFP - Entertainer" },
  { value: "Type 1", label: "Enneagram Type 1 - The Reformer" },
  { value: "Type 2", label: "Enneagram Type 2 - The Helper" },
  { value: "Type 3", label: "Enneagram Type 3 - The Achiever" },
  { value: "Type 4", label: "Enneagram Type 4 - The Individualist" },
  { value: "Type 5", label: "Enneagram Type 5 - The Investigator" },
  { value: "Type 6", label: "Enneagram Type 6 - The Loyalist" },
  { value: "Type 7", label: "Enneagram Type 7 - The Enthusiast" },
  { value: "Type 8", label: "Enneagram Type 8 - The Challenger" },
  { value: "Type 9", label: "Enneagram Type 9 - The Peacemaker" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { results } = useTestResults();
  
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [personalityType, setPersonalityType] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setFullName(profile.full_name || "");
      setPersonalityType(profile.personality_type || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({
      username,
      full_name: fullName,
      personality_type: personalityType,
      bio,
    });
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Profile</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                  <AvatarFallback className="text-lg">
                    {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="w-full">
                  Change Avatar
                </Button>
              </div>
              
              <div className="md:w-2/3 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your unique username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personalityType">Personality Type</Label>
              <Select 
                value={personalityType} 
                onValueChange={setPersonalityType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your personality type" />
                </SelectTrigger>
                <SelectContent>
                  {personalityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {results.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Based on your test results: {results[0].result}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
