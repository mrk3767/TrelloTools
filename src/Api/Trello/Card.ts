import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

export class Card {
    public static model: string = `/cards`;

    public static getCard(cardId: string): Card {
        const request = {
            apiPath: `${Card.model}${cardId}`,
        }

        const options = {
            method: "get",
        } as URLFetchRequestOptions

        return new Card(Trello.getTrello().authorizedRequest(request, options))
    }

    public name: string;
    public id: string;
    public url: string;
    public desc: string;
    public due: string;

    constructor(obj) {
        this.name = obj.name;
        this.id = obj.id;
        this.url = obj.url;
        this.desc = obj.desc;
        this.due = obj.due;
    }

    public save(listID: string): Card {
        const request = {
            apiPath: `${Card.model}`,
            payload: {
                desc: this.desc,
                due: this.due,
                idList: listID,
                name: this.name,
            },
        }

        const options = {
            method: "post",
            payload: request.payload,
        } as URLFetchRequestOptions

        return new Card(Trello.getTrello().authorizedRequest(request, options))
    }

    public addLinkAttachment(url: string): Card {
        const request = {
            apiPath: `${Card.model}/${this.id}/attachments`,
            payload: {
                name: "Link to email",
                url,
            },
        }

        const options = {
            method: "post",
            payload: request.payload,
        } as URLFetchRequestOptions

        Trello.getTrello().authorizedRequest(request, options)

        return this
    }
}
