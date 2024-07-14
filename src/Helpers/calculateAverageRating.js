export function calculateAverageRating(ratings){
    if (!ratings || ratings.length === 0) {
        return 0;
    }
    
    const total = ratings.reduce((accumulator, current) => accumulator + current.rate, 0);
    return total / ratings.length;
};
