import { makeAutoObservable } from 'mobx';
import { configure } from "mobx"


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

        configure({
            enforceActions: "never",
        })
    }

    setUserData (userData: UserData) {
        this.userData = userData;
    }
}

export default new UserStore();
