
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface EndingScreenProps {
    title: string;
    ending: string;
    onPlayAgain: () => void;
}

const EndingScreen: React.FC<EndingScreenProps> = ({ title, ending, onPlayAgain }) => {
    const { t } = useLanguage();
    return (
        <div className="w-full max-w-3xl p-8 bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-500/10 border border-purple-500/20 animate-fade-in">
            <h2 className="text-4xl font-bold text-center mb-6 font-cinzel text-yellow-300">{title}</h2>
            <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                {ending}
            </div>
            <div className="text-center mt-8">
                <button 
                    onClick={onPlayAgain} 
                    className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg font-cinzel tracking-wider transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-yellow-500/20"
                >
                    {t('endingScreen.playAgainButton')}
                </button>
            </div>
        </div>
    );
};

export default EndingScreen;
