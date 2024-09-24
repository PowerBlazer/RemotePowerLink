import { lazy } from 'react';

export const TerminalPageAsync = lazy(async () => await import('./TerminalPage')
    .then(module => ({ default: module.default })))
