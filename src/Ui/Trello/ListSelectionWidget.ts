import {Board} from "../../Api/Trello/Board";
import {TrelloNewCardUi} from "./TrelloNewCardUi";

export class ListSelectionWidget {

    public static handleListSelectionChange(e) {
        StateManager.getStateManager().setState(this.name, {selectedList: e.formInput.selectedList})
        return CardService.newNavigation()
            .updateCard(new TrelloNewCardUi().render()) // TODO: Find UI parent instead of hardcoding
    }
    protected state
    protected props

    private lists = []

    constructor(props) {
        this.props = props
        this.state = StateManager.getStateManager().getState(this.constructor.name)
        if (props.selectedBoard) {
            const board = Board.getBoard(this.props.selectedBoard)
            this.lists = board.getLists()
        }
    }

    public render(): GoogleAppsScript.Card.Widget {
        const selectionInput = CardService.newSelectionInput()
            .setFieldName("selectedList")
            .setTitle("List")
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setOnChangeAction(CardService.newAction()
                .setFunctionName("handleUiUpdate")
                .setParameters({class: "ListSelectionWidget", handler: "handleListSelectionChange"})
                .setLoadIndicator(CardService.LoadIndicator.SPINNER));
        if (!this.props.selectedBoard) {
            selectionInput.addItem("No board selected", "", true);
        }
        if (!this.state.selectedList) {
            selectionInput.addItem("No list selected", "", true);
        }
        this.lists.forEach((list) => {
            selectionInput.addItem(list.name, list.id, this.state.selectedList === list.id);
        });
        if (this.lists.length === 0) {
            selectionInput.addItem("No lists on board!", "err", true);
        }
        return selectionInput;
    }
}
