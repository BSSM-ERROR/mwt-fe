export interface SelectOption {
    id: string;
    tag: string;
    title: string;
    description: string;
}

export type Step = 'level' | 'method' | 'scenario' | 'chat';
