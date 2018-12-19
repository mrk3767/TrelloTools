import {BoardSelectionWidget} from "./BoardSelectionWidget";
import {CardDescriptionWidget} from "./CardDescriptionWidget";
import {CardDueDateWidget} from "./CardDueDateWidget";
import {CardNameWidget} from "./CardNameWidget";
import {CardSubmitWidget} from "./CardSubmitWidget";
import {ListSelectionWidget} from "./ListSelectionWidget";

export class TrelloNewCardUi {

    public static handleClickIntoUi(e) {
        const message = new Message(e)

        StateManager.getStateManager().setState(this.name, {subjectLine: message.subjectLine})

        return CardService.newNavigation()
            .popToRoot()
            .pushCard(new TrelloNewCardUi().render())
    }

    public static handleBoardSelectionChange(e) {
        StateManager.getStateManager().setState(this.name, {selectedBoard: e.formInput.selectedBoard})
        return CardService.newNavigation()
            .updateCard(new TrelloNewCardUi().render()) // TODO: Find UI parent instead of hardcoding

    }
    protected state
    protected props

    constructor(props?) {
        this.props = props
        this.state = StateManager.getStateManager().getState(this.constructor.name)
    }

    public render(): GoogleAppsScript.Card.Card {
        return CardService.newCardBuilder()
            .addSection(CardService.newCardSection()
                .addWidget(new BoardSelectionWidget({selectedBoard: this.state.selectedBoard}).render())
                .addWidget(new ListSelectionWidget({selectedBoard: this.state.selectedBoard}).render())
                .addWidget(new CardNameWidget({subjectLine: this.state.subjectLine}).render())
                .addWidget(new CardDescriptionWidget().render())
                .addWidget(new CardDueDateWidget().render())
                .addWidget(new CardSubmitWidget().render()))
            .setHeader(CardService.newCardHeader().setTitle("Create a new card"))
            .build();
    }
}









