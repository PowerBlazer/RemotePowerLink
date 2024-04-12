import { useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement>(
    callback: (e: MouseEvent) => void,
    exceptions: HTMLElement[] = []
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node) &&
                !exceptions.some(exception => exception?.contains(event.target as Node))
            ) {
                callback(event);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback, exceptions]);

    return ref;
};
