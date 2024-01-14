import { RegistrationSteps } from 'app/providers/RegistrationProvider';
import { createContext } from 'react';

export interface RegistrationContextProps {
    step?: RegistrationSteps,
    setStepRegistration?: (registrationStep: RegistrationSteps) => void
}

export const RegistrationContext = createContext<RegistrationContextProps>({});
