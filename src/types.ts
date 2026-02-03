export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    created_at: number;
}

export interface ChatHistoryPayload {
    type: 'chat.history';
    messages: ChatMessage[];
}

export interface ChatSendPayload {
    type: 'chat.send';
    message: string;
}

export interface ChatInjectPayload {
    type: 'chat.inject';
    message: string;
}

export interface ChatEventPayload {
    type: 'chat.typing' | 'chat.stop_typing' | 'chat.error';
    payload?: any;
}
