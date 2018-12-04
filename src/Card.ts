import TrelloRequest = TrelloService.TrelloRequest;

export class Card {
    static model:string = `/cards/`
    public name:string
    public id:string
    public url:string
    public desc:string
    public due:string

    constructor(obj) {
        this.name = obj.name
        this.id = obj.id
        this.url = obj.url
        this.desc = obj.desc
    }

    save(listID:string):Card {
        let request:TrelloRequest = {
            apiPath: `${Card.model}`,
            method: 'post',
            payload: {
                name: this.name,
                desc: this.desc,
                due: this.due,
                idList: listID
            }
        } as TrelloRequest

        return new Card(TrelloService.send(request))
    }

    addLinkAttachment(url:string):Card {
        let request:TrelloRequest = {
            apiPath: `${Card.model}${this.id}/attachments`,
            method: 'post',
            payload: {
                name: "Link to email",
                url: url
            }
        } as TrelloRequest
        TrelloService.send(request)
        return this
    }

    static getCard(cardId:string):Card {
        let request:TrelloRequest = {
            apiPath: `${Card.model}${cardId}`
        } as TrelloRequest

        return new Card(TrelloService.send(request))
    }

}