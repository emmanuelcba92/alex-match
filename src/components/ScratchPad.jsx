import React, { useRef, useEffect, useState } from 'react';
import { Eraser, Trash2, X, Pencil } from 'lucide-react';

const ScratchPad = ({ onClose }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#3b82f6');
    const [lineWidth, setLineWidth] = useState(3);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Handle transparency
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const resizeCanvas = () => {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Handle touch events
        if (e.touches && e.touches[0]) {
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        }

        // Handle mouse events
        return {
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-fade-in border border-white/50">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <Pencil size={18} />
                        </div>
                        <h2 className="font-bold text-slate-700">Tu Pizarrón Personal</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearCanvas}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors flex items-center gap-2"
                            title="Limpiar todo"
                        >
                            <Trash2 size={20} />
                            <span className="text-sm font-medium hidden sm:inline">Limpiar</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 relative cursor-crosshair touch-none bg-slate-50/50">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="absolute inset-0 w-full h-full"
                    />
                </div>

                {/* Footer / Controls */}
                <div className="p-4 border-t flex items-center justify-center gap-6 bg-white">
                    <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl">
                        {[
                            { color: '#3b82f6', label: 'Azul' },
                            { color: '#ef4444', label: 'Rojo' },
                            { color: '#10b981', label: 'Verde' },
                            { color: '#1e293b', label: 'Negro' }
                        ].map((c) => (
                            <button
                                key={c.color}
                                onClick={() => setColor(c.color)}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c.color ? 'border-white ring-2 ring-blue-400' : 'border-transparent'}`}
                                style={{ backgroundColor: c.color }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <span>Trazo</span>
                        <input
                            type="range"
                            min="1"
                            max="15"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(parseInt(e.target.value))}
                            className="w-24 sm:w-32 accent-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScratchPad;
