import React from 'react';
import GlassCard from './GlassCard';

const MathProblem = ({ problem, input, setInput, onCheck, onTip }) => {
    if (!problem) return null;

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-lg">
            <GlassCard className="w-full text-center py-10">
                <h2 className="text-4xl font-bold text-slate-700 mb-2">{problem.question}</h2>
                {problem.isMultipleChoice ? (
                    <div className="grid grid-cols-1 gap-3 mt-6">
                        {problem.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => setInput(option)}
                                className={`p-3 rounded-lg border-2 transition-all ${input === option
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'bg-white/50 border-white/40 hover:bg-blue-50'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    <input
                        type="number"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onCheck()}
                        className="text-4xl text-center w-full bg-transparent border-b-2 border-slate-300 focus:border-blue-500 outline-none py-2 text-slate-700 placeholder-slate-300"
                        placeholder="?"
                        autoFocus
                    />
                )}
            </GlassCard>

            <div className="flex gap-4 w-full">
                <button
                    onClick={onCheck}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all active:scale-95"
                >
                    Verificar
                </button>
                <button
                    onClick={onTip}
                    className="flex-none bg-yellow-100 text-yellow-700 font-bold py-3 px-4 rounded-xl shadow-md hover:bg-yellow-200 transition-all active:scale-95"
                    title="Pedir un tip"
                >
                    💡 ¿Tip?
                </button>
            </div>
        </div>
    );
};

export default MathProblem;
