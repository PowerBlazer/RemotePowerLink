import { observer } from 'mobx-react-lite';
import style from './Terminal.module.scss';
import { classNames } from 'shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import {NavbarTerminal} from "widgets/TerminalModules/NavbarTerminal";
import terminalStore from "app/store/terminalStore";
import {SelectHostBlock} from "features/SelectHostBlock";
import {useState} from "react";
import {TerminalSelectHostCatalog} from "widgets/TerminalModules/TerminalSelectHostCatalog";

function TerminalPage () {
    const { t } = useTranslation('translation');
    
    const isSessionsNull = terminalStore.sessions.length === 0;
    const [isSelectHost, setIsSelectHost] = useState<boolean>(false );
    
    if(isSessionsNull && !isSelectHost){
        return (
            <div className={classNames(style.terminalPage,{}, [style.information])}>
                <SelectHostBlock onClick={() => setIsSelectHost(true)}/>
            </div>
        )
    }
    
    if(isSelectHost){
        return (
            <div className={classNames(style.terminalPage,{}, [style.information])}>
                <TerminalSelectHostCatalog onClose={() => setIsSelectHost(false)} />
            </div>
        )
    }
    
    return (
        <div className={classNames(style.terminalPage)}>
            <div className={classNames(style.header)}>
                <NavbarTerminal onClickSelectHost={() => setIsSelectHost(true)}/>
            </div>
            <div className={classNames(style.main)}>
                {terminalStore.selectedSession?.host.title}
            </div>
            <div className={classNames(style.footer)}>
                
            </div>
        </div>
    )
}

export default observer(TerminalPage);
