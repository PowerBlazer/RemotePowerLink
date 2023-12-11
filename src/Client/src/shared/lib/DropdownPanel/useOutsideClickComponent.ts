import React, { useEffect, useCallback } from 'react';

export function useOutsideClickComponent<T extends HTMLElement> (ref: React.RefObject<T>, clickHandler: () => void) {
    const handlerClickCallback = useCallback((e: any) => {
        if (ref.current && !ref.current.contains(e.target)) {
            clickHandler();
        }
    }, [ref, clickHandler]);

    useEffect(() => {
        document.addEventListener('mousedown', handlerClickCallback);

        return () => {
            document.removeEventListener('mousedown', handlerClickCallback);
        };
    }, [handlerClickCallback]);
}
