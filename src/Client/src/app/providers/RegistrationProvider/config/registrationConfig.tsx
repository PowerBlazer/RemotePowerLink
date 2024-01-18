import { JSX } from 'react';
import { SendEmailVerificationStep } from 'pages/SignupPage/ui/steps/SendEmailVerificationStep';
import { ConfirmEmailStep } from 'pages/SignupPage/ui/steps/ConfirmEmailStep';
import { RegistrationStep } from 'pages/SignupPage/ui/steps/RegistrationStep';

export enum RegistrationSteps {
    SendEmailVerification = 'SendEmailVerification',
    ConfirmEmail = 'ConfirmEmail',
    Registration = 'Registration'
}

export const StepsElements: Record<RegistrationSteps, JSX.Element> = {
    [RegistrationSteps.SendEmailVerification]: <SendEmailVerificationStep/>,
    [RegistrationSteps.ConfirmEmail]: <ConfirmEmailStep/>,
    [RegistrationSteps.Registration]: <RegistrationStep/>
}
