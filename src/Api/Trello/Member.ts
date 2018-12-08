import {Board} from "./Board";
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
import {Trello} from "./Trello";

export class Member {
    public static model: string = `/members`;

    public static getMember(memberId: string): Member {
        const request = {
            apiPath: `${Member.model}/${memberId}`,
        }

        const options = {
            method: "get",
        } as URLFetchRequestOptions

        return new Member(Trello.getTrello().authorizedRequest(request, options))
    }

    public name: string;
    public id: string;
    public url: string;

    constructor(obj) {
        this.name = obj.name;
        this.id = obj.id;
        this.url = obj.url;
    }

    public getBoards(): [Board] {
        const request = {
            apiPath: `${Member.model}/${this.id}/boards`,
            params: "filter=open",
        }

        const options = {
            method: "get",
        } as URLFetchRequestOptions

        return Trello.getTrello().authorizedRequest(request, options).map((board) => {
            return new Board(board)
        })
    }
}
