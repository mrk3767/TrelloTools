namespace TrelloService {
    export function getUrl(request:TrelloRequest):string {
        return `${Config.trello.baseUrl}${request.apiPath}${request.params ? "?"+request.params+"&" : "?"}key=${Config.trello.key}&token=${Config.trello.token}`
    }

    export function send(request:TrelloRequest) {
        let options:object = {}
        if(request.payload){
            options['method'] = 'put'
            options['payload'] = request.payload
        } else {
            options['method'] = 'get'
        }
        if(request.method)
            options['method'] = request.method
        return JSON.parse(UrlFetchApp.fetch(getUrl(request), options).getContentText())
    }

    export interface TrelloRequest {
        method: string;
        apiPath:string,
        params:string,
        payload:object
    }
}