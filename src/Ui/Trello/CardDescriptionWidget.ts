export class CardDescriptionWidget {
    protected state
    protected props

    constructor(props?) {
        this.props = props
        this.state = StateManager.getStateManager().getState(this.constructor.name)
    }

    public render(): GoogleAppsScript.Card.Widget {
        return CardService.newTextInput()
            .setMultiline(true)
            .setFieldName("description")
            .setTitle("Description");
    }
}
