import { useState, useEffect, useCallback } from 'react';
import { generateProblem, getAlexTip, getAlexHint, TOPICS } from '../utils/mathEngine';

export const useMathGame = () => {
    const [topic, setTopic] = useState(TOPICS.MULTIPLICATION);
    const [problem, setProblem] = useState(null);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState({ type: 'info', message: '¡Hola! Soy Alex. ¡Vamos a practicar!' });
    const [showConfetti, setShowConfetti] = useState(false);
    const [alexEmotion, setAlexEmotion] = useState('neutral');
    const [streak, setStreak] = useState(0);

    // New Config State
    const [config, setConfig] = useState({
        multiplication: { digits1: 4, digits2: 2 },
        division: { digits1: 3, digits2: 1 }
    });

    const generateNewProblem = useCallback((currentTopic, currentConfig) => {
        const p = generateProblem(currentTopic, currentConfig || config);
        setProblem(p);
        setInput('');
        setFeedback({ type: 'info', message: '¡A resolver!' });
        setShowConfetti(false);
        setAlexEmotion('neutral');
    }, [config]);

    useEffect(() => {
        generateNewProblem(topic, config);
    }, [topic, config, generateNewProblem]);

    const updateConfig = (newConfig) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const handleCheck = () => {
        if (!problem) return;

        let isCorrect = false;
        if (problem.isMultipleChoice) {
            isCorrect = input === problem.answer;
        } else {
            isCorrect = parseInt(input, 10) === problem.answer;
        }

        if (isCorrect) {
            const successPhrases = ["¡Vaaaaamoooo! ¡Sos un crack!", "¡Re bien! ¡La tenés clara!", "¡De diez, sabelo!", "¡Impresionante, che!"];
            const phrase = successPhrases[Math.floor(Math.random() * successPhrases.length)];

            setStreak(prev => prev + 1);
            setFeedback({ type: 'success', message: `${phrase} (Racha: ${streak + 1})` });
            setShowConfetti(true);
            setAlexEmotion('happy');
            setTimeout(() => {
                generateNewProblem(topic, config);
            }, 2000);
        } else {
            setStreak(0);
            const hint = getAlexHint(problem, parseInt(input, 10));
            setFeedback({ type: 'error', message: hint });
            setAlexEmotion('sad');
            setShowConfetti(false);
        }
    };

    const askTip = () => {
        const tip = getAlexTip(topic);
        setFeedback({ type: 'tip', message: tip });
        setAlexEmotion('thinking');
    };

    return {
        topic,
        setTopic,
        problem,
        input,
        setInput,
        feedback,
        showConfetti,
        alexEmotion,
        handleCheck,
        newProblem: () => generateNewProblem(topic, config),
        askTip,
        config,
        updateConfig,
        streak
    };
};
