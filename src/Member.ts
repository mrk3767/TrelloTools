import {Board} from "./Board";
import TrelloRequest = TrelloService.TrelloRequest;

export class Member {
    static model:string = `/members/`
    public name:string
    public id:string
    public url:string

    constructor(obj) {
        this.name = obj.name
        this.id = obj.id
        this.url = obj.url
    }

    static getMember(memberId:string):Member {
        let request:TrelloRequest = {
            apiPath: `${Member.model}${memberId}`
        } as TrelloRequest
        return new Member(TrelloService.send(request))
    }

    getBoards():[Board] {
        let request:TrelloRequest = {
            apiPath: `${Member.model}${this.id}/boards`,
            params: "filter=open"
        } as TrelloRequest
        return TrelloService.send(request).map((board) => {
            return new Board(board)
        })
    }
}