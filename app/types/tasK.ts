export interface Task {
    id: number;
    text: string;
    underTask: underTask[];
    completed: boolean;
}

export interface underTask {
    id: number;
    text: string;
    completed: boolean;
}