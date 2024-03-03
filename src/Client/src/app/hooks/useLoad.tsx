import { useEffect, useState } from 'react';

export const useEffectLoad = (callback: () => Promise<void>) => {
    const [isLoad, setIsLoad] = useState<boolean>(true);

    useEffect(() => {
        async function requestAsync () {
            await callback();
            setIsLoad(false);
        }

        requestAsync();
    }, []);

    return {
        isLoad
    }
}
