import { classNames } from 'shared/lib/classNames/classNames';
import style from './ErrorList.module.scss';
import {ErrorLabel} from "shared/ui/ErrorLabel";

interface ErrorListProps {
    className?: string;
    errors: Record<string, string[]>,
    keyIgnoreList?: string[]
}

export function ErrorList ({ className, errors, keyIgnoreList = [] }: ErrorListProps) {
    return (
        <div className={classNames(style.errorList, {}, [className])}>
            {errors && Object.keys(errors)
                .filter(p=> keyIgnoreList.indexOf(p) === -1)
                .map(key=> {
                    const errorList = errors[key];

                    return (
                        <ErrorLabel errors={errorList} key={key} keyName={key}/>
                    )
                })}
		</div>
    );
}