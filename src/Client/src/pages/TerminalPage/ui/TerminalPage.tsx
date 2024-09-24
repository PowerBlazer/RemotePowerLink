import {observer} from "mobx-react-lite";
import style from './Terminal.module.scss';
import {classNames} from "shared/lib/classNames/classNames";
import {useTranslation} from "react-i18next";


function TerminalPage() {
    const { t } = useTranslation('translation');
    
    return (
        <div className={classNames(style.terminalPage)}>
            
        </div>
    )
}

export default observer(TerminalPage);