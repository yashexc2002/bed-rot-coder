'use client';

import { useState, useRef } from 'react';

export default function BedRotCoder() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Ready when you are.');
  const [transcription, setTranscription] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setIsProcessing(true);
      setStatus('Turning your idea into code...');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'command.wav');

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          const data = await response.json();

          if (data.success) {
            setStatus('Code is ready.');
            setTranscription(data.transcription);
            setCode(data.code);
            setError('');
          } else {
            setStatus('Something went wrong.');
            setError(data.error || 'The agent could not process that request.');
          }
          setIsProcessing(false);
        } catch (err) {
          setStatus('Connection issue.');
          setError('Could not reach the coding agent. Please try again.');
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus('Listening...');
      setTranscription('');
      setCode('');
      setError('');
      setIsCopied(false);
      setIsProcessing(false);
    } catch (err) {
      setStatus('Microphone unavailable.');
      setError('Please allow microphone access and try again.');
      setIsProcessing(false);
    }
  };

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1600);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 font-sans px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex items-start justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-violet-300">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_14px_3px_rgba(167,139,250,0.45)]" />
              Local creative workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Bed-Rot Coder</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-400">
              Say what you want to build. Your code appears here, ready to use.
            </p>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-500 sm:block">
            Voice → Code
          </div>
        </header>

        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 sm:p-7">
          <div className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Command deck</p>
              <p className="mt-2 text-sm text-zinc-300">Describe a feature, script, page, or idea in your own words.</p>
            </div>
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <button
              onClick={toggleRecording}
              disabled={!isRecording && status === 'Turning your idea into code...'}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                isRecording
                  ? 'border-rose-400 bg-rose-400/10 text-rose-300 hover:bg-rose-400/20'
                  : 'border-violet-300 bg-violet-300 text-zinc-950 hover:bg-violet-200'
              }`}
            >
              <span className="mr-2">{isRecording ? '■' : '●'}</span>
              {isRecording ? 'Stop listening' : 'Start speaking'}
            </button>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className={`h-2 w-2 rounded-full ${isRecording ? 'animate-pulse bg-rose-400' : 'bg-emerald-400'}`} />
              {status}
            </div>
            </div>

          {isProcessing && (
            <div className="flex items-center gap-4 rounded-xl border border-violet-300/20 bg-violet-300/[0.07] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-300/30 bg-violet-300/10">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-200/30 border-t-violet-200" />
              </div>
              <div>
                <p className="text-sm font-medium text-violet-100">Task is happening...</p>
                <p className="mt-1 text-xs text-violet-200/60">Understanding your request and writing the code.</p>
              </div>
            </div>
          )}

          {transcription && (
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">You said</p>
              <p className="truncate text-sm text-zinc-300" title={transcription}>
                <span className="mr-2 text-emerald-400">↳</span>
                “{transcription}”
              </p>
            </div>
          )}
          {error && <p className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300">{error}</p>}
          </div>
        </section>

        {(code || isProcessing) && (
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111113]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="font-mono text-xs text-zinc-500">generated-output</span>
              </div>
              {code && (
                <button onClick={copyCode} className="text-xs text-zinc-400 transition hover:text-white">
                  {isCopied ? 'Copied' : 'Copy code'}
                </button>
              )}
            </div>
            {code ? (
              <pre className="max-h-[36rem] overflow-auto p-5 text-sm leading-7 text-zinc-200 [tab-size:2]">
                <code>{code}</code>
              </pre>
            ) : (
              <div className="space-y-3 p-5">
                <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
                <p className="pt-2 font-mono text-xs text-zinc-600">Preparing your output...</p>
              </div>
            )}
          </section>
        )}
        <p className="text-center text-xs text-zinc-600">Nothing is saved automatically. Your output stays on this page.</p>
      </div>
    </main>
  );
}