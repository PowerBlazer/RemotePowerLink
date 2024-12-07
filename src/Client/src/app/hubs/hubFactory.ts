import * as signalR from '@microsoft/signalr';
import { AuthorizationService } from 'app/services/AuthorizationService/authorizationService';

export function createHubInstance (url: string) {
    return new signalR.HubConnectionBuilder()
        .withUrl(url, {
            accessTokenFactory: () => AuthorizationService.getAccessToken()
        })
        .withAutomaticReconnect()
        .build();
}

export enum ConnectionState {
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Reconnecting = 'Reconnecting'
}
