
import React from 'react';
import { Scene, LifeStage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface GameStageProps {
    scene: Scene;
    stage: LifeStage;
    onChoice: (choice: string) => void;
}

const lifeStageToTranslationKey = {
    [LifeStage.CHILDHOOD]: 'gameStage.childhood',
    [LifeStage.ADOLESCENCE]: 'gameStage.adolescence',
    [LifeStage.YOUNG_ADULTHOOD]: 'gameStage.youngAdulthood',
    [LifeStage.CAREER]: 'gameStage.career',
    [LifeStage.MIDLIFE]: 'gameStage.midlife',
    [LifeStage.OLD_AGE]: 'gameStage.oldAge',
};

const GameStageComponent: React.FC<GameStageProps> = ({ scene, stage, onChoice }) => {
    const { t } = useLanguage();
    const stageName = t(lifeStageToTranslationKey[stage]);

    return (
        <div className="w-full max-w-2xl p-8 bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-500/10 border border-purple-500/20 animate-fade-in">
            <h3 className="text-2xl font-bold text-center mb-4 font-cinzel text-yellow-300 tracking-widest">{stageName}</h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 text-center">{scene.scenario}</p>
            <div className="space-y-4 flex flex-col items-center">
                {scene.choices.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => onChoice(choice)}
                        className="w-full max-w-md text-left bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/50 rounded-lg p-4 text-purple-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/80 transition-all duration-300 transform hover:scale-105 hover:border-yellow-400/80"
                    >
                        {choice}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameStageComponent;
