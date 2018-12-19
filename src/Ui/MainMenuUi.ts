export class MainMenuUi {
    private state
    private props

    constructor(props?) {
        this.props = props
        this.state = StateManager.getStateManager().getState(this.constructor.name)
    }

    public render(): GoogleAppsScript.Card.Card {
        return CardService.newCardBuilder()
            .addSection(CardService.newCardSection()
                .addWidget(CardService.newTextButton()
                    .setText("Create new card")
                    .setOnClickAction(CardService.newAction()
                        .setFunctionName("handleUiUpdate")
                        .setParameters({class: "TrelloNewCardUi", handler: "handleClickIntoUi"})
                        .setLoadIndicator(CardService.LoadIndicator.SPINNER))))
            .build();
    }
}
