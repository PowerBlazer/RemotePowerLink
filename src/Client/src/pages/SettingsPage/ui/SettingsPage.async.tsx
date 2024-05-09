import { lazy } from 'react';

export const SettingsPageAsync = lazy(async () => await import('./SettingsPage')
    .then(module => ({ default: module.default })))
