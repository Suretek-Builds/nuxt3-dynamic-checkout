export function mergeParams(currentQuery: Record<string, any>): Record<string, any> {
    const storedParams = JSON.parse(storage.getSessionItem('urlParams') || '{}');
    return { ...storedParams, ...currentQuery };
}
