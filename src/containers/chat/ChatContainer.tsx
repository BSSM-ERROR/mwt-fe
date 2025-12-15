"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  BottomSheet,
  SelectCard,
  ChatView,
  Highlight,
} from "@/components/ui/Chat";
import { difficultyLevels, learningMethods } from "@/constants/chat";
import type { SelectOption, Step } from "@/types/chat";
import { useSocket } from "@/hooks/useSocket";
import { useLive2DStore, type LipSyncFrame } from "@/store/useLive2DStore";
import {
  detectQuizType,
  parseMultipleChoiceOptions,
  type QuizType,
  type QuizOption,
} from "@/utils/quizParser";
import * as S from "./style";

interface Message {
  id: string;
  text: string;
  isAI: boolean;
}

export default function ChatContainer() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("level");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [scenarioInput, setScenarioInput] = useState<string>("");
  const [isWaitingForScenarioStart, setIsWaitingForScenarioStart] =
    useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuizType, setCurrentQuizType] = useState<QuizType>(null);
  const [currentQuizOptions, setCurrentQuizOptions] = useState<QuizOption[]>(
    []
  );

  const {
    status,
    processingStep,
    sendVoiceMessage,
    sendTextMessage,
    generateTts,
    setSessionConfig,
    onAudioStream,
    onResponseComplete,
    onUserTranscription,
    onTtsResponse,
    onSessionConfigUpdated,
    onError,
  } = useSocket();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const setSpeaking = useLive2DStore((state) => state.setSpeaking);
  const setLipSyncData = useLive2DStore((state) => state.setLipSyncData);
  const setStartTime = useLive2DStore((state) => state.setStartTime);
  const stopSpeaking = useLive2DStore((state) => state.stopSpeaking);

  useEffect(() => {
    setupRecording();
  }, []);

  useEffect(() => {
    onSessionConfigUpdated((data) => {
      console.log("[ChatContainer] Session config updated:", data.config);

      // 시나리오 모드일 때 백엔드 응답 대기 상태 해제
      if (
        data.config.learningMode === "scenario" ||
        (data.config.learningMode === "quiz" && isWaitingForScenarioStart)
      ) {
        console.log(
          "[ChatContainer] Scenario config confirmed, waiting for AI response"
        );
      }
    });

    onAudioStream((data) => {
      // 시나리오 첫 응답이 오면 대기 상태 해제
      if (isWaitingForScenarioStart) {
        setIsWaitingForScenarioStart(false);
        console.log("[ChatContainer] Scenario started, mic enabled");
      }

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        // 마지막 메시지가 AI 메시지이고 내용이 비어있거나 이미 스트리밍 중이면 업데이트
        if (lastMessage && lastMessage.isAI) {
          const updatedMessages = [...prev];
          const newText =
            lastMessage.text + (lastMessage.text ? " " : "") + data.text;
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            text: newText,
          };

          // Quiz 모드일 때 문제 유형 감지
          if (selectedMethod === "quiz") {
            const quizType = detectQuizType(newText);

            if (quizType === "multiple-choice") {
              console.log("[ChatContainer] Detected multiple-choice question");
              setCurrentQuizType("multiple-choice");
              const options = parseMultipleChoiceOptions(newText);
              setCurrentQuizOptions(options);
            } else if (quizType === "fill-in-blank") {
              console.log("[ChatContainer] Detected fill-in-blank question");
              setCurrentQuizType("fill-in-blank");
              setCurrentQuizOptions([]);
            } else if (quizType === "answer") {
              console.log("[ChatContainer] Detected answer feedback");
              setCurrentQuizType("answer");
              setCurrentQuizOptions([]);
            }
          }

          return updatedMessages;
        }

        // 그렇지 않으면 새 메시지 추가 (이 경우는 발생하지 않아야 함)
        return [
          ...prev,
          {
            id: Date.now().toString(),
            text: data.text,
            isAI: true,
          },
        ];
      });

      audioQueueRef.current.push(data.audioUrl);
      if (!isPlayingRef.current) {
        playNextAudio();
      }

      console.log("Emotion:", data.emotion);
    });

    onUserTranscription((data) => {
      console.log("[ChatContainer] User transcription received:", data.text);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        // 뒤에서부터 빈 텍스트인 사용자 메시지를 찾아서 업데이트
        for (let i = updatedMessages.length - 1; i >= 0; i--) {
          if (!updatedMessages[i].isAI && updatedMessages[i].text === "") {
            updatedMessages[i] = {
              ...updatedMessages[i],
              text: data.text,
            };
            break;
          }
        }
        return updatedMessages;
      });
    });

    onResponseComplete((data) => {
      console.log("[ChatContainer] Full response received:", data.fullText);
      console.log("[ChatContainer] Response data:", data);
    });

    onTtsResponse((data) => {
      console.log("[ChatContainer] TTS response received:", data);

      // 립싱크 데이터 설정
      if (data.lipSyncData && Array.isArray(data.lipSyncData)) {
        console.log("[ChatContainer] Setting lip sync data:", data.lipSyncData);
        setLipSyncData(data.lipSyncData as LipSyncFrame[]);
      } else {
        setLipSyncData(null);
      }

      // base64 오디오를 재생
      const audio = new Audio(data.audioUrl);

      audio.onloadedmetadata = () => {
        // 오디오 재생 시작 시간 기록
        setSpeaking(true);
        setStartTime(performance.now());
      };

      audio.onended = () => {
        console.log("TTS audio playback ended");
        setPlayingMessageId(null);
        stopSpeaking();
      };

      audio.onerror = () => {
        console.error("TTS audio playback error");
        setPlayingMessageId(null);
        stopSpeaking();
      };

      audio.play().catch((e) => {
        console.error("TTS audio play failed:", e);
        setPlayingMessageId(null);
        stopSpeaking();
      });
    });

    onError((data) => {
      console.error("[ChatContainer] Error received:", data);
      alert("Error: " + data.message);

      // 에러 발생 시 마지막 빈 메시지들 제거 (처리 중이던 메시지)
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.text !== "");
        return filtered;
      });
    });
  }, [
    onAudioStream,
    onUserTranscription,
    onResponseComplete,
    onTtsResponse,
    onSessionConfigUpdated,
    onError,
  ]);

  const playNextAudio = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      stopSpeaking(); // 모든 오디오 재생 완료
      return;
    }

    isPlayingRef.current = true;
    const audioUrl = audioQueueRef.current.shift();
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);

    audio.onloadedmetadata = () => {
      // AI 응답 스트리밍 시작 시 립싱크 활성화 (기본 애니메이션)
      setSpeaking(true);
      setStartTime(performance.now());
      setLipSyncData(null); // 스트리밍에는 정확한 립싱크 데이터가 없으므로 기본 애니메이션 사용
    };

    audio.onended = () => {
      playNextAudio();
    };

    audio.onerror = () => {
      console.error("Audio play failed");
      playNextAudio();
    };

    audio.play().catch((e) => {
      console.error("Audio play failed:", e);
      playNextAudio();
    });
  };

  const setupRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        console.log("[ChatContainer] Audio recorded:", {
          size: audioBlob.size,
          type: audioBlob.type,
        });

        if (audioBlob.size < 1000) {
          console.warn("Audio too short, ignoring");
          audioChunksRef.current = [];
          return;
        }

        const timestamp = Date.now();

        // 사용자 메시지와 빈 AI 메시지 추가
        setMessages((prev) => [
          ...prev,
          {
            id: `user-${timestamp}`,
            text: "", // 빈 텍스트로 TypingIndicator 표시, transcription 오면 업데이트됨
            isAI: false,
          },
          {
            id: `ai-${timestamp}`,
            text: "",
            isAI: true,
          },
        ]);

        console.log("[ChatContainer] Sending voice message to backend");
        sendVoiceMessage(audioBlob);
        audioChunksRef.current = [];
      };
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleSelectLevel = (level: SelectOption) => {
    console.log("Selected level:", level);
    setSelectedLevel(level.id);
    setStep("method");
  };

  const handleSelectMethod = (method: SelectOption) => {
    console.log("Selected method:", method);
    setSelectedMethod(method.id);

    // scenario 모드 선택 시 시나리오 입력 단계로 이동
    if (method.id === "scenario") {
      setStep("scenario");
    } else if (method.id === "quiz") {
      // quiz 모드도 백엔드 응답 대기
      setMessages([
        {
          id: `ai-waiting-${Date.now()}`,
          text: "",
          isAI: true,
        },
      ]);

      setIsWaitingForScenarioStart(true);

      if (selectedLevel && method.id) {
        setSessionConfig({
          difficulty: selectedLevel as
            | "beginner"
            | "elementary"
            | "intermediate"
            | "advanced",
          learningMode: method.id as "free-talking" | "scenario" | "quiz",
        });
      }
      setStep("chat");
    } else {
      // free-talking 모드만 기본 메시지 표시
      setMessages([
        {
          id: "1",
          text: "Hello! I'm your AI teacher. Click the microphone to talk to me!",
          isAI: true,
        },
      ]);

      if (selectedLevel && method.id) {
        setSessionConfig({
          difficulty: selectedLevel as
            | "beginner"
            | "elementary"
            | "intermediate"
            | "advanced",
          learningMode: method.id as "free-talking" | "scenario" | "quiz",
        });
      }
      setStep("chat");
    }
  };

  const handleScenarioSubmit = () => {
    if (!scenarioInput.trim()) {
      alert("Please enter a scenario!");
      return;
    }

    // 빈 AI 메시지 추가 (타이핑 인디케이터 표시용)
    setMessages([
      {
        id: `ai-waiting-${Date.now()}`,
        text: "",
        isAI: true,
      },
    ]);

    // 백엔드 응답 대기 상태 설정
    setIsWaitingForScenarioStart(true);

    // scenario와 함께 설정 전송
    if (selectedLevel && selectedMethod) {
      setSessionConfig({
        difficulty: selectedLevel as
          | "beginner"
          | "elementary"
          | "intermediate"
          | "advanced",
        learningMode: selectedMethod as "free-talking" | "scenario" | "quiz",
        scenario: scenarioInput.trim(),
      });
      console.log("Scenario submitted:", scenarioInput);
    }

    setStep("chat");
  };

  const handleMicClick = () => {
    if (!mediaRecorderRef.current) return;

    // 시나리오 시작 대기 중이면 마이크 비활성화
    if (isWaitingForScenarioStart) {
      console.log("[ChatContainer] Mic disabled: waiting for scenario start");
      return;
    }

    // 객관식 문제일 때 마이크 비활성화
    if (currentQuizType === "multiple-choice") {
      console.log("[ChatContainer] Mic disabled: multiple-choice question");
      return;
    }

    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleQuizOptionSelect = (option: QuizOption) => {
    console.log("[ChatContainer] Quiz option selected:", option.label);

    // 사용자 메시지 추가
    const timestamp = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${timestamp}`,
        text: `${option.label}) ${option.text}`,
        isAI: false,
      },
      {
        id: `ai-${timestamp}`,
        text: "",
        isAI: true,
      },
    ]);

    // 텍스트 메시지로 답변 전송
    sendTextMessage(option.label);

    // Quiz 타입 초기화
    setCurrentQuizType(null);
    setCurrentQuizOptions([]);
  };

  const handleSpeak = (messageId: string) => {
    // 이미 재생 중이면 무시
    if (playingMessageId === messageId) {
      return;
    }

    const message = messages.find((msg) => msg.id === messageId);
    if (!message || !message.text) {
      console.warn("Message not found or empty:", messageId);
      return;
    }

    console.log("Requesting TTS for message:", message.text);
    setPlayingMessageId(messageId);
    // 백엔드에 TTS 생성 요청
    generateTts(message.text, "gentle");
  };

  const handleTranslate = (messageId: string) => {
    console.log("Translate message:", messageId);
  };

  const renderStep = () => {
    switch (step) {
      case "chat":
        return (
          <ChatView
            messages={messages}
            isRecording={isRecording}
            isMicDisabled={
              isWaitingForScenarioStart || currentQuizType === "multiple-choice"
            }
            playingMessageId={playingMessageId}
            quizType={currentQuizType}
            quizOptions={currentQuizOptions}
            onMicClick={handleMicClick}
            onSpeak={handleSpeak}
            onTranslate={handleTranslate}
            onQuizOptionSelect={handleQuizOptionSelect}
          />
        );

      case "scenario":
        return (
          <BottomSheet
            isOpen={true}
            onClose={handleClose}
            title={
              <>
                <Highlight>시나리오</Highlight>를 입력해주세요
              </>
            }
          >
            <S.ScenarioInputContainer>
              <S.ScenarioTextarea
                value={scenarioInput}
                onChange={(e) => setScenarioInput(e.target.value)}
                placeholder="예: 카페에서 커피 주문하기, 공항에서 체크인하기, 면접 보기 등"
              />
              <S.ScenarioSubmitButton
                onClick={handleScenarioSubmit}
                disabled={!scenarioInput.trim()}
              >
                시작하기
              </S.ScenarioSubmitButton>
            </S.ScenarioInputContainer>
          </BottomSheet>
        );

      case "method":
        return (
          <BottomSheet
            isOpen={true}
            onClose={handleClose}
            title={
              <>
                <Highlight>학습 방식</Highlight>을 설정해주세요
              </>
            }
          >
            {learningMethods.map((method) => (
              <SelectCard
                key={method.id}
                tag={method.tag}
                title={method.title}
                description={method.description}
                onClick={() => handleSelectMethod(method)}
              />
            ))}
          </BottomSheet>
        );

      case "level":
      default:
        return (
          <BottomSheet
            isOpen={true}
            onClose={handleClose}
            title={
              <>
                <Highlight>난이도</Highlight>를 설정해주세요
              </>
            }
          >
            {difficultyLevels.map((level) => (
              <SelectCard
                key={level.id}
                tag={level.tag}
                title={level.title}
                description={level.description}
                onClick={() => handleSelectLevel(level)}
              />
            ))}
          </BottomSheet>
        );
    }
  };

  return renderStep();
}
