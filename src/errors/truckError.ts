export const TruckNotFoundError = (message: string) => {
    const error = new Error(message);
    error.name = "TruckNotFoundError";
    return error;
}

export const TruckAlreadyExistsError = (message: string) => {
    const error = new Error(message);
    error.name = "TruckAlreadyExistsError";
    return error;
}