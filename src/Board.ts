import TrelloRequest = TrelloService.TrelloRequest;
import {List} from "./List";

export class Board {
    static model:string = `/boards/`
    public name:string
    public id:string
    public url:string

    constructor(obj) {
        this.name = obj.name
        this.id = obj.id
        this.url = obj.url
    }

    static getBoard(boardId:string):Board {
        let request:TrelloRequest = {
            apiPath: `/boards/${boardId}`
        } as TrelloRequest
        return new Board(TrelloService.send(request))
    }

    getLists():[List] {
        let request:TrelloRequest = {
            apiPath: `${Board.model}${this.id}/lists`
        } as TrelloRequest
        return TrelloService.send(request).map((list) => {
            return new List(list)
        })
    }
}