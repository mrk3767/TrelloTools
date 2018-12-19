import {Token} from "../../Api/Trello/Token";

export class BoardSelectionWidget {
    private state
    private props

    private boards

    constructor(props?) {
        this.props = props
        this.state = StateManager.getStateManager().getState(this.constructor.name)
        const user = Token.getCurrentToken().getMember()
        this.boards = user.getBoards()
    }

    public render(): GoogleAppsScript.Card.Widget {
        const selectionInput = CardService.newSelectionInput()
            .setFieldName("selectedBoard")
            .setTitle("Board")
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setOnChangeAction(CardService.newAction()
                .setFunctionName("handleUiUpdate")
                .setParameters({class: "TrelloNewCardUi", handler: "handleBoardSelectionChange"})
                .setLoadIndicator(CardService.LoadIndicator.SPINNER));
        if (!this.props.selectedBoard) {
            selectionInput.addItem("No board selected", "", true);
        }
        this.boards.forEach((board) => {
            selectionInput.addItem(board.name, board.id, board.id === this.props.selectedBoard);
        });
        return selectionInput;
    }
}
