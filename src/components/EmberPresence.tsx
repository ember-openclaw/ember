import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface EmberPresenceProps {
    status: string;
    isThinking: boolean;
}

export const EmberPresence: React.FC<EmberPresenceProps> = ({ status, isThinking }) => {
    const [logs, setLogs] = useState<{ time: string; msg: string; type: 'system' | 'thought' }[]>([]);

    // Simulation of internal log stream
    useEffect(() => {
        if (isThinking) {
            addLog('thought', 'processing...');
        } else if (status === 'Present') {
            // randomly add a log every once in a while to feel alive
            const interval = setInterval(() => {
                if (Math.random() > 0.7) {
                    addLog('system', 'monitoring...');
                }
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isThinking, status]);

    const addLog = (type: 'system' | 'thought', msg: string) => {
        const time = new Date().toTimeString().slice(0, 5);
        setLogs(prev => [...prev.slice(-4), { time, msg, type }]);
    };

    return (
        <div className="flex flex-col items-center justify-center relative p-8 h-full border-b border-border-subtle md:border-b-0 md:border-r">
            {/* The Ember Orb */}
            <div className="relative flex items-center justify-center mb-8">
                <div className={clsx(
                    "absolute w-[280px] h-[280px] rounded-full blur-[30px] ember-halo-gradient",
                    isThinking ? "animate-[halo-breathe_2s_ease-in-out_infinite]" : "animate-halo-breathe"
                )} />

                <div className={clsx(
                    "absolute w-[140px] h-[140px] rounded-full blur-[20px] ember-glow-mid-gradient",
                    isThinking ? "animate-[breathe_2s_ease-in-out_infinite]" : "animate-breathe"
                )} />

                <div className={clsx(
                    "relative w-[50px] h-[50px] rounded-full ember-core-gradient",
                    isThinking ? "animate-[core-breathe_1.5s_ease-in-out_infinite]" : "animate-core-breathe"
                )}>
                    {/* Morphing overlay */}
                    <div className="absolute -top-[5%] -left-[5%] w-[110%] h-[110%] rounded-[45%_55%_50%_50%_/_50%_45%_55%_50%] bg-inherit blur-[2px] opacity-70 animate-[morph_8s_ease-in-out_infinite]" />
                </div>

                {/* Particles */}
                <div className="absolute w-[100px] h-[150px] pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <div key={i}
                            className="absolute w-[3px] h-[3px] bg-accent/80 rounded-full blur-[1px] animate-float-up"
                            style={{
                                left: `${40 + (i * 5)}%`,
                                animationDelay: `${i * 0.7}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Status Text */}
            <div className="text-center mt-4">
                <div className="text-2xl font-medium tracking-wider text-accent mb-2">Ember</div>
                <div className="text-xs uppercase tracking-[0.15em] text-text-dim">
                    {isThinking ? 'Thinking...' : status}
                </div>
            </div>

            {/* Log Stream */}
            <div className="hidden md:block absolute bottom-8 left-8 right-8 max-h-[120px] overflow-hidden log-stream-mask">
                {logs.map((log, i) => (
                    <div key={i} className={clsx(
                        "text-[0.7rem] font-mono py-1 animate-fade-in",
                        log.type === 'thought' ? "text-text-secondary" : "text-ember-glow"
                    )}>
                        <span className="text-accent/40 mr-2">{log.time}</span>
                        {log.msg}
                    </div>
                ))}
            </div>
        </div>
    );
};
