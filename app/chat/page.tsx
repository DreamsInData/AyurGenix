'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/lib/context';
import { chatWithAI } from '@/lib/api';
import { MessageCircle, Send, Loader2, Trash2, Bot, User } from 'lucide-react';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export default function ChatPage() {
    const { userData, updateUser } = useUser();
    const [messages, setMessages] = useState<ChatMessage[]>(
        (userData.chatHistory || []).map(m => ({ ...m, timestamp: Date.now() }))
    );
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scroll = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scroll, [messages]);

    const prakriti = userData.prakritiResult
        ? JSON.parse(userData.prakritiResult)?.prakriti?.constitution_type || ''
        : '';
    const userContext = [
        prakriti && `Prakriti: ${prakriti}`,
        userData.symptoms.length > 0 && `Symptoms: ${userData.symptoms.join(', ')}`,
        userData.age && `Age: ${userData.age}`,
        userData.gender && `Gender: ${userData.gender}`,
    ].filter(Boolean).join('. ');

    const sendMessage = async () => {
        if (!input.trim() || loading) return;


        const userMsg: ChatMessage = { role: 'user', content: input.trim(), timestamp: Date.now() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        const history = newMessages.slice(-10).map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
        }));

        const res = await chatWithAI(
            history.slice(0, -1),
            userMsg.content,
            userContext
        );

        if (res.success) {
            const assistantMsg: ChatMessage = { role: 'assistant', content: res.content, timestamp: Date.now() };
            const updated = [...newMessages, assistantMsg];
            setMessages(updated);
            updateUser({ chatHistory: updated.map(m => ({ role: m.role, content: m.content })) });
        } else {
            const errorMsg: ChatMessage = { role: 'assistant', content: `❌ Error: ${res.error}`, timestamp: Date.now() };
            setMessages([...newMessages, errorMsg]);
        }
        setLoading(false);
    };

    const clearChat = () => {
        setMessages([]);
        updateUser({ chatHistory: [] });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const suggestions = [
        'What foods should I eat for my Dosha?',
        'Suggest yoga for stress relief',
        'What herbs help with digestion?',
        'Create a morning routine for me',
        'How to improve sleep quality?',
        'Explain Vata-Pitta constitution',
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>


            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #40c4ff, #0288d1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(64, 196, 255, 0.3)',
                    }}>
                        <MessageCircle size={22} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem' }}>AI Ayurvedic Chat</h1>
                        <p style={{ fontSize: '11px', color: '#66bb6a' }}>
                            {userContext ? `Context: ${userContext.substring(0, 60)}...` : 'No user context — take the Prakriti quiz first'}
                        </p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button onClick={clearChat} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ff5252' }}>
                        <Trash2 size={12} /> Clear
                    </button>
                )}
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '16px 0',
                display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
                {messages.length === 0 && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px',
                            background: 'rgba(64,196,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Bot size={32} color="#40c4ff" />
                        </div>
                        <p style={{ color: '#a5d6a7', fontSize: '15px', textAlign: 'center', maxWidth: '400px' }}>
                            Ask me anything about Ayurveda, your Dosha, diet, yoga, herbs, or daily routine!
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '500px' }}>
                            {suggestions.map((s, i) => (
                                <button key={i} onClick={() => { setInput(s); inputRef.current?.focus(); }} style={{
                                    padding: '8px 14px', borderRadius: '20px', fontSize: '12px',
                                    background: 'rgba(64,196,255,0.06)', border: '1px solid rgba(64,196,255,0.12)',
                                    color: '#85c1e9', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                    transition: 'all 0.2s',
                                }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex', gap: '10px',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                            background: msg.role === 'user'
                                ? 'linear-gradient(135deg, #2ecc71, #27ae60)'
                                : 'linear-gradient(135deg, #40c4ff, #0288d1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {msg.role === 'user' ? <User size={16} color="#fff" /> : <Bot size={16} color="#fff" />}
                        </div>
                        <div style={{
                            maxWidth: '75%', padding: '14px 18px', borderRadius: '16px',
                            background: msg.role === 'user'
                                ? 'rgba(46, 204, 113, 0.12)'
                                : 'rgba(22, 32, 25, 0.6)',
                            border: msg.role === 'user'
                                ? '1px solid rgba(46, 204, 113, 0.2)'
                                : '1px solid rgba(46, 204, 113, 0.08)',
                            fontSize: '14px', color: '#e8f5e9', lineHeight: 1.65,
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #40c4ff, #0288d1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Bot size={16} color="#fff" />
                        </div>
                        <div style={{
                            padding: '14px 18px', borderRadius: '16px',
                            background: 'rgba(22, 32, 25, 0.6)',
                            border: '1px solid rgba(46, 204, 113, 0.08)',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '14px', color: '#66bb6a',
                        }}>
                            <Loader2 size={14} style={{ animation: 'spin-slow 1s linear infinite' }} />
                            Thinking...
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
                display: 'flex', gap: '10px', padding: '16px 0 0',
                borderTop: '1px solid rgba(46, 204, 113, 0.08)',
            }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about Ayurveda, your Dosha, diet, herbs..."
                        rows={1}
                        style={{
                            width: '100%', padding: '14px 16px', borderRadius: '14px',
                            background: 'rgba(22, 32, 25, 0.6)',
                            border: '1px solid rgba(46, 204, 113, 0.15)',
                            color: '#e8f5e9', fontSize: '14px', fontFamily: 'Inter, sans-serif',
                            outline: 'none', resize: 'none',
                            minHeight: '48px', maxHeight: '120px',
                        }}
                    />
                </div>
                <button onClick={sendMessage} className="btn-primary"
                    style={{
                        padding: '14px 18px', borderRadius: '14px',
                        opacity: (!input.trim() || loading) ? 0.5 : 1,
                    }}
                    disabled={!input.trim() || loading}>
                    <Send size={18} />
                </button>
            </div>

            {/* Disclaimer */}
            <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '11px', color: '#66bb6a' }}>
                ⚕️ AI guidance is educational only. Consult a healthcare professional for medical advice.
            </div>
        </div>
    );
}
