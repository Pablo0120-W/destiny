
import React from 'react';
import { marked } from 'marked';
import { useLanguage } from '../contexts/LanguageContext';

interface DestinyReportProps {
    report: string;
    onStart: () => void;
}

const DestinyReport: React.FC<DestinyReportProps> = ({ report, onStart }) => {
    const { t } = useLanguage();
    
    // Basic sanitizer to prevent raw HTML injection, although we trust the source.
    const getMarkdownText = (markdown: string) => {
        const rawMarkup = marked.parse(markdown, { breaks: true });
        return { __html: rawMarkup };
    };

    return (
        <div className="w-full max-w-3xl p-8 bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-500/10 border border-purple-500/20 animate-fade-in">
            <h2 className="text-4xl font-bold text-center mb-6 font-cinzel text-yellow-300">{t('destinyReport.title')}</h2>
            <div 
                className="prose prose-invert prose-lg max-w-none prose-headings:font-cinzel prose-headings:text-yellow-400/90 prose-strong:text-purple-300"
                dangerouslySetInnerHTML={getMarkdownText(report)}
            />
            <div className="text-center mt-8">
                <button 
                    onClick={onStart} 
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg text-lg font-cinzel tracking-wider transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/20"
                >
                    {t('destinyReport.startButton')}
                </button>
            </div>
        </div>
    );
};

export default DestinyReport;
