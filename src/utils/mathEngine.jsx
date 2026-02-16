export const TOPICS = {
    MULTIPLICATION: 'multiplication',
    DIVISION: 'division',
    PROPERTIES: 'properties',
    TRIANGLES: 'triangles',
    FRACTIONS: 'fractions',
};

import React from 'react';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


const getRange = (digits) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return { min, max };
};

export const generateProblem = (topic, config) => {
    switch (topic) {
        case TOPICS.MULTIPLICATION: {
            const d1 = config?.multiplication?.digits1 || 4;
            const d2 = config?.multiplication?.digits2 || 2;
            const range1 = getRange(d1);
            const range2 = getRange(d2);

            const num1 = getRandomInt(range1.min, range1.max);
            const num2 = getRandomInt(range2.min, range2.max);
            return {
                type: topic,
                question: `${num1} x ${num2}`,
                answer: num1 * num2,
                details: { num1, num2 }
            };
        }
        case TOPICS.DIVISION: {
            const d1 = config?.division?.digits1 || 3;
            const d2 = config?.division?.digits2 || 1;

            const rangeDivisor = getRange(d2);
            const divisor = getRandomInt(rangeDivisor.min, rangeDivisor.max);

            const rangeDividend = getRange(d1);

            let dividend = getRandomInt(rangeDividend.min, rangeDividend.max);
            const remainder = dividend % divisor;
            dividend = dividend - remainder;

            if (dividend < rangeDividend.min) dividend += divisor;

            const quotient = dividend / divisor;

            return {
                type: topic,
                question: `${dividend} ÷ ${divisor}`,
                answer: quotient,
                details: { dividend, divisor }
            };
        }
        case TOPICS.PROPERTIES: {
            const properties = [
                { name: 'Conmutativa', example: (a, b) => `${a} x ${b} = ${b} x ${a}` },
                { name: 'Asociativa', example: (a, b, c) => `(${a} x ${b}) x ${c} = ${a} x (${b} x ${c})` },
                { name: 'Distributiva', example: (a, b, c) => `${a} x (${b} + ${c}) = ${a}x${b} + ${a}x${c}` },
            ];
            const selectedProp = properties[getRandomInt(0, properties.length - 1)];
            const a = getRandomInt(2, 9);
            const b = getRandomInt(2, 9);
            const c = getRandomInt(2, 9);

            return {
                type: topic,
                question: `¿Qué propiedad es: ${selectedProp.example(a, b, c)}?`,
                answer: selectedProp.name,
                options: properties.map(p => p.name).sort(() => Math.random() - 0.5),
                isMultipleChoice: true
            };
        }
        case TOPICS.TRIANGLES: {
            const types = ['Equilátero', 'Isósceles', 'Escaleno'];
            const type = types[getRandomInt(0, 2)];
            let sides = [];

            if (type === 'Equilátero') {
                const s = getRandomInt(5, 15);
                sides = [s, s, s];
            } else if (type === 'Isósceles') {
                const base = getRandomInt(4, 12);
                const equalSide = getRandomInt(base + 1, base * 2); // Ensure triangle inequality
                sides = [equalSide, equalSide, base];
            } else {
                // Scalene
                let a, b, c;
                do {
                    a = getRandomInt(5, 15);
                    b = getRandomInt(5, 15);
                    c = getRandomInt(5, 15);
                } while (a === b || b === c || a === c || a + b <= c || a + c <= b || b + c <= a); // Ensure distinct and valid
                sides = [a, b, c];
            }

            // Shuffle sides for display? Or keep them sorted? Usually diagrams show relative lengths.
            // Let's create a visual representation (SVG)
            const maxSide = Math.max(...sides);
            const scale = 150 / maxSide; // Scale to fit in 200x200 box
            // Coordinates: Base on x-axis.
            // A=(0,0), B=(side3, 0). C found by intersection of circle(A, s1) and circle(B, s2).
            // Let side3 be the base. s1 = sides[0], s2 = sides[1], s3 = sides[2]

            // Simple visualization: Just numbers and a generic triangle or specific shape?
            // Let's try to draw it roughly.
            // Cosine rule to find coordinates of C (x, y)
            // x = (s3^2 + s1^2 - s2^2) / (2 * s3)
            // y = sqrt(s1^2 - x^2)

            const s1 = sides[0];
            const s2 = sides[1];
            const s3 = sides[2]; // Base

            const cx = (s3 * s3 + s1 * s1 - s2 * s2) / (2 * s3);
            const cy = Math.sqrt(Math.abs(s1 * s1 - cx * cx));

            const p1 = { x: 20, y: 180 }; // Bottom-left
            const p2 = { x: 20 + s3 * scale, y: 180 }; // Bottom-right
            const p3 = { x: 20 + cx * scale, y: 180 - cy * scale }; // Top

            const svgContent = (
                <svg width="250" height="200" viewBox="0 0 250 200" className="mx-auto my-4 overflow-visible">
                    <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill="#e0f2fe" stroke="#3b82f6" strokeWidth="4" strokeLinejoin="round" />
                    {/* Labels */}
                    <text x={(p1.x + p3.x) / 2 - 15} y={(p1.y + p3.y) / 2} fill="#1e40af" fontWeight="bold">{s1}</text>
                    <text x={(p2.x + p3.x) / 2 + 5} y={(p2.y + p3.y) / 2} fill="#1e40af" fontWeight="bold">{s2}</text>
                    <text x={(p1.x + p2.x) / 2} y={p1.y + 20} fill="#1e40af" fontWeight="bold" textAnchor="middle">{s3}</text>
                </svg>
            );

            return {
                type: topic,
                question: (
                    <div>
                        <div className="text-xl mb-2 fuente-argentina">¿Qué tipo de triángulo es según sus lados?</div>
                        {svgContent}
                    </div>
                ),
                answer: type,
                options: types.sort(() => Math.random() - 0.5),
                isMultipleChoice: true
            };
        }
        case TOPICS.FRACTIONS: {
            const den = getRandomInt(2, 10);
            const n1 = getRandomInt(1, den - 1);
            const n2 = getRandomInt(1, den - 1);

            const isSum = Math.random() > 0.5;
            const op = isSum ? '+' : '-';
            let ansNum = isSum ? n1 + n2 : Math.abs(n1 - n2);
            if (ansNum === 0) ansNum = 1;

            return {
                type: topic,
                question: (
                    <div className="flex items-center justify-center gap-4 text-4xl font-bold py-6">
                        <div className="flex flex-col items-center">
                            <span className="border-b-4 border-slate-700 w-full text-center">{n1 === n2 && !isSum ? n1 + 1 : Math.max(n1, n2)}</span>
                            <span>{den}</span>
                        </div>
                        <span className="text-5xl">{op}</span>
                        <div className="flex flex-col items-center">
                            <span className="border-b-4 border-slate-700 w-full text-center">{n1 === n2 && !isSum ? 1 : Math.min(n1, n2)}</span>
                            <span>{den}</span>
                        </div>
                        <span>=</span>
                    </div>
                ),
                answer: isSum ? (Math.max(n1, n2) + Math.min(n1, n2)) : (Math.max(n1, n2) - Math.min(n1, n2)),
                details: { den },
                hint: `Como tienen el mismo denominador (${den}), ¡solo tenés que ${isSum ? 'sumar' : 'restar'} los números de arriba!`
            };
        }
        default:
            return null;
    }
};

export const getAlexTip = (topic) => {
    switch (topic) {
        case TOPICS.MULTIPLICATION:
            return (
                <div className="text-left text-sm space-y-2">
                    <p className="font-bold text-blue-600">¡Che, escuchá este truco!</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Multiplicá la unidad (el último numerito de abajo) por todo lo de arriba.</li>
                        <li>Cuando pases a la decena, <strong>¡no te olvides de dejar el lugar!</strong> Poné un 0 o un guión.</li>
                        <li>Sumá todo al final. ¡Re fácil!</li>
                    </ol>
                </div>
            );
        case TOPICS.DIVISION:
            return (
                <div className="text-left text-sm space-y-2">
                    <p className="font-bold text-blue-600">Dividir es como repartir caramelos:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Agarrá los primeros números de la izquierda que sean más grandes que el divisor.</li>
                        <li>¿Cuántas veces entra el divisor ahí? Si te sobran, bajá el número que sigue al lado.</li>
                        <li>¡Seguí así hasta que no queden más para bajar!</li>
                    </ol>
                </div>
            );
        case TOPICS.PROPERTIES:
            return (
                <div className="text-left text-sm space-y-2">
                    <p><strong>Conmutativa:</strong> "Cambiamos de lugar". <span className="text-blue-600 font-bold">5x3 = 3x5</span>. ¡El orden no importa, viste!</p>
                    <p><strong>Asociativa:</strong> "Agrupamos distinto". Los paréntesis no cambian nada si es todo multiplicación.</p>
                    <p><strong>Distributiva:</strong> El de afuera se "reparte" multiplicando a los que están adentro sumando.</p>
                </div>
            );
        case TOPICS.TRIANGLES:
            return (
                <div className="text-left text-sm space-y-2">
                    <p><strong>Acordate de estos nombres:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Equilátero:</strong> ¡Re equilibrado! Lados todos igualitos.</li>
                        <li><strong>Isósceles:</strong> Solo tiene dos lados gemelos.</li>
                        <li><strong>Escaleno:</strong> Un lío total, ¡todos los lados distintos!</li>
                    </ul>
                </div>
            );
        case TOPICS.FRACTIONS:
            return (
                <div className="text-left text-sm space-y-2">
                    <p><strong>Sumar fracciones es una papa:</strong></p>
                    <p>Si el de abajo (denominador) es igual, se queda como está. ¡Ni se te ocurra sumarlo! Solo sumá o restá los de arriba (numeradores).</p>
                </div>
            );
        default:
            return '¡Dale que vos podés, sos un crack!';
    }
};

export const getAlexHint = (problem, wrongAnswer) => {
    if (!problem) return '¡Dale de nuevo, che!';

    const successPhrases = ["¡Vaaaaamoooo! ¡Sos un crack!", "¡Re bien! ¡La tenés clara!", "¡De diez, sabelo!", "¡Impresionante, che!"];
    const retryPhrases = ["¡Casi, casi!", "¡Por un pelito!", "¡Epa! Revisá ese paso.", "¡Che, fijate bien!"];

    if (problem.type === TOPICS.MULTIPLICATION) {
        const { num1, num2 } = problem.details;
        const unit = num2 % 10;
        if (String(wrongAnswer).slice(-1) !== String(problem.answer).slice(-1)) {
            return `Che, fijate la cuenta de las unidades (${num1} x ${unit}). ¡Ahí hubo un pifie!`;
        }
        return `¡Casi! Capaz te olvidaste de sumar lo que "te llevabas" o de dejar el espacio en la segunda fila.`;
    }

    if (problem.type === TOPICS.DIVISION) {
        if (wrongAnswer > problem.answer) return '¡Te pasaste de largo! Probá con un número más chico.';
        return '¡Te quedaste corto! Dale un poquito más.';
    }

    if (problem.type === TOPICS.PROPERTIES) {
        return 'Fijate bien qué pasó: ¿se movieron de lugar o aparecieron paréntesis?';
    }

    if (problem.type === TOPICS.TRIANGLES) {
        if (problem.answer === 'Equilátero') return '¡Mirá bien los números! ¿Son todos iguales?';
        if (problem.answer === 'Isósceles') return 'Buscá dos lados que midan lo mismo.';
        if (problem.answer === 'Escaleno') return 'Fijate que no hay ningún lado repetido.';
    }

    if (problem.type === TOPICS.FRACTIONS) {
        return problem.hint;
    }

    return retryPhrases[getRandomInt(0, retryPhrases.length - 1)];
};
