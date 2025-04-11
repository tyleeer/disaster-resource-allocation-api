export const calculateRemainingResources = (
    targetResources: { [key: string]: number },
    referenceResources: { [key: string]: number }
): { [key: string]: number } => {
    return Object.keys(targetResources).reduce((acc, key) => {
        if (referenceResources[key]) {
            const diff = targetResources[key] - referenceResources[key];
            diff >= 0 ? acc[key] = diff : acc[key] = 0;
        } else {
            acc[key] = targetResources[key];
        }
        return acc;
    }, {} as { [key: string]: number });;
}