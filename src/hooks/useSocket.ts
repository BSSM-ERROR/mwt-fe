'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type ConnectionStatus = 'connected' | 'disconnected';

export type ProcessingStep = 'transcribing' | 'thinking' | 'speaking' | null;

export interface AudioStreamData {
  text: string;
  audioUrl: string;
  emotion: string;
}

export interface ResponseCompleteData {
  fullText: string;
  userTranscription?: string;
}

export interface ErrorData {
  message: string;
}

export interface UserTranscriptionData {
  text: string;
}

export interface UseSocketReturn {
  socket: Socket | null;
  status: ConnectionStatus;
  processingStep: ProcessingStep;
  sendVoiceMessage: (audioBlob: Blob) => void;
  onAudioStream: (callback: (data: AudioStreamData) => void) => void;
  onResponseComplete: (callback: (data: ResponseCompleteData) => void) => void;
  onUserTranscription: (callback: (data: UserTranscriptionData) => void) => void;
  onError: (callback: (data: ErrorData) => void) => void;
}

const SOCKET_URL = 'https://mwt-be.onrender.com';

export function useSocket(): UseSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [processingStep, setProcessingStep] = useState<ProcessingStep>(null);
  const socketRef = useRef<Socket | null>(null);
  const audioStreamCallbackRef = useRef<((data: AudioStreamData) => void) | null>(null);
  const responseCompleteCallbackRef = useRef<((data: ResponseCompleteData) => void) | null>(null);
  const userTranscriptionCallbackRef = useRef<((data: UserTranscriptionData) => void) | null>(null);
  const errorCallbackRef = useRef<((data: ErrorData) => void) | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected to server');
      setStatus('connected');
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
      setStatus('disconnected');
    });

    socket.on('processing_status', (data: { step: string }) => {
      console.log('[Socket] processing_status:', data);
      const step = data.step as ProcessingStep;
      setProcessingStep(step);
    });

    socket.on('userTranscription', (data: UserTranscriptionData) => {
      console.log('[Socket] userTranscription:', data);
      if (userTranscriptionCallbackRef.current) {
        userTranscriptionCallbackRef.current(data);
      }
    });

    socket.on('audio_stream', (data: AudioStreamData) => {
      console.log('[Socket] audio_stream:', data);
      setProcessingStep('speaking');
      if (audioStreamCallbackRef.current) {
        audioStreamCallbackRef.current(data);
      }
    });

    socket.on('response_complete', (data: ResponseCompleteData) => {
      console.log('[Socket] response_complete:', data);
      console.log('[Socket] response_complete - Has userTranscription?:', 'userTranscription' in data, data.userTranscription);
      setProcessingStep(null);
      if (responseCompleteCallbackRef.current) {
        responseCompleteCallbackRef.current(data);
      }
    });

    // Deprecated ai_response 이벤트도 리스닝 (혹시 여기에 userText가 있을 수 있음)
    socket.on('ai_response', (data: any) => {
      console.log('[Socket] ai_response (deprecated):', data);
    });

    socket.on('error', (data: ErrorData) => {
      console.log('[Socket] error:', data);
      setProcessingStep(null);
      if (errorCallbackRef.current) {
        errorCallbackRef.current(data);
      }
    });

    // 모든 이벤트 로깅 (디버깅용)
    socket.onAny((eventName, ...args) => {
      console.log(`[Socket] Event: ${eventName}`, args);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendVoiceMessage = (audioBlob: Blob) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('voice_message', audioBlob);
    }
  };

  const onAudioStream = (callback: (data: AudioStreamData) => void) => {
    audioStreamCallbackRef.current = callback;
  };

  const onResponseComplete = (callback: (data: ResponseCompleteData) => void) => {
    responseCompleteCallbackRef.current = callback;
  };

  const onUserTranscription = (callback: (data: UserTranscriptionData) => void) => {
    userTranscriptionCallbackRef.current = callback;
  };

  const onError = (callback: (data: ErrorData) => void) => {
    errorCallbackRef.current = callback;
  };

  return {
    socket: socketRef.current,
    status,
    processingStep,
    sendVoiceMessage,
    onAudioStream,
    onResponseComplete,
    onUserTranscription,
    onError,
  };
}
