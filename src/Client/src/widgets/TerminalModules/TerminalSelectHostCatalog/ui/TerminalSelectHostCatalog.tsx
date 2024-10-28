import { classNames } from 'shared/lib/classNames/classNames';
import style from './TerminalSelectHostCatalog.module.scss';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import searchStore from 'app/store/searchStore';
import { Button } from 'shared/ui/Button/Button';
import ArrowRight from 'shared/assets/icons/arrow-right.svg';
import { SearchInput } from 'features/SearchInput';
import { ServerManagerCatalog, ServerManagerCatalogMode } from 'widgets/ServerManagerCatalog';
import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { useTranslation } from 'react-i18next';
import terminalStore, { TerminalSession } from 'app/store/terminalStore';
import { SessionService } from 'app/services/SessionService/sessionService';

interface TerminalSelectHostCatalogProps {
    className?: string;
    onClose: () => void;
}

function TerminalSelectHostCatalog ({ className, onClose }: TerminalSelectHostCatalogProps) {
    const { t } = useTranslation('translation')

    const onChangeSearchInputHandler = (value: string) => {
        searchStore.setFilterOption({
            title: value
        })
    }

    const onClickCloseSelectHostCatalog = () => {
        if (onClose) {
            onClose();
        }
    }

    const onClickConnectHandler = async (serverData: ServerData) => {
        // eslint-disable-next-line no-undef
        const uniqueId = generateUniqueNumber();
        const newSession: TerminalSession = {
            id: uniqueId,
            host: serverData,
            isLoad: true,
            isNew: true,
            isCreate: true
        };

        if (terminalStore.selectedSession) {
            await terminalStore.terminalHub.disactivateSession(terminalStore.selectedSession.id);
        }

        const countSessionForServer = terminalStore.sessions
            .filter(p => p.host.serverId === serverData.serverId)?.length ?? 0;

        newSession.name = countSessionForServer === 0
            ? serverData.title
            : `${serverData.title} (${countSessionForServer})`;

        terminalStore.sessions.push(newSession);
        terminalStore.selectedSession = newSession;

        if (onClose) {
            onClose()
        }

        const createdSessionResult = await SessionService.createSession({
            serverId: serverData.serverId
        });

        if (createdSessionResult.isSuccess) {
            const currentSession = terminalStore.sessions.find(p => p.id === uniqueId)

            currentSession.id = createdSessionResult.result.id;
            currentSession.isNew = false;

            terminalStore.selectedSession = currentSession;
        }
    }

    useEffect(() => {
        searchStore.setFilterOption(null)
    }, []);

    return (
        <div className={classNames(style.terminalSelectHostCatalog, {}, [className])}>
            <div className={classNames(style.select_navbar)}>
                <div className={classNames(style.header_navbar)}>
                    <Button className={classNames(style.close)} onClick={onClickCloseSelectHostCatalog}>
                        <ArrowRight width={17} height={17}></ArrowRight>
                    </Button>
                    <h3 className={classNames(style.header_text)}>{t('Выбрать сервер')}</h3>
                </div>
                <div className={classNames(style.search_catalog_panel)}>
                    <SearchInput onChange={onChangeSearchInputHandler}/>
                    <div className={style.tools}></div>
                </div>
            </div>
            <ServerManagerCatalog mode={ServerManagerCatalogMode.Terminal} onConnect={onClickConnectHandler}/>
        </div>
    );
}

export default observer(TerminalSelectHostCatalog)
