import React, { useRef, useEffect, useState } from 'react';
import { Eraser, Trash2, X, Pencil, Type } from 'lucide-react';

const ScratchPad = ({ onClose }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#3b82f6');
    const [lineWidth, setLineWidth] = useState(3);
    const [mode, setMode] = useState('draw'); // 'draw' or 'text'
    const [textItems, setTextItems] = useState([]);
    const [activeTextId, setActiveTextId] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Handle transparency
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const resizeCanvas = () => {
            const container = canvas.parentElement;
            const temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            ctx.putImageData(temp, 0, 0);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const handleCanvasClick = (e) => {
        if (mode !== 'text') return;

        const { offsetX, offsetY } = getCoordinates(e);
        const newId = Date.now();
        setTextItems(prev => [...prev, {
            id: newId,
            x: offsetX,
            y: offsetY,
            text: '',
            color: color
        }]);
        setActiveTextId(newId);
    };

    const handleTextChange = (id, val) => {
        setTextItems(prev => prev.map(item =>
            item.id === id ? { ...item, text: val } : item
        ));
    };

    const startDrawing = (e) => {
        if (mode !== 'draw') return;
        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || mode !== 'draw') return;
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
        setTextItems([]);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-fade-in border border-white/50">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            {mode === 'draw' ? <Pencil size={18} /> : <Type size={18} />}
                        </div>
                        <h2 className="font-bold text-slate-700">Tu Pizarrón Personal</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-200 p-1 rounded-xl">
                            <button
                                onClick={() => setMode('draw')}
                                className={`p-2 rounded-lg transition-all ${mode === 'draw' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                            >
                                <Pencil size={20} />
                            </button>
                            <button
                                onClick={() => setMode('text')}
                                className={`p-2 rounded-lg transition-all ${mode === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                            >
                                <Type size={20} />
                            </button>
                        </div>
                        <button
                            onClick={clearCanvas}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors flex items-center gap-2"
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
                <div className="flex-1 relative cursor-crosshair touch-none bg-slate-100/30 overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        onClick={handleCanvasClick}
                        className="absolute inset-0 w-full h-full"
                    />

                    {/* Render Typed Text Items */}
                    {textItems.map((item) => (
                        <div
                            key={item.id}
                            className="absolute pointer-events-auto"
                            style={{ left: item.x, top: item.y }}
                        >
                            <input
                                autoFocus={item.id === activeTextId}
                                className="bg-transparent border-none outline-none font-bold text-2xl p-0 min-w-[50px]"
                                style={{ color: item.color }}
                                value={item.text}
                                onChange={(e) => handleTextChange(item.id, e.target.value)}
                                placeholder="..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setActiveTextId(null);
                                    if (e.key === 'Backspace' && item.text === '') {
                                        setTextItems(prev => prev.filter(t => t.id !== item.id));
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Footer / Controls */}
                <div className="p-4 border-t flex flex-wrap items-center justify-center gap-6 bg-white">
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

                    {mode === 'draw' && (
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
                    )}

                    {mode === 'text' && (
                        <div className="text-xs text-slate-400 font-medium">
                            Tocá en cualquier lado para empezar a escribir ⌨️
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScratchPad;
