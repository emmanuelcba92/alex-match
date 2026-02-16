import React from 'react';
import { TOPICS } from '../utils/mathEngine';
import { Calculator, Divide, BookOpen } from 'lucide-react';

const TopicSelector = ({ currentTopic, onSelectTopic, config, onUpdateConfig }) => {
    const topics = [
        { id: TOPICS.MULTIPLICATION, label: 'Multiplicación', icon: Calculator },
        { id: TOPICS.DIVISION, label: 'División', icon: Divide },
        { id: TOPICS.PROPERTIES, label: 'Propiedades', icon: BookOpen },
    ];

    const handleConfigChange = (type, key, value) => {
        onUpdateConfig({
            [type]: {
                ...config[type],
                [key]: parseInt(value)
            }
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full md:w-64">
            <h3 className="text-slate-500 font-semibold uppercase text-xs tracking-wider mb-2 px-2">Temas</h3>
            {topics.map((t) => {
                const Icon = t.icon;
                const isActive = currentTopic === t.id;
                return (
                    <div key={t.id} className="flex flex-col">
                        <button
                            onClick={() => onSelectTopic(t.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${isActive
                                ? 'bg-white shadow-lg text-blue-600 scale-105 z-10'
                                : 'text-slate-600 hover:bg-white/50 hover:pl-5'
                                }`}
                        >
                            <Icon size={20} />
                            {t.label}
                        </button>

                        {/* Config Panel */}
                        {isActive && t.id === TOPICS.MULTIPLICATION && config && (
                            <div className="mt-2 text-sm bg-white/40 p-3 rounded-lg flex flex-col gap-2 animate-fade-in">
                                <label className="flex justify-between items-center text-slate-700">
                                    Cifras 1º N°:
                                    <select
                                        value={config.multiplication.digits1}
                                        onChange={(e) => handleConfigChange('multiplication', 'digits1', e.target.value)}
                                        className="bg-white/80 rounded px-1 py-0.5 text-blue-800 font-bold outline-none ring-1 ring-blue-200"
                                    >
                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </label>
                                <label className="flex justify-between items-center text-slate-700">
                                    Cifras 2º N°:
                                    <select
                                        value={config.multiplication.digits2}
                                        onChange={(e) => handleConfigChange('multiplication', 'digits2', e.target.value)}
                                        className="bg-white/80 rounded px-1 py-0.5 text-blue-800 font-bold outline-none ring-1 ring-blue-200"
                                    >
                                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </label>
                            </div>
                        )}

                        {isActive && t.id === TOPICS.DIVISION && config && (
                            <div className="mt-2 text-sm bg-white/40 p-3 rounded-lg flex flex-col gap-2 animate-fade-in">
                                <label className="flex justify-between items-center text-slate-700">
                                    Dividendo:
                                    <select
                                        value={config.division.digits1}
                                        onChange={(e) => handleConfigChange('division', 'digits1', e.target.value)}
                                        className="bg-white/80 rounded px-1 py-0.5 text-blue-800 font-bold outline-none ring-1 ring-blue-200"
                                    >
                                        {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </label>
                                <label className="flex justify-between items-center text-slate-700">
                                    Divisor:
                                    <select
                                        value={config.division.digits2}
                                        onChange={(e) => handleConfigChange('division', 'digits2', e.target.value)}
                                        className="bg-white/80 rounded px-1 py-0.5 text-blue-800 font-bold outline-none ring-1 ring-blue-200"
                                    >
                                        {[1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </label>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TopicSelector;
