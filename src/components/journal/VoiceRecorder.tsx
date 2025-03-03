
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, transcript: string) => void;
}

const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    setRecordingError(null);
    chunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });
      
      mediaRecorderRef.current.addEventListener("stop", () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        processRecording(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        setIsRecording(false);
        setRecordingTime(0);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      });
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecordingError("Could not access microphone. Please ensure microphone permissions are enabled.");
      toast({
        title: "Error",
        description: "Could not access microphone. Please ensure microphone permissions are enabled.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const processRecording = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      // For now, we're mocking the transcription service
      // In a real app, you would send the blob to a service
      
      // Mock a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a transcript result
      const mockTranscript = "This is a simulated transcription of your voice recording.";
      
      // Call the provided callback with the audio blob and transcript
      onRecordingComplete(blob, mockTranscript);
      
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast({
        title: "Error",
        description: "Failed to transcribe your recording.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {recordingError && (
        <div className="text-red-500 text-sm">{recordingError}</div>
      )}
      
      <Card className="p-6 flex flex-col items-center justify-center bg-gray-50">
        {isRecording ? (
          <div className="text-2xl font-mono mb-4">{formatTime(recordingTime)}</div>
        ) : (
          <div className="text-gray-500 mb-4">Tap to start recording</div>
        )}
        
        <div className="flex gap-4">
          {!isRecording && !isTranscribing ? (
            <Button
              onClick={startRecording}
              size="lg"
              className="rounded-full h-16 w-16 flex items-center justify-center bg-red-500 hover:bg-red-600"
            >
              <Mic className="h-6 w-6" />
            </Button>
          ) : isRecording ? (
            <Button
              onClick={stopRecording}
              size="lg"
              className="rounded-full h-16 w-16 flex items-center justify-center bg-red-500 hover:bg-red-600"
            >
              <Square className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              disabled
              size="lg"
              className="rounded-full h-16 w-16 flex items-center justify-center"
            >
              <Loader2 className="h-6 w-6 animate-spin" />
            </Button>
          )}
        </div>
        
        {isRecording && (
          <div className="mt-4 text-sm text-gray-500">Recording... (tap square to stop)</div>
        )}
        
        {isTranscribing && (
          <div className="mt-4 text-sm text-gray-500">Transcribing your recording...</div>
        )}
      </Card>
      
      <div className="text-xs text-gray-500">
        For best results, speak clearly and record in a quiet environment. Maximum recording time is 5 minutes.
      </div>
    </div>
  );
};

export default VoiceRecorder;
