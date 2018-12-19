import {Trello} from "./Api/Trello/Trello";
import {MainMenuUi} from "./Ui/MainMenuUi";
import {StateManager} from "./Ui/StateManager"

const APP_NAME = `TrelloTools`

function handleUiUpdate(e) {
    // TODO: Create a whitelist for classes/methods that can be called
    // TODO: Use decorators to add handlers to the whitelist
    // TODO: Ensure `e` is handled correctly
    // tslint:disable-next-line no-eval
    return eval(`${e.parameters.class}.${e.parameters.handler}(JSON.parse('${JSON.stringify(e)}'))`)
}

function buildQuickLinkUI(e): GoogleAppsScript.Card.Card[] {
    return new Array(new MainMenuUi().render());
}

function oAuthCallback(request) {
    return Trello.getTrello().handleCallback(request)
}

function logout() {
    StateManager.getStateManager().reset()
    Trello.getTrello().reset()
}
