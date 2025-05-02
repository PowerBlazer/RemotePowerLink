import { DependencyList, useEffect } from 'react';

export const useEffectAsync = (
    callback: () => Promise<void> | Promise<() => void> | void,
    deps?: DependencyList
) => {
    useEffect(() => {
        let cleanupFn: (() => void) | undefined;

        async function requestAsync () {
            const result = await callback();
            if (typeof result === 'function') {
                cleanupFn = result;
            }
        }

        requestAsync();

        return () => {
            if (cleanupFn) cleanupFn();
        };
    }, deps);
};
