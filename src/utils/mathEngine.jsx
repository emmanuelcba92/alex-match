export const TOPICS = {
    MULTIPLICATION: 'multiplication',
    DIVISION: 'division',
    PROPERTIES: 'properties',
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
        default:
            return null;
    }
};

export const getAlexTip = (topic) => {
    switch (topic) {
        case TOPICS.MULTIPLICATION:
            return (
                <div className="text-left text-sm space-y-2">
                    <p><strong>Pasos sencillos:</strong></p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Multiplicá el número de abajo (unidad) por el de arriba.</li>
                        <li>Hacé lo mismo con la decena (el segundo número), ¡pero dejá un espacio o poné un cero a la derecha!</li>
                        <li>Sumá los dos resultados.</li>
                    </ol>
                </div>
            );
        case TOPICS.DIVISION:
            return (
                <div className="text-left text-sm space-y-2">
                    <p><strong>¿Cómo dividir?</strong></p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Tomá los primeros números del dividendo (izquierda) que sean mayores al divisor.</li>
                        <li>Buscá un número que multiplicado por el divisor se acerque sin pasarse.</li>
                        <li>Restá y bajá el siguiente número. ¡Repetí hasta terminar!</li>
                    </ol>
                </div>
            );
        case TOPICS.PROPERTIES:
            return (
                <div className="text-left text-sm space-y-2">
                    <p><strong>Conmutativa:</strong> "El orden de los factores no altera el producto". <br /><span className="text-xs text-slate-500">Ej: 5x3 es igual a 3x5.</span></p>
                    <p><strong>Asociativa:</strong> "No importa cómo agrupes las multiplicaciones". <br /><span className="text-xs text-slate-500">Ej: (2x3)x4 es igual a 2x(3x4).</span></p>
                    <p><strong>Distributiva:</strong> "El número de afuera se reparte con los de adentro". <br /><span className="text-xs text-slate-500">Ej: 2x(3+4) es igual a hacer 2x3 y sumarle 2x4.</span></p>
                </div>
            );
        default:
            return '¡La práctica hace al maestro!';
    }
};

export const getAlexHint = (problem, wrongAnswer) => {
    if (!problem) return 'Intentalo de nuevo.';

    if (problem.type === TOPICS.MULTIPLICATION) {
        const { num1, num2 } = problem.details;
        const unit = num2 % 10;
        const tens = Math.floor(num2 / 10);
        // Check if they forgot the zero in the tens line? Hard to guess from just the final answer.
        // We can check the last digit.
        if (String(wrongAnswer).slice(-1) !== String(problem.answer).slice(-1)) {
            return `Revisá la multiplicación por la unidad (${problem.details.num1} x ${unit}).`;
        }
        return `¡Casi! Revisá la suma final o la multiplicación por las decenas (${problem.details.num1} x ${tens}).`;
    }

    if (problem.type === TOPICS.DIVISION) {
        if (wrongAnswer > problem.answer) return '¡Te pasaste! Probá con un número más chico.';
        return '¡Te quedaste corto! Probá con un número más grande.';
    }

    if (problem.type === TOPICS.PROPERTIES) {
        if (problem.answer === 'Conmutativa') return 'Observá que solo cambiaron el orden.';
        if (problem.answer === 'Asociativa') return 'Fijate en los paréntesis, agrupan distinto.';
        if (problem.answer === 'Distributiva') return 'Mirá cómo el número de afuera multiplica a los de adentro.';
    }

    return '¡Estuviste cerca! Volvé a calcular con cuidado.';
};
