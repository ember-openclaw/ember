import { useOpenClawGateway } from './hooks/useOpenClawGateway';
import { EmberPresence } from './components/EmberPresence';
import { ChatInterface } from './components/ChatInterface';

function App() {
    const { messages, isThinking, connectionStatus, send } = useOpenClawGateway();

    return (
        <div className="min-h-screen bg-bg-deep text-text-primary font-sans flex items-center justify-center p-0 md:p-8">
            <div className="w-full max-w-[1400px] h-screen md:h-[90vh] bg-bg-deep md:bg-bg-dark/50 md:backdrop-blur-sm md:border md:border-border-subtle rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_500px]">
                {/* Left: Ember Presence */}
                <div className="h-[40vh] md:h-full order-1 md:order-1">
                    <EmberPresence status={connectionStatus} isThinking={isThinking} />
                </div>

                {/* Right: Chat Interface */}
                <div className="h-[60vh] md:h-full order-2 md:order-2 border-t border-border-subtle md:border-t-0 md:border-l">
                    <ChatInterface
                        messages={messages}
                        onSend={send}
                        disabled={connectionStatus !== 'Present'}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
