
export enum GameState {
    INPUT = 'INPUT',
    GENERATING_REPORT = 'GENERATING_REPORT',
    REPORT_READY = 'REPORT_READY',
    IN_GAME = 'IN_GAME',
    GENERATING_ENDING = 'GENERATING_ENDING',
    GAME_OVER = 'GAME_OVER',
}

export enum LifeStage {
    CHILDHOOD = "Childhood",
    ADOLESCENCE = "Adolescence",
    YOUNG_ADULTHOOD = "Young Adulthood",
    CAREER = "Career & Ambition",
    MIDLIFE = "Midlife Reflection",
    OLD_AGE = "Old Age & Legacy",
}

export type Language = 'en' | 'zh';

export interface UserData {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
}

export interface Scene {
    scenario: string;
    choices: string[];
}
