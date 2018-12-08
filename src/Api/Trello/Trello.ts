import {Token} from "./Token";

export class Trello {
    public static trello

    public static getTrello() {
        if (this.trello) {
            return this.trello
        } else {
            return this.trello = new Trello()
        }
    }

    private static SUCCESS_HTML = "Success!"
    private static DENIED_HTML = `Denied`
    private static RESOURCE = `Trello account`
    private static accessTokenUrl = "https://api.trello.com/1/OAuthGetAccessToken"
    private static authorizationUrl = "https://api.trello.com/1/OAuthAuthorizeToken"
    private static requestTokenUrl = "https://api.trello.com/1/OAuthGetRequestToken"
    private static scopes = "read,write"
    private static baseUrl = "https://trello.com/1"
    private readonly authService

    private constructor() {
        this.authService = this.getAuthService()
    }

    public getUrl(props): string {
        return `${Trello.baseUrl}${props.apiPath}${props.params ? "?" + props.params : ""}`;
    }

    public reset() {
        this.authService.reset()
    }

    public handleCallback(request) {
        const authorized = this.authService.handleCallback(request)
        if (authorized) {
            StateManager.getStateManager().setState(Token.stateKey, this.authService.getToken_())
            return HtmlService.createHtmlOutput(Trello.SUCCESS_HTML);
        } else {
            return HtmlService.createHtmlOutput(Trello.DENIED_HTML);
        }
    }

     public authorizedRequest(request, options) {
        const trelloService = this.authService
        let maybeAuthorized = trelloService.hasAccess()
        if (maybeAuthorized) {
            options.muteHttpExceptions = true
            const url = this.getUrl(request)
            const response = this.authService.fetch(url, options)
            const code = response.getResponseCode()
            if (code >= 200 && code < 300) {
                return JSON.parse(response.getContentText("utf-8"))
            } else if (code === 401 || code === 403) {
                maybeAuthorized = false
            } else {
                throw new Error(`Error`)
            }
        }
        if (!maybeAuthorized) {
            CardService.newAuthorizationException()
                .setAuthorizationUrl(trelloService.authorize())
                .setResourceDisplayName(Trello.RESOURCE)
                .throwException()
        }
    }

    public buildUrl_(url, params) {
        const paramString = Object.keys(params).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
        }).join("&");
        return url + (url.indexOf("?") >= 0 ? "&" : "?") + paramString;
    }

    private getAuthService() {
        const oAuthParams = `name=${APP_NAME}&scope=${Trello.scopes}`
        const scriptProperties = PropertiesService.getScriptProperties()
        // @ts-ignore
        return OAuth1.createService(APP_NAME)
            .setAccessTokenUrl(Trello.accessTokenUrl)
            .setRequestTokenUrl(`${Trello.requestTokenUrl}?${oAuthParams}`)
            .setAuthorizationUrl(`${Trello.authorizationUrl}?${oAuthParams}`)
            .setConsumerKey(scriptProperties.getProperty(`trello.key`))
            .setConsumerSecret(scriptProperties.getProperty(`trello.secret`))
            .setCallbackFunction("oAuthCallback")
            .setCache(CacheService.getUserCache())
            .setPropertyStore(PropertiesService.getUserProperties())
    }
}
