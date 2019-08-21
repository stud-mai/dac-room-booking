export const getStartAndEndTimeFromPeriod = (period, date) => {
    const [availStarts, availEnds] = period.split(' - ').map(time => time.split(':').map(Number));
    const startTime = date.hour(availStarts[0]).minute(availStarts[1]);
    const endTime = date.hour(availEnds[0]).minute(availEnds[1]);
    return { startTime, endTime };
};

export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));