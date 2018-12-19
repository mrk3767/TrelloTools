import {Member} from "./Member";
import {Trello} from "./Trello";

export class Token {
    public static stateKey: string = `user.token`
    public static token

    public static getCurrentToken() {
        if (this.token) {
            return this.token
        } else {
            return this.token = new Token(StateManager.getStateManager().getState(this.stateKey))
        }
    }
    private model: string = `/tokens`;
    private oauthToken
    private public
    private oauthTokenSecret

    private constructor(obj) {
        this.oauthToken = obj.oauth_token
        this.public = obj.public
        this.oauthTokenSecret = obj.oauth_token_secret
    }

    public getMember(): Member {
        const request = {
            apiPath: `${this.model}/${this.oauthToken}`,
        }

        const options = {
            method: `get`,
        }
        const tokenInfo = Trello.getTrello().authorizedRequest(request, options)
        const memberId = tokenInfo.idMember
        return Member.getMember(memberId)
    }
}
