
import React, { useState, useCallback } from 'react';
import { GameState, UserData, Scene, LifeStage } from './types';
import { generateDestinyReport, generateGameScene, generateEnding } from './services/geminiService';
import BirthInfoForm from './components/BirthInfoForm';
import DestinyReport from './components/DestinyReport';
import GameStageComponent from './components/GameStage';
import EndingScreen from './components/EndingScreen';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const [gameState, setGameState] = useState<GameState>(GameState.INPUT);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [destinyReport, setDestinyReport] = useState<string>('');
    const [currentLifeStage, setCurrentLifeStage] = useState<LifeStage>(LifeStage.CHILDHOOD);
    const [currentScene, setCurrentScene] = useState<Scene | null>(null);
    const [storyLog, setStoryLog] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const lifeStagesOrder: LifeStage[] = [
        LifeStage.CHILDHOOD,
        LifeStage.ADOLESCENCE,
        LifeStage.YOUNG_ADULTHOOD,
        LifeStage.CAREER,
        LifeStage.MIDLIFE,
        LifeStage.OLD_AGE
    ];

    const handleFormSubmit = async (data: UserData) => {
        setIsLoading(true);
        setError('');
        setUserData(data);
        setGameState(GameState.GENERATING_REPORT);
        try {
            const report = await generateDestinyReport(data, language);
            setDestinyReport(report);
            setGameState(GameState.REPORT_READY);
        } catch (err) {
            setError(t('error.generateReport'));
            setGameState(GameState.INPUT);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartJourney = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setGameState(GameState.IN_GAME);
        try {
            const scene = await generateGameScene(currentLifeStage, destinyReport, storyLog, language);
            setCurrentScene(scene);
        } catch (err) {
            setError(t('error.nextStep'));
            setGameState(GameState.REPORT_READY);
        } finally {
            setIsLoading(false);
        }
    }, [currentLifeStage, destinyReport, storyLog, language, t]);

    const handleChoice = async (choice: string) => {
        setIsLoading(true);
        setError('');
        const newStoryLog = [...storyLog, `During ${currentLifeStage}, I chose to: ${choice}`];
        setStoryLog(newStoryLog);
        
        const currentStageIndex = lifeStagesOrder.indexOf(currentLifeStage);
        const nextStageIndex = currentStageIndex + 1;

        try {
            if (nextStageIndex < lifeStagesOrder.length) {
                const nextStage = lifeStagesOrder[nextStageIndex];
                setCurrentLifeStage(nextStage);
                const scene = await generateGameScene(nextStage, destinyReport, newStoryLog, language);
                setCurrentScene(scene);
            } else {
                setGameState(GameState.GENERATING_ENDING);
                const finalChapter = await generateEnding(newStoryLog, language);
                setStoryLog([finalChapter]);
                setDestinyReport(t('endingTitle'));
                setGameState(GameState.GAME_OVER);
            }
        } catch (err) {
            setError(t('error.proceed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayAgain = () => {
        setGameState(GameState.INPUT);
        setUserData(null);
        setDestinyReport('');
        setCurrentLifeStage(LifeStage.CHILDHOOD);
        setCurrentScene(null);
        setStoryLog([]);
        setError('');
    };

    const LanguageSwitcher = () => (
        <div className="absolute top-4 right-4 z-10">
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm rounded-l-md transition-colors ${language === 'en' ? 'bg-yellow-400 text-gray-900 font-bold' : 'bg-purple-800/50 text-purple-200 hover:bg-purple-800/70'}`}
                aria-pressed={language === 'en'}
            >
                {t('language.english')}
            </button>
            <button
                onClick={() => setLanguage('zh')}
                className={`px-3 py-1 text-sm rounded-r-md transition-colors ${language === 'zh' ? 'bg-yellow-400 text-gray-900 font-bold' : 'bg-purple-800/50 text-purple-200 hover:bg-purple-800/70'}`}
                aria-pressed={language === 'zh'}
            >
                {t('language.chinese')}
            </button>
        </div>
    );

    const renderContent = () => {
        if (isLoading) {
            let message = t('loading.consulting');
            if (gameState === GameState.GENERATING_REPORT) message = t('loading.generatingReport');
            if (gameState === GameState.IN_GAME) message = t('loading.weavingNextChapter');
            if (gameState === GameState.GENERATING_ENDING) message = t('loading.reflecting');
            return <LoadingSpinner message={message} />;
        }

        if (error) {
            return (
                <div className="text-center text-red-400 p-4 bg-red-900/30 rounded-lg" role="alert">
                    <p className="font-bold text-lg font-cinzel">{t('error.title')}</p>
                    <p>{error}</p>
                </div>
            );
        }

        switch (gameState) {
            case GameState.INPUT:
                return <BirthInfoForm onSubmit={handleFormSubmit} />;
            case GameState.REPORT_READY:
                return <DestinyReport report={destinyReport} onStart={handleStartJourney} />;
            case GameState.IN_GAME:
                return currentScene ? (
                    <GameStageComponent
                        scene={currentScene}
                        onChoice={handleChoice}
                        stage={currentLifeStage}
                    />
                ) : <LoadingSpinner message={t('loading.preparingStage')} />;
            case GameState.GAME_OVER:
                 return <EndingScreen title={destinyReport} ending={storyLog[0] || ''} onPlayAgain={handlePlayAgain} />;
            default:
                return <LoadingSpinner message={t('loading.wakingSpirits')}/>;
        }
    };

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen bg-fixed relative" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)'}}>
            <LanguageSwitcher />
            <div className="min-h-screen bg-gradient-to-br from-black/50 via-purple-900/30 to-blue-900/30 flex flex-col items-center p-4 sm:p-6 md:p-8">
                <Header />
                <main className="w-full max-w-4xl mx-auto flex-grow flex items-center justify-center">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;
