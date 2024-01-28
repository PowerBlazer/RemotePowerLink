import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarHosts.module.scss';
import {useTranslation} from "react-i18next";
import {Button} from "shared/ui/Button/Button";
import ServerIcon from 'shared/assets/icons/navbar/server.svg';

interface NavbarHostsProps {
    className?: string;
}

export function NavbarHosts ({ className }: NavbarHostsProps) {
    const { t } = useTranslation('translation');
    
    return (
        <div className={classNames(style.navbarHosts, {}, [className])}>
            <div className={classNames(style.search_block)}>
                <input type={"text"} className={classNames(style.search)} placeholder={t("Поиск серверов или ssh root@hostname...")}/>
                <Button className={classNames(style.connect_button,{},[])}>{t('Подключиться')}</Button>
            </div>
            
            <div className={classNames(style.control_panel)}>
                <div className={classNames(style.tools_panel)}>
                    <Button className={classNames(style.newhost_button)}>
                        <ServerIcon width={'14px'} height={'14px'}/>
                        {t('Новый сервер')}
                    </Button>
                </div>
                <div className={classNames(style.filter_tool_panel)}>
                    
                </div>
            </div>
        </div>
    );
}
