import { ReactNode, useMemo, useState } from 'react';
import { RegistrationContext, RegistrationSteps } from 'app/providers/RegistrationProvider';
import { RegistrationStepModel } from 'app/providers/RegistrationProvider/context/RegistrationContext';

interface RegistrationProviderProps {
    children?: ReactNode;
}

export default function RegistrationProvider ({ children }: RegistrationProviderProps) {
    const defaultStepRegistration: RegistrationStepModel = {
        step: RegistrationSteps.ConfirmEmail
    };

    const [stepModel, setStepRegistration] = useState<RegistrationStepModel>(defaultStepRegistration);
    const defaultProps = useMemo(() => ({
        stepModel,
        setStepRegistration
    }), [stepModel]);

    return (
        <RegistrationContext.Provider value={defaultProps}>
            {children}
        </RegistrationContext.Provider>
    );
}
