export const AreaOrTruckNotFoundError = (message: string) => {
    const error = new Error(message);
    error.name = "AreaNotFoundError";
    return error;
}

export const NoMatchingTruckError = (message: string) => {
    const error = new Error(message);
    error.name = "NoMatchingTruckError";
    return error;
}

export const AssignmentNotFoundError = (message: string) => {
    const error = new Error(message);
    error.name = "AssignmentNotFoundError";
    return error;
}