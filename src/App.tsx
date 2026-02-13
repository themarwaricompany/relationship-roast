import { useState, useCallback } from 'react';
import Background from './components/shared/Background';
import Header from './components/shared/Header';
import Hero from './components/landing/Hero';
import NameInput from './components/landing/NameInput';
import QuizView from './components/quiz/QuizView';
import ResultScreen from './components/result/ResultScreen';
import { QUIZ_QUESTIONS, type QuizOption } from './data/questions';
import { calculateResult, type QuizResult } from './lib/scoring';

type AppView = 'landing' | 'names' | 'quiz' | 'result';

export default function App() {
    const [view, setView] = useState<AppView>('landing');
    const [userName, setUserName] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [result, setResult] = useState<QuizResult | null>(null);

    const handleStart = useCallback(() => {
        setView('names');
    }, []);

    const handleNames = useCallback((user: string, partner: string) => {
        setUserName(user);
        setPartnerName(partner);
        setView('quiz');
    }, []);

    const handleQuizComplete = useCallback((answers: QuizOption[]) => {
        const quizResult = calculateResult(answers, userName, partnerName);
        setResult(quizResult);
        setView('result');
    }, [userName, partnerName]);

    const handleRestart = useCallback(() => {
        setUserName('');
        setPartnerName('');
        setResult(null);
        setView('landing');
    }, []);

    return (
        <Background>
            <div className="min-h-screen flex flex-col">
                <Header />
                {view === 'landing' && (
                    <Hero onStart={handleStart} />
                )}
                {view === 'names' && (
                    <NameInput
                        onSubmit={handleNames}
                        onBack={() => setView('landing')}
                    />
                )}
                {view === 'quiz' && (
                    <QuizView
                        questions={QUIZ_QUESTIONS}
                        onComplete={handleQuizComplete}
                        onBack={() => setView('names')}
                    />
                )}
                {view === 'result' && result && (
                    <ResultScreen
                        result={result}
                        userName={userName}
                        partnerName={partnerName}
                        onRestart={handleRestart}
                    />
                )}
            </div>
        </Background>
    );
}
