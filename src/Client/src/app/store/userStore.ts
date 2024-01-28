import { makeAutoObservable } from 'mobx';

export interface UserData {
    id: number
    username: string
}

class UserStore {
    userData: UserData = {
        id: 0,
        username: ''
    }

    constructor () {
        makeAutoObservable(this);
    }

    setUserData (userData: UserData) {
        this.userData = userData;
    }
}

export default new UserStore();
