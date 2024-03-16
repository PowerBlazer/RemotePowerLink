import {makeAutoObservable, observable} from "mobx";
import {ServerData} from "../services/ServerService/config/serverConfig";
import {IdentityData} from "../services/IdentityService/config/identityConfig";
import {ProxyData} from "../services/ProxyService/config/proxyConfig";
import userStore from "app/store/userStore";

export interface SearchData {
    servers: ServerData[],
    identities: IdentityData[],
    proxies: ProxyData[]
}

export interface FilterOptions {
    title?: string
}

class SearchStore {
    @observable public searchData: SearchData = {
        servers:[],
        identities:[],
        proxies:[]
    };
    
    @observable public filterOptions: FilterOptions = {};
    
    constructor() {
        makeAutoObservable(this)
    }
    
    setSearchData(searchData: SearchData){
        let searchDataFiltered: SearchData = {
            servers:searchData.servers,
            identities:searchData.identities,
            proxies:searchData.proxies
        };
        
        if(this.filterOptions?.title){
            searchDataFiltered = {
                servers: searchData.servers.filter(p=> 
                    p.title.toLowerCase().includes(this.filterOptions.title.toLowerCase())
                ),
                proxies: searchData.proxies.filter(p=>
                    p.title.toLowerCase().includes(this.filterOptions.title.toLowerCase())
                ),
                identities: searchData.identities.filter(p=>
                    p.title.toLowerCase().includes(this.filterOptions.title.toLowerCase())
                )
            }
        }
        
        this.searchData = searchDataFiltered;
    }
    
    setFilterOption(filterOptions: FilterOptions | null){
        this.filterOptions = filterOptions;
        
        this.setSearchData({
            servers: userStore.userServers,
            proxies: userStore.userProxies,
            identities: userStore.userIdentities
        })
    }
}


export default new SearchStore();