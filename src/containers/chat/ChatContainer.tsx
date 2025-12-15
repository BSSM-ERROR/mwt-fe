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

interface Message {
  id: string;
  text: string;
  isAI: boolean;
}

export default function ChatContainer() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("level");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI teacher. Click the microphone to talk to me!",
      isAI: true,
    },
  ]);

  const {
    status,
    processingStep,
    sendVoiceMessage,
    generateTts,
    onAudioStream,
    onResponseComplete,
    onUserTranscription,
    onTtsResponse,
    onError,
  } = useSocket();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  useEffect(() => {
    setupRecording();
  }, []);

  useEffect(() => {
    onAudioStream((data) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        // 마지막 메시지가 AI 메시지이고 내용이 비어있거나 이미 스트리밍 중이면 업데이트
        if (lastMessage && lastMessage.isAI) {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            text: lastMessage.text + data.text,
          };
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
      // base64 오디오를 재생
      const audio = new Audio(data.audioUrl);

      audio.onended = () => {
        console.log("TTS audio playback ended");
        setPlayingMessageId(null);
      };

      audio.onerror = () => {
        console.error("TTS audio playback error");
        setPlayingMessageId(null);
      };

      audio.play().catch((e) => {
        console.error("TTS audio play failed:", e);
        setPlayingMessageId(null);
      });
    });

    onError((data) => {
      alert("Error: " + data.message);
    });
  }, [onAudioStream, onUserTranscription, onResponseComplete, onTtsResponse, onError]);

  const playNextAudio = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const audioUrl = audioQueueRef.current.shift();
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);

    audio.onended = () => {
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
    setStep("method");
  };

  const handleSelectMethod = (method: SelectOption) => {
    console.log("Selected method:", method);
    setStep("chat");
  };

  const handleMicClick = () => {
    if (!mediaRecorderRef.current) return;

    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
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
            playingMessageId={playingMessageId}
            onMicClick={handleMicClick}
            onSpeak={handleSpeak}
            onTranslate={handleTranslate}
          />
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
