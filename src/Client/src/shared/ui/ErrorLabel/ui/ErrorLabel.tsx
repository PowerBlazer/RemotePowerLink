import { classNames } from 'shared/lib/classNames/classNames';
import ErrorIcon from 'shared/assets/icons/error.svg';
import style from './ErrorLabel.module.scss';
import { useTranslation } from 'react-i18next';

interface ErrorLabelProps {
    className?: string;
    errors: string[],
    keyName?: string
}

export function ErrorLabel ({ className, errors, keyName }: ErrorLabelProps) {
    return (
        <div className={classNames(style.errorLabel, {}, [className])}>
            {
                errors.map((errorMessage, key) => {
                    return (
                        <div className={classNames(style.label_item)} key={key}>
                            <ErrorIcon width={20} height={20}/>
                            <h4 className={style.error_message}>{Boolean(keyName) && `${keyName} :`} {errorMessage}</h4>
                        </div>
                    )
                })
            }

        </div>
    );
}
