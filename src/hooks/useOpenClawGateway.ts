import { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ChatMessage } from '../types';

const GATEWAY_URL = 'ws://127.0.0.1:18789/gateway';
const AUTH_TOKEN = '90860c426ae82c17b9dad476c6a8d7668b9cf9dcc8baaaf8';

// Protocol messages
interface GatewayMessage {
    type: string;
    [key: string]: any;
}

export function useOpenClawGateway() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');

    const { sendMessage, lastMessage, readyState } = useWebSocket(GATEWAY_URL, {
        shouldReconnect: () => true,
        reconnectInterval: 3000,
        onOpen: () => {
            console.log('Connected to Gateway, sending handshake...');
            sendMessage(JSON.stringify({
                type: 'req',
                id: 'connect-1',
                method: 'connect',
                params: {
                    minProtocol: 3,
                    maxProtocol: 3,
                    client: {
                        id: 'openclaw-control-ui',
                        version: '1.0.0',
                        platform: 'web',
                        mode: 'webchat'
                    },
                    device: {
                        id: '73f68e0d3018bd50a58b4b512ac72394a60f57cde2989d34158144ed4af7f12a',
                        publicKey: 'local-trust',
                        signature: 'local-trust',
                        signedAt: Date.now()
                    },
                    auth: { token: AUTH_TOKEN }
                }
            }));
        },
        onClose: (event) => {
            console.error('Disconnected:', event.code, event.reason);
        },
        // We don't need queryParams if we send it in the first frame params
    });

    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const raw = lastMessage.data;
                const data = JSON.parse(raw) as GatewayMessage;
                console.log('Received:', data);

                switch (data.type) {
                    case 'res':
                        if (data.id === 'connect-1' && data.ok) {
                            console.log('Handshake Successful:', data.payload);
                        }
                        break;

                    case 'event':
                        if (data.event === 'connect.challenge' && data.payload?.nonce) {
                            console.log('Handling challenge:', data.payload.nonce);
                            sendMessage(JSON.stringify({
                                type: 'req',
                                id: 'connect-1',
                                method: 'connect',
                                params: {
                                    minProtocol: 3,
                                    maxProtocol: 3,
                                    client: {
                                        id: 'openclaw-control-ui',
                                        version: '1.0.0',
                                        platform: 'web',
                                        mode: 'webchat'
                                    },
                                    device: {
                                        id: '73f68e0d3018bd50a58b4b512ac72394a60f57cde2989d34158144ed4af7f12a',
                                        publicKey: 'local-trust',
                                        signature: 'local-trust',
                                        signedAt: Date.now(),
                                        nonce: data.payload.nonce
                                    },
                                    auth: {
                                        token: AUTH_TOKEN
                                    }
                                }
                            }));
                        }
                        break;

                    case 'chat.history':
                        // Replace history
                        setMessages(data.messages || []);
                        break;

                    case 'chat.message':
                    case 'chat.inject':
                        // Append single message
                        const newMessage: ChatMessage = {
                            id: Date.now().toString(),
                            role: data.role || 'assistant',
                            content: data.message || data.content || '',
                            created_at: Date.now()
                        };
                        setMessages(prev => [...prev, newMessage]);
                        setIsThinking(false);
                        break;

                    case 'chat.typing':
                        setIsThinking(true);
                        break;

                    case 'chat.stop_typing':
                        setIsThinking(false);
                        break;
                }
            } catch (e) {
                console.error('Failed to parse WS message', e);
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        const statusMap = {
            [ReadyState.CONNECTING]: 'Connecting',
            [ReadyState.OPEN]: 'Present',
            [ReadyState.CLOSING]: 'Closing',
            [ReadyState.CLOSED]: 'Disconnected',
            [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
        };
        setConnectionStatus(statusMap[readyState]);
    }, [readyState]);

    const send = useCallback((text: string) => {
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            created_at: Date.now()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsThinking(true);

        sendMessage(JSON.stringify({
            type: 'req',
            id: `msg-${Date.now()}`,
            method: 'chat.send',
            params: {
                message: text
            }
        }));
    }, [sendMessage]);

    return {
        messages,
        isThinking,
        connectionStatus,
        send
    };
}
