import {Card} from "./Card";
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

export class List {
    public static model: string = `/lists`;

    public static getList(listId: string): List {
        const request = {
            apiPath: `${List.model}/${listId}`,
        }

        const options = {
            method: "get",
        } as URLFetchRequestOptions

        return new List(Trello.getTrello().authorizedRequest(request, options))
    }

    public name: string;
    public id: string;
    public url: string;

    constructor(obj) {
        this.name = obj.name;
        this.id = obj.id;
        this.url = obj.url;
    }

    public getCards(): [Card] {
        const request = {
            apiPath: `${List.model}/${this.id}/cards`,
        }

        const options = {
            method: "get",
        } as URLFetchRequestOptions

        return Trello.getTrello().authorizedRequest(request, options).map((list) => {
            return new List(list);
        });
    }

}
