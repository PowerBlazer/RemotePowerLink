import { lazy } from 'react';

export const SettingsPageAsync = lazy(async () => import('./SettingsPage')
    .then(module => ({default: module.default})))