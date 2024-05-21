import { Result } from "./Result.interface";

export interface Answer {
    _id: string,
    user: string,
    date: number,
    questions: {questions: string[]},
    aiAnswer: Result,
    userAnswer: string[]
}