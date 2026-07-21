'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Image as ImageIcon, Mic, X, Trash2, StopCircle, FileText, Download, Heart, Reply } from 'lucide-react';
import { sendMessage, getMessages, deleteMessage } from '@/app/actions/messages';
import { uploadFile } from '@/app/actions/upload';
import Image from 'next/image';

function relativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Helper function to render text with clickable links
function renderContentWithLinks(content: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if (!content) return null;
  
  const parts = content.split(urlRegex);
  return (
    <span className="whitespace-pre-wrap break-words">
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a 
              key={i} 
              href={part} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline opacity-90 hover:opacity-100 transition-opacity"
              style={{ textDecorationColor: 'currentColor' }}
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export default function ChatClient({ conversationId, initialMessages, currentUserId }: any) {
  const [messages, setMessages] = useState(initialMessages);
  const [messageInput, setMessageInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await getMessages(conversationId);
      if (res.data) {
        setMessages((prev: any) => {
          const optimistics = prev.filter((m: any) => m.id.toString().startsWith('optimistic-'));
          // Compare stringified data to avoid unnecessary updates
          if (JSON.stringify(res.data) === JSON.stringify(prev.filter((m:any) => !m.id.toString().startsWith('optimistic-')))) {
             return prev;
          }
          return [...res.data!, ...optimistics];
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [conversationId]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch (err) {
      console.error('Error accessing microphone', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSend = () => {
    if (!messageInput.trim() && !imageFile && !documentFile && !audioBlob) return;

    const sentContent = messageInput.trim();
    let displayContent = sentContent;
    if (!displayContent) {
      if (imageFile) displayContent = '📷 Image';
      if (audioBlob) displayContent = '🎤 Voice Message';
      if (documentFile) displayContent = '📄 Document';
    }

    const optimistic = {
      id: `optimistic-${Date.now()}`,
      content: displayContent,
      createdAt: new Date(),
      senderId: currentUserId,
      isMe: true,
      sender: { name: 'You' },
      imageUrl: null,
      fileUrl: imageFile ? URL.createObjectURL(imageFile) : null,
      audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null,
      documentUrl: null, // Will be replaced by server
      documentName: documentFile ? documentFile.name : null,
    };

    const currentImage = imageFile;
    const currentAudio = audioBlob;
    const currentDoc = documentFile;

    setMessageInput('');
    setImageFile(null);
    setDocumentFile(null);
    setAudioBlob(null);
    setMessages((prev: any) => [...prev, optimistic]);

    startTransition(async () => {
      let uploadedImageUrl = undefined;
      let uploadedAudioUrl = undefined;
      let uploadedDocUrl = undefined;
      let uploadedDocName = undefined;

      if (currentImage) {
        const formData = new FormData();
        formData.append('file', currentImage);
        const res = await uploadFile(formData);
        if (res.url) uploadedImageUrl = res.url;
      }

      if (currentDoc) {
        const formData = new FormData();
        formData.append('file', currentDoc);
        const res = await uploadFile(formData);
        if (res.url) {
          uploadedDocUrl = res.url;
          uploadedDocName = currentDoc.name;
        }
      }

      if (currentAudio) {
        const formData = new FormData();
        formData.append('file', new File([currentAudio], 'voice.webm', { type: 'audio/webm' }));
        const res = await uploadFile(formData);
        if (res.url) uploadedAudioUrl = res.url;
      }

      const res = await sendMessage(conversationId, sentContent, undefined, uploadedAudioUrl, uploadedDocUrl, uploadedDocName, uploadedImageUrl);
      if (res.data) {
        setMessages((prev: any) =>
          prev.map((m: any) => (m.id === optimistic.id ? res.data : m))
        );
      }
    });
  };

  const handleDelete = async (msgId: string, type: 'me' | 'everyone') => {
    if (type === 'me') {
      setMessages((prev: any) => prev.filter((m: any) => m.id !== msgId));
    } else {
      setMessages((prev: any) => prev.map((m: any) => m.id === msgId ? { ...m, content: 'This message was deleted', imageUrl: null, fileUrl: null, audioUrl: null, documentUrl: null, documentName: null, deletedForEveryone: true } : m));
    }
    await deleteMessage(msgId, type);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col-reverse gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12">
            <span className="text-3xl">👋</span>
            <p className="font-rajdhani text-sm" style={{ color: 'var(--text-muted)' }}>
              No messages yet. Say hello!
            </p>
          </div>
        )}

        {[...messages].reverse().map((m: any) => {
          if (m.type === 'SYSTEM') {
            let displayText = m.content;
            
            if (m.content === 'CONNECTION_ACCEPTED') {
              if (m.senderId === currentUserId) {
                displayText = "You accepted the request. Say hello!";
              } else {
                const name = m.sender?.name || 'Someone';
                displayText = `${name} accepted your request. Say hello!`;
              }
            }

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center my-4"
              >
                <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs text-gray-400 font-rajdhani flex items-center gap-2">
                  <span>👋</span>
                  {displayText}
                </div>
              </motion.div>
            );
          }

          const isMe = m.senderId === currentUserId;
          const isDeleted = m.deletedForEveryone;

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}
              onMouseEnter={() => setHoveredMessageId(m.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              {/* Message Actions Menu */}
              {hoveredMessageId === m.id && !isDeleted && !m.id.toString().startsWith('optimistic-') && (
                <div className={`absolute top-1/2 -translate-y-1/2 flex gap-1 ${isMe ? 'right-full mr-2' : 'left-full ml-2'} z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  <button 
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white transition-all text-xs flex items-center justify-center"
                    title="React ❤️"
                  >
                    <Heart size={14} />
                  </button>
                  <button 
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white transition-all text-xs flex items-center justify-center"
                    title="Reply"
                  >
                    <Reply size={14} />
                  </button>
                  {isMe && (
                    <button 
                      onClick={() => handleDelete(m.id, 'everyone')}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/80 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white transition-all text-xs flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}

              <div
                className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm overflow-hidden"
                style={{
                  background: isMe ? (isDeleted ? 'rgba(255,255,255,0.05)' : 'var(--neon-color)') : 'var(--glass-bg)',
                  color: isMe && !isDeleted ? '#000' : 'var(--text-primary)',
                  border: isMe ? 'none' : '1px solid var(--glass-border)',
                  boxShadow: isMe && !isDeleted ? '0 0 12px rgba(var(--neon-color-rgb), 0.4)' : 'none',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontStyle: isDeleted ? 'italic' : 'normal',
                  opacity: isDeleted ? 0.6 : 1,
                }}
              >
                {(m.fileUrl || m.imageUrl) && !isDeleted && (
                  <div className="mb-2 relative rounded-xl overflow-hidden" style={{ width: '250px', height: '250px' }}>
                    <Image src={m.fileUrl || m.imageUrl} alt="Uploaded content" fill className="object-cover" unoptimized priority />
                  </div>
                )}
                
                {m.audioUrl && !isDeleted && (
                  <div className="mb-2">
                    <audio controls src={m.audioUrl} className="w-full h-10 max-w-[250px]" style={{ filter: isMe ? 'invert(1)' : 'none' }} />
                  </div>
                )}

                {(m.documentUrl || m.documentName) && !isDeleted && (
                  <a 
                    href={m.documentUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mb-2 flex items-center gap-3 p-3 rounded-xl border transition-colors"
                    style={{
                      borderColor: isMe ? 'rgba(0,0,0,0.1)' : 'var(--glass-border)',
                      backgroundColor: isMe ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div className="p-2 rounded-lg" style={{ backgroundColor: isMe ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate">{m.documentName}</p>
                      <p className="text-[10px] opacity-70">Document</p>
                    </div>
                    <Download size={16} className="opacity-70" />
                  </a>
                )}
                
                {m.content && renderContentWithLinks(m.content)}
                
                <p className="text-[10px] mt-1 font-rajdhani text-right" style={{ opacity: 0.6 }}>
                  {relativeTime(m.createdAt)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div
        className="w-full px-4 pb-6 pt-4 z-40 relative mt-auto flex flex-col gap-2"
        style={{ background: 'linear-gradient(to top, var(--bg-primary) 85%, transparent)' }}
      >
        {/* Preview Area for attachments */}
        {(imageFile || documentFile || audioBlob || isRecording) && (
          <div className="flex items-center gap-3 px-2 py-1 animate-in slide-in-from-bottom-2">
            {imageFile && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20">
                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                <button onClick={() => setImageFile(null)} className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 hover:bg-black/80 transition-colors">
                  <X size={12} color="white" />
                </button>
              </div>
            )}
            {documentFile && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/10 text-sm max-w-[200px]">
                <FileText size={14} className="flex-shrink-0 text-[var(--neon-color)]" />
                <span className="truncate">{documentFile.name}</span>
                <button onClick={() => setDocumentFile(null)} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors flex-shrink-0">
                  <X size={14} color="white" />
                </button>
              </div>
            )}
            {audioBlob && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/10 text-sm">
                <Mic size={14} className="text-[var(--neon-color)]" />
                <span>Voice Message Ready</span>
                <button onClick={() => setAudioBlob(null)} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
                  <X size={14} color="white" />
                </button>
              </div>
            )}
            {isRecording && (
              <div className="flex items-center gap-2 bg-red-500/20 px-3 py-2 rounded-lg border border-red-500/30 text-sm text-red-200">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                <button onClick={stopRecording} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
                  <StopCircle size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className="flex items-center gap-2 glass rounded-2xl px-2 py-1.5"
          style={{ border: '1px solid rgba(var(--neon-color-rgb), 0.3)' }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }} 
          />
          <input 
            type="file" 
            ref={docInputRef} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setDocumentFile(e.target.files[0]);
              }
            }} 
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
            title="Attach Image"
          >
            <ImageIcon size={18} />
          </button>

          <button
            onClick={() => docInputRef.current?.click()}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
            title="Attach Document"
          >
            <FileText size={18} />
          </button>

          {!isRecording ? (
            <button
              onClick={startRecording}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
              title="Record Voice"
            >
              <Mic size={18} />
            </button>
          ) : null}

          <input
            id="chat-input"
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isPending && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm px-2"
            style={{ color: 'var(--text-primary)' }}
            disabled={isRecording}
          />
          
          <button
            id="send-message-btn"
            onClick={handleSend}
            disabled={isPending || (!messageInput.trim() && !imageFile && !audioBlob && !documentFile)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
            style={{
              background: (messageInput.trim() || imageFile || audioBlob || documentFile) ? 'var(--neon-color)' : 'rgba(255,255,255,0.06)',
              boxShadow: (messageInput.trim() || imageFile || audioBlob || documentFile) ? '0 0 10px rgba(var(--neon-color-rgb), 0.5)' : 'none',
            }}
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" color={(messageInput.trim() || imageFile || audioBlob || documentFile) ? '#000' : 'var(--text-muted)'} />
            ) : (
              <Send size={16} color={(messageInput.trim() || imageFile || audioBlob || documentFile) ? '#000' : 'var(--text-muted)'} style={{ marginLeft: 2 }} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
