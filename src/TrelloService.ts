namespace TrelloService {
    export function getUrl(request:TrelloRequest):string {
        return `${Config.trello.baseUrl}${request.apiPath}${request.params ? "?"+request.params+"&" : ""}`
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
        //return JSON.parse(accessProtectedResource(getUrl(request), options))
        return JSON.parse(getOAuthService().fetch(getUrl(request), options).getContentText())
    }

    export interface TrelloRequest {
        method: string;
        apiPath:string,
        params:string,
        payload:object
    }
}

function testAuthFunc() {
    accessProtectedResource(`https://api.trello.com/1/members/${Config.users.mike}/boards`, {})
}

/**
 * Attempts to access a non-Google API using a constructed service
 * object.
 *
 * If your add-on needs access to non-Google APIs that require OAuth,
 * you need to implement this method. You can use the OAuth1 and
 * OAuth2 Apps Script libraries to help implement it.
 *
 * @param {String} url         The URL to access.
 * @param {String} method_opt  The HTTP method. Defaults to GET.
 * @param {Object} headers_opt The HTTP headers. Defaults to an empty
 *                             object. The Authorization field is added
 *                             to the headers in this method.
 * @returns {HttpResponse} the result from the UrlFetchApp.fetch() call.
 */
function accessProtectedResource(url, options) {
    var service = getOAuthService();
    var maybeAuthorized = service.hasAccess();
    console.log("Checking access")
    if (maybeAuthorized) {
        // A token is present, but it may be expired or invalid. Make a
        // request and check the response code to be sure.

        // Make the UrlFetch request and return the result.
        options['muteHttpExceptions'] = true
        var resp = getOAuthService().fetch(url, options);

        var code = resp.getResponseCode();
        if (code >= 200 && code < 300) {
            console.log("Request was a success")
            return resp.getContentText("utf-8"); // Success
        } else if (code == 401 || code == 403) {
            console.log("Not authorized")
            // Not fully authorized for this action.
            maybeAuthorized = false;
        } else {
            // Handle other response codes by logging them and throwing an
            // exception.
            console.error("Backend server error (%s): %s", code.toString(),
                resp.getContentText("utf-8"));
            throw ("Backend server error: " + code);
        }
    }

    if (!maybeAuthorized) {
        console.log(`Start authorization flow ${service.authorize()}`)
        // Invoke the authorization flow using the default authorization
        // prompt card.
        CardService.newAuthorizationException()
            .setAuthorizationUrl(service.authorize())
            .setResourceDisplayName("Trello needs authorization")
            .throwException();
    }
}

/**
 * Create a new OAuth service to facilitate accessing an API.
 * This example assumes there is a single service that the add-on needs to
 * access. Its name is used when persisting the authorized token, so ensure
 * it is unique within the scope of the property store. You must set the
 * client secret and client ID, which are obtained when registering your
 * add-on with the API.
 *
 * See the Apps Script OAuth2 Library documentation for more
 * information:
 *   https://github.com/googlesamples/apps-script-oauth2#1-create-the-oauth2-service
 *
 *  @returns A configured OAuth2 service object.
 */
function getOAuthService() {
    return OAuth1.createService('trello')
    // Set the endpoint URLs.
        .setAccessTokenUrl('https://trello.com/1/OAuthGetAccessToken')
        .setRequestTokenUrl('https://trello.com/1/OAuthGetRequestToken')
        .setAuthorizationUrl('https://trello.com/1/OAuthAuthorizeToken')
        // Set the consumer key and secret.
        .setConsumerKey(Config.trello.key)
        .setConsumerSecret(Config.trello.secret)
        // Set the name of the callback function in the script referenced
        // above that should be invoked to complete the OAuth flow.
        .setCallbackFunction('authCallback')
        // Set the property store where authorized tokens should be persisted.
        .setPropertyStore(PropertiesService.getUserProperties());

}

/**
 * Boilerplate code to determine if a request is authorized and returns
 * a corresponding HTML message. When the user completes the OAuth2 flow
 * on the service provider's website, this function is invoked from the
 * service. In order for authorization to succeed you must make sure that
 * the service knows how to call this function by setting the correct
 * redirect URL.
 *
 * The redirect URL to enter is:
 * https://script.google.com/macros/d/<Apps Script ID>/usercallback
 *
 * See the Apps Script OAuth2 Library documentation for more
 * information:
 *   https://github.com/googlesamples/apps-script-oauth2#1-create-the-oauth2-service
 *
 *  @param {Object} callbackRequest The request data received from the
 *                  callback function. Pass it to the service's
 *                  handleCallback() method to complete the
 *                  authorization process.
 *  @returns {HtmlOutput} a success or denied HTML message to display to
 *           the user. Also sets a timer to close the window
 *           automatically.
 */
function authCallback(callbackRequest) {
    console.log(`We were called back! #{callbackRequest}`)
    var authorized = getOAuthService().handleCallback(callbackRequest);
    if (authorized) {
        console.log("YAY!")
        return HtmlService.createHtmlOutput(
            'Success! <script>setTimeout(function() { top.window.close() }, 1);</script>');
    } else {
        console.log("Denied :(")
        return HtmlService.createHtmlOutput('Denied');
    }
}

/**
 * Unauthorizes the non-Google service. This is useful for OAuth
 * development/testing.  Run this method (Run > resetOAuth in the script
 * editor) to reset OAuth to re-prompt the user for OAuth.
 */
function resetOAuth() {
    getOAuthService().reset();
}