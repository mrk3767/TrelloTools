import TrelloRequest = TrelloService.TrelloRequest;
import {Card} from "./Card";

export class List {
    static model:string = `/lists/`
    public name:string
    public id:string
    public url:string

    constructor(obj) {
        this.name = obj.name
        this.id = obj.id
        this.url = obj.url
    }

    static getList(listId:string):List {
        let request:TrelloRequest = {
            apiPath: `${List.model}${listId}`
        } as TrelloRequest

        return new List(TrelloService.send(request))
    }

    getCards():[Card] {
        let request:TrelloRequest = {
            apiPath: `${List.model}${this.id}/cards`
        } as TrelloRequest
        return TrelloService.send(request).map((list) => {
            return new List(list)
        })
    }

}