declare module "*.svg" {
    const content: any;
    export default content;
}

export type Family = {
    id: string;
    surname: string;
};

export type User = {
    id: string;
    family_id: string;
    name: string;
    role: string; 
};

export type Task = {
    id: string;
    family_id: string;
    name: string;
    description: string;
    status: 'incomplete' |  'pending' | 'completed';
};

export type SuggestedTask = {
    id: string;
    name: string;
    description: string;
    status: 'incomplete' |  'pending' | 'completed';
    estimated_cost: number; 
};