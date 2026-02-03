import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import Markdown from 'react-markdown';
import { Send, Terminal } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
    messages: ChatMessage[];
    onSend: (text: string) => void;
    disabled?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSend, disabled }) => {
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;
        onSend(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-bg-dark">
            {/* Header */}
            <div className="p-6 border-b border-border-subtle">
                <h2 className="text-xs font-medium uppercase tracking-widest text-text-secondary flex items-center gap-2">
                    <Terminal size={14} /> Conversation
                </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {messages.length === 0 && (
                    <div className="text-center text-text-dim text-sm mt-10">
                        Ready to connect.
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={clsx(
                        "max-w-[90%] p-4 rounded-xl text-sm leading-relaxed animate-message-in",
                        msg.role === 'user'
                            ? "self-end bg-accent/10 border border-accent/20"
                            : "self-start bg-bg-card border border-border-subtle border-l-2 border-l-ember-core"
                    )}>
                        <div className={clsx(
                            "text-[0.7rem] font-medium uppercase tracking-wider mb-2",
                            msg.role === 'user' ? "text-text-dim" : "text-accent"
                        )}>
                            {msg.role === 'user' ? 'You' : 'Ember'}
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none text-text-primary">
                            <Markdown>{msg.content}</Markdown>
                        </div>
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-border-subtle">
                <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Say something..."
                        className="flex-1 bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder-text-dim focus:outline-none focus:border-accent/40 transition-colors"
                        disabled={disabled}
                    />
                    <button
                        type="submit"
                        disabled={disabled || !input.trim()}
                        className="bg-ember-core text-bg-deep p-3 rounded-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};
