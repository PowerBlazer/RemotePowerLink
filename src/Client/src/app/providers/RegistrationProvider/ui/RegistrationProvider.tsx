import { ReactNode, useMemo, useState } from 'react';
import { RegistrationContext,RegistrationSteps } from 'app/providers/RegistrationProvider';

interface RegistrationProviderProps {
    children?: ReactNode;
}

export default function RegistrationProvider ({ children }: RegistrationProviderProps) {
    const defaultStepRegistration = RegistrationSteps.ConfirmEmail;
    
    const [step, setStepRegistration] = useState<RegistrationSteps>(defaultStepRegistration);
    const defaultProps = useMemo(() => ({
        step,
        setStepRegistration
    }), [step]);

    return (
        <RegistrationContext.Provider value={defaultProps}>
            {children}
        </RegistrationContext.Provider>
    );
}
