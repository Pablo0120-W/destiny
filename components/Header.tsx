
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
    const { t } = useLanguage();
    return (
        <header className="text-center mb-8 w-full pt-10 sm:pt-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-300/90 tracking-wider font-cinzel animate-fade-in-down">
                {t('header.title')}
            </h1>
            <p className="text-lg text-purple-300/80 mt-2 animate-fade-in-down animation-delay-300">
                {t('header.subtitle')}
            </p>
        </header>
    );
};

// Add a simple animation delay helper in a style tag for broader compatibility
const style = document.createElement('style');
style.innerHTML = `
.animation-delay-300 {
    animation-delay: 300ms;
}
@keyframes fade-in-down {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fade-in-down {
    animation: fade-in-down 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);


export default Header;
