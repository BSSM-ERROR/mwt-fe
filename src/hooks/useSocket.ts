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
}

export interface ErrorData {
  message: string;
}

export interface UseSocketReturn {
  socket: Socket | null;
  status: ConnectionStatus;
  processingStep: ProcessingStep;
  sendVoiceMessage: (audioBlob: Blob) => void;
  onAudioStream: (callback: (data: AudioStreamData) => void) => void;
  onResponseComplete: (callback: (data: ResponseCompleteData) => void) => void;
  onError: (callback: (data: ErrorData) => void) => void;
}

const SOCKET_URL = 'https://mwt-be.onrender.com';

export function useSocket(): UseSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [processingStep, setProcessingStep] = useState<ProcessingStep>(null);
  const socketRef = useRef<Socket | null>(null);
  const audioStreamCallbackRef = useRef<((data: AudioStreamData) => void) | null>(null);
  const responseCompleteCallbackRef = useRef<((data: ResponseCompleteData) => void) | null>(null);
  const errorCallbackRef = useRef<((data: ErrorData) => void) | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('connected');
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
    });

    socket.on('processing_status', (data: { step: string }) => {
      const step = data.step as ProcessingStep;
      setProcessingStep(step);
    });

    socket.on('audio_stream', (data: AudioStreamData) => {
      setProcessingStep('speaking');
      if (audioStreamCallbackRef.current) {
        audioStreamCallbackRef.current(data);
      }
    });

    socket.on('response_complete', (data: ResponseCompleteData) => {
      setProcessingStep(null);
      if (responseCompleteCallbackRef.current) {
        responseCompleteCallbackRef.current(data);
      }
    });

    socket.on('error', (data: ErrorData) => {
      setProcessingStep(null);
      if (errorCallbackRef.current) {
        errorCallbackRef.current(data);
      }
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
    onError,
  };
}
