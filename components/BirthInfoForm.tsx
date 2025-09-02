import React, { useState } from 'react';
import { UserData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BirthInfoFormProps {
    onSubmit: (data: UserData) => void;
}

const BirthInfoForm: React.FC<BirthInfoFormProps> = ({ onSubmit }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<UserData>({
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };
    
    const inputStyle = "w-full bg-purple-900/30 border border-purple-500/50 rounded-lg p-3 text-gray-200 placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/80 transition-shadow duration-300";

    return (
        <div className="w-full max-w-lg p-8 bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-500/10 border border-purple-500/20 animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-2 font-cinzel text-yellow-300">{t('birthForm.title')}</h2>
            <p className="text-center text-purple-300/80 mb-8">{t('birthForm.subtitle')}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-2">{t('birthForm.nameLabel')}</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputStyle} placeholder={t('birthForm.namePlaceholder')} />
                </div>
                <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-purple-300 mb-2">{t('birthForm.dateLabel')}</label>
                    <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} required className={inputStyle} />
                </div>
                <div>
                    <label htmlFor="birthTime" className="block text-sm font-medium text-purple-300 mb-2">{t('birthForm.timeLabel')}</label>
                    {/* Fix: Corrected property access from formData.time to formData.birthTime to match the UserData type. */}
                    <input type="time" id="birthTime" name="birthTime" value={formData.birthTime} onChange={handleChange} required className={inputStyle} />
                </div>
                <div>
                    <label htmlFor="birthPlace" className="block text-sm font-medium text-purple-300 mb-2">{t('birthForm.placeLabel')}</label>
                    <input type="text" id="birthPlace" name="birthPlace" value={formData.birthPlace} onChange={handleChange} required className={inputStyle} placeholder={t('birthForm.placePlaceholder')} />
                </div>
                <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg font-cinzel tracking-wider transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-yellow-500/20">
                    {t('birthForm.submitButton')}
                </button>
            </form>
        </div>
    );
};

// Add a simple animation keyframe for broader compatibility
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
}
`;
document.head.appendChild(style);

export default BirthInfoForm;