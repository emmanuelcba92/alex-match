import React, { useState } from 'react';
import GlassCard from './GlassCard';

const AlexAvatar = ({ message, type = 'info' }) => {
    // Types: 'info', 'success', 'error', 'tip'
    const getBorderColor = () => {
        switch (type) {
            case 'success': return 'border-green-400';
            case 'error': return 'border-red-400';
            case 'tip': return 'border-yellow-400';
            default: return 'border-blue-400';
        }
    };

    return (
        <div className="flex items-start gap-4 animate-fade-in">
            <div className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl border-4 ${getBorderColor()} overflow-hidden shrink-0`}>
                👨‍🏫
            </div>
            {message && (
                <div className="relative">
                    <GlassCard className="rounded-tl-none py-3 px-5 text-slate-700 text-lg font-medium leading-normal animate-bounce-short">
                        {message}
                    </GlassCard>
                    {/* Speech bubble tail */}
                    <div className="absolute top-0 -left-2 w-4 h-4 bg-white/30 backdrop-blur-md border border-white/40 transform skew-x-[20deg] rotate-45 border-r-0 border-b-0"></div>
                </div>
            )}
        </div>
    );
};

export default AlexAvatar;
