export class CardNameWidget {
    protected state
    protected props

    constructor(props?) {
        this.props = props
        this.state = StateManager.getStateManager().getState(this.constructor.name)
    }

    public render() {
        return CardService.newTextInput()
            .setTitle("Name")
            .setFieldName("name")
            .setValue(this.props.subjectLine);
    }
}
