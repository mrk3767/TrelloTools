import {List} from "./List";
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

export class Board {
    public static model: string = `/boards`;

    public static getBoard(boardId: string): Board {
        const request = {
            apiPath: `${this.model}/${boardId}`,
        }

        const options = {
            method: "get",
        } as URLFetchRequestOptions

        return new Board(Trello.getTrello().authorizedRequest(request, options))
    }

    public name: string;
    public id: string;
    public url: string;

    constructor(obj) {
        this.name = obj.name;
        this.id = obj.id;
        this.url = obj.url;
    }

    public getLists(): [List] {
        const request = {
            apiPath: `${Board.model}/${this.id}/lists`,
        }

        const options = {
            method: "get",
        } as URLFetchRequestOptions

        return Trello.getTrello().authorizedRequest(request, options).map((list) => {
            return new List(list);
        });
    }
}
