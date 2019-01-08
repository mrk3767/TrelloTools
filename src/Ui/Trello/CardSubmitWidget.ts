import {Card} from "../../Api/Trello/Card";

export class CardSubmitWidget {

    public static handleSubmit(e) {
        const message = new Message(e)

        new Card({
            desc: e.formInput.description,
            due: e.formInput.due,
            name: e.formInput.name,
        }).save(e.formInput.selectedList).addLinkAttachment(message.threadLink);

        if (e.formInput.handlingOptions === "labelAndArchive") {
            message.labelAsTrello().archive()
        }

        return CardService.newNavigation()
            .popToRoot();
    }
    protected state
    protected props

    constructor(props?) {
        this.props = props
        this.state = StateManager.getStateManager().getState(this.constructor.name)
    }

    public render(): GoogleAppsScript.Card.Widget {
        return CardService.newTextButton()
            .setText("ADD")
            .setOnClickAction(CardService.newAction()
                .setFunctionName("handleUiUpdate")
                .setParameters({class: "CardSubmitWidget", handler: "handleSubmit"})
                .setLoadIndicator(CardService.LoadIndicator.SPINNER));
    }
}
