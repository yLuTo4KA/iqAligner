export interface Questions {
    chatId: string,
    questions: Question[]
}

export interface Question {
    answers: string[],
    questions: string
}