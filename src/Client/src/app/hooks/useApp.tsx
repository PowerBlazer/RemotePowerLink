import userStore from 'app/store/userStore';
import { UserService } from 'app/services/UserService/userService';
import { IdentityService } from 'app/services/IdentityService/identityService';
import { ProxyService } from 'app/services/ProxyService/proxyService';
import { ServerService } from 'app/services/ServerService/serverService';
import { EncodingService } from 'app/services/EncodingService/encodingService';
import terminalStore from 'app/store/terminalStore';
import { TerminalService } from 'app/services/TerminalService/terminalService';
import { SessionService } from 'app/services/SessionService/sessionService';
import useTerminal from 'app/hooks/useTerminal';

const useApp = () => {
    const { initSessions } = useTerminal();

    async function loadData (onError: () => void) {
        userStore.isLoadData = true;

        if (!userStore.userData) {
            const userDataResult = await UserService.getUserData();

            if (!userDataResult.isSuccess) {
                exceptionLoad(onError);
                return;
            }

            userStore.setUserData(userDataResult.result);
        }

        if (!userStore.userIdentities) {
            const identitiesResult = await IdentityService.getIdentities();

            if (!identitiesResult.isSuccess) {
                exceptionLoad(onError);
                return;
            }

            userStore.setUserIdentities(identitiesResult.result);
        }

        if (!userStore.userProxies) {
            const proxiesResult = await ProxyService.getProxies();

            if (!proxiesResult.isSuccess) {
                exceptionLoad(onError);
                return;
            }

            userStore.setUserProxies(proxiesResult.result);
        }

        if (!userStore.userServers) {
            const serversResult = await ServerService.getServers();

            if (!serversResult.isSuccess) {
                exceptionLoad(onError);
                return;
            }

            userStore.setUserServers(serversResult.result);
        }

        if (!userStore.encodings) {
            const encodingsResult = await EncodingService.getEncodings();

            if (!encodingsResult.isSuccess) {
                exceptionLoad(onError);
                return;
            }

            userStore.setUserEncodings(encodingsResult.result);
        }

        if (terminalStore.terminalThemes.length === 0) {
            const terminalThemesResult = await TerminalService.getThemes();

            if (!terminalThemesResult.isSuccess) {
                exceptionLoad(onError);
                return;
            }

            terminalStore.terminalThemes = terminalThemesResult.result;
        }

        if (!terminalStore.terminalSetting) {
            const terminalSettingResult = await TerminalService.getSetting();

            if (!terminalSettingResult.isSuccess) {
                exceptionLoad(onError);
                return;
            }

            terminalStore.terminalSetting = terminalSettingResult.result;
        }

        if (!terminalStore.sessions || terminalStore.sessions.length === 0) {
            const sessionsResult = await SessionService.getOpenedSessions();

            if (sessionsResult.isSuccess) {
                await initSessions(sessionsResult.result);
            }

            if (!sessionsResult.isSuccess) {
                exceptionLoad(onError);
                return;
            }
        }

        userStore.isLoadData = false;
    }

    const exceptionLoad = (onError: () => void) => {
        userStore.isLoadData = false;

        if (onError) { onError(); }
    }

    return {
        loadData
    }
}

export default useApp;
