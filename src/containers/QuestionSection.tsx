import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { TooltipButton } from "@/components/ToolTipButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordAnswer } from "./RecordAnswer";
import { Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

interface QuestionSectionProps {
  questions: { question: string; answer: string }[];
  interview: any;
}

export const QuestionSection = ({
  questions,
  interview,
}: QuestionSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWebCam, setIsWebCam] = useState(true);
  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const tabRefs = useRef<(HTMLElement | null)[]>([]);

  const handlePlayQuestion = (qst: string) => {
    if (isPlaying && currentSpeech) {
      // stop the speech if already playing
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
    } else {
      // start speech if not currently playing
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(qst);
        window.speechSynthesis.speak(speech);
        setIsPlaying(true);
        setCurrentSpeech(speech);

        // handle the speech end
        speech.onend = () => {
          setIsPlaying(false);
          setCurrentSpeech(null);
        };
      }
    }
  };

  // Fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // auto play after 1 seconds on first question
  useEffect(() => {
    if (tabRefs.current[activeIndex]) {
      tabRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }

    if (questions.length > 0) {
      const timer = setTimeout(() => {
        handlePlayQuestion(questions[activeIndex].question);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeIndex, questions]);

  return (
    <div className="w-full min-h-96 border rounded-md p-4">
      {/* Fullscreen Button */}
      <div className="absolute top-2 right-2">
        <TooltipButton
          content={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          icon={
            isFullScreen ? (
              <Minimize className="min-w-5 min-h-5 text-muted-foreground" />
            ) : (
              <Maximize className="min-w-5 min-h-5 text-muted-foreground" />
            )
          }
          onClick={toggleFullScreen}
        />
      </div>
      <Tabs
        value={questions[activeIndex]?.question}
        onValueChange={(value) => {
          const idx = questions.findIndex((q) => q.question === value);
          setActiveIndex(idx);
        }}
        defaultValue={questions[0]?.question}
        className="w-full space-y-4"
        orientation="vertical"
      >
        <TabsList className="bg-transparent w-full flex items-center justify-between overflow-x-auto no-scrollbar gap-4 py-2">
          {questions?.map((tab, i) => (
            <TabsTrigger
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              className={cn(
                "data-[state=active]:bg-emerald-200 data-[state=active]:shadow-md text-xs px-2"
              )}
              key={tab.question}
              value={tab.question}
            >
              {`Question #${i + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>

        {questions?.map((tab, i) => (
          <TabsContent key={i} value={tab.question}>
            <p className="text-base text-left tracking-wide text-neutral-500">
              {tab.question}
            </p>

            <div className="w-full flex items-center justify-end">
              <TooltipButton
                content={isPlaying ? "Stop" : "Start"}
                icon={
                  isPlaying ? (
                    <VolumeX className="min-w-5 min-h-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="min-w-5 min-h-5 text-muted-foreground" />
                  )
                }
                onClick={() => handlePlayQuestion(tab.question)}
              />
            </div>

            <RecordAnswer
              interview={interview}
              question={tab}
              isWebCam={isWebCam}
              setIsWebCam={setIsWebCam}
              isPlaying={isPlaying}
              onSaveNext={() => {
                if (activeIndex < questions.length - 1) {
                  setActiveIndex(activeIndex + 1);
                }
              }}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
