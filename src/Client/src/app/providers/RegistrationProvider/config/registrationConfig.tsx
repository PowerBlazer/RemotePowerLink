import { JSX } from 'react';
import { SendEmailVerificationStep }  from 'pages/SignupPage/ui/steps/SendEmailVerificationStep';
import {ConfirmEmailStep} from "pages/SignupPage/ui/steps/ConfirmEmailStep";

export enum RegistrationSteps {
    SendEmailVerification = 'SendEmailVerification',
    ConfirmEmail = 'ConfirmEmail',
    Registration = 'Registration'
}

export const StepsElements: Record<RegistrationSteps, JSX.Element> = {
    [RegistrationSteps.SendEmailVerification]: <SendEmailVerificationStep/>,
    [RegistrationSteps.ConfirmEmail]: <ConfirmEmailStep/>,
    [RegistrationSteps.Registration]: <>sdasda</>
}
