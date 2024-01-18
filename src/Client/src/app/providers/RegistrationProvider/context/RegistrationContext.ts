import { RegistrationSteps } from 'app/providers/RegistrationProvider';
import { createContext } from 'react';

export interface RegistrationStepModel {
    step?: RegistrationSteps,
    email?: string
}

export interface RegistrationContextProps {
    stepModel?: RegistrationStepModel,
    setStepRegistration?: (stepModel: RegistrationStepModel) => void
}

export const RegistrationContext = createContext<RegistrationContextProps>({});
