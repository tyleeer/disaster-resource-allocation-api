export const AreaNotFoundError = (message: string) => {
    const error = new Error(message);
    error.name = "AreaNotFoundError";
    return error;
}

export const AreaAlreadyExistsError = (message: string) => {
    const error = new Error(message);
    error.name = "AreaAlreadyExistsError";
    return error;
}