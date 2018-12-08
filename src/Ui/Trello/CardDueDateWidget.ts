export class CardDueDateWidget {
    protected state
    protected props

    constructor(props?) {
        this.props = props
        this.state = StateManager.getStateManager().getState(this.constructor.name)
    }

    public render(): GoogleAppsScript.Card.Widget {
        const now = new Date();
        return CardService.newTextInput()
            .setFieldName("due")
            .setTitle("Due Date")
            .setHint(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
    }
}
