import { classNames } from 'shared/lib/classNames/classNames';
import ErrorIcon from 'shared/assets/icons/error.svg';
import style from './ErrorLabel.module.scss';

interface ErrorItem{
    errors:string[]
}

interface ErrorLabelProps {
    className?: string;
    errors:string[]
}

export function ErrorLabel ({ className,errors }: ErrorLabelProps) {
    return (
        <div className={classNames(style.errorLabel, {}, [className])}>
            {
                errors.map((errorMessage)=> {
                    return (
                        <div className={classNames(style.label_item)}>
                            <ErrorIcon width={20} height={20}/>
                            <h4 className={style.error_message}>{errorMessage}</h4>
                        </div>
                    )
                })
            }
            
		</div>
    );
}