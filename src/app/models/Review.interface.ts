interface reviewUserData {
    _id: string,
    username: string,
    avatar: string
}
export interface Review {
    _id: string,
    user: reviewUserData,
    rating: number,
    comment: string,
    createdAt: Date | string
}

export interface countReviews {
    count: number
}

export interface generatedReview {
    review: string
}