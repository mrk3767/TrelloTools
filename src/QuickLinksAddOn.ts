import {Member} from "./Member";
import {Board} from "./Board";
import {List} from "./List";
import {Card} from "./Card";

const userProperties = PropertiesService.getUserProperties()
const state = JSON.parse(userProperties.getProperty("state")) || {
    email:{
        subjectLine: undefined
    },
    selectedBoard: undefined,
    boards:[],
    selectedList: undefined,
}

function updateState() {
    userProperties.setProperty("state", JSON.stringify(state))
}

function buildQuickLinkUI(e):GoogleAppsScript.Card.Card[] {
    return new Array(getCardMenu({}))
}

function getCardMenu(props):GoogleAppsScript.Card.Card {
    return CardService.newCardBuilder()
        .addSection(CardService.newCardSection()
            .addWidget(CardService.newTextButton()
                .setText("Create new card")
                .setOnClickAction(CardService.newAction()
                    .setFunctionName("navigateToTrelloNewCard")
                    .setLoadIndicator(CardService.LoadIndicator.SPINNER))))
        .build()
}

function navigateToTrelloNewCard(e) {
    const accessToken = e.messageMetadata.accessToken
    GmailApp.setCurrentMessageAccessToken(accessToken)

    const messageId = e.messageMetadata.messageId;
    const message = GmailApp.getMessageById(messageId);

    const thread = message.getThread()
    const threadLink = thread.getPermalink()

    state.email.subjectLine = message.getSubject()
    const mike = Member.getMember(Config.users.mike)
    const boards = mike.getBoards()
    state.boards = boards

    updateState()

    return CardService.newNavigation()
        .popToRoot()
        .pushCard(getCardTrelloNewCard(state))
}

function getCardTrelloNewCard(props):GoogleAppsScript.Card.Card {
    var lists = [];
    if(props.selectedBoard)
        lists = Board.getBoard(props.selectedBoard).getLists()
    console.log(`${props.selectedBoard}:${props.selectedBoard} lists:${lists}`)
    return CardService.newCardBuilder()
        .addSection(CardService.newCardSection()
            .addWidget(getWidgetBoardSelection({boards: props.boards, selectedBoard: props.selectedBoard}))
            .addWidget(getWidgetListsSelection({lists: lists, selectedList: props.selectedList, selectedBoard: props.selectedBoard}))
            .addWidget(getWidgetCardName({subjectLine:props.email.subjectLine}))
            .addWidget(getWidgetDescription())
            .addWidget(getWidgetDueDate())
            .addWidget(getWidgetSubmitCard()))
        .setHeader(CardService.newCardHeader().setTitle("Create a new card"))
        .build()
}

function getWidgetBoardSelection(props):GoogleAppsScript.Card.Widget {
    let selectionInput = CardService.newSelectionInput()
        .setFieldName("selectedBoard")
        .setTitle("Board")
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setOnChangeAction(CardService.newAction()
            .setFunctionName("handleBoardSelectionChange")
            .setLoadIndicator(CardService.LoadIndicator.SPINNER))
    if(!props.selectedBoard)
        selectionInput.addItem("No board selected", "", true)
    props.boards.forEach((board) => {
        selectionInput.addItem(board.name, board.id, board.id == props.selectedBoard)
    })
    return selectionInput
}

function handleBoardSelectionChange(e) {
    state.selectedBoard = e.formInput.selectedBoard
    updateState()
    return CardService.newNavigation()
        .updateCard(getCardTrelloNewCard(state))
}

function getWidgetListsSelection(props):GoogleAppsScript.Card.Widget {
    let selectionInput = CardService.newSelectionInput()
        .setFieldName("selectedList")
        .setTitle("List")
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setOnChangeAction(CardService.newAction()
            .setFunctionName("handleListSelectionChange")
            .setLoadIndicator(CardService.LoadIndicator.SPINNER))
    if(!props.selectedBoard)
        selectionInput.addItem("No board selected", "", true)
    if(!props.selectedList)
        selectionInput.addItem("No list selected", "", true)
    props.lists.forEach((list:List) => {
        selectionInput.addItem(list.name, list.id, props.selectedList == list.id)
    })
    if(props.lists.length == 0)
        selectionInput.addItem("No lists on board!", "err", true)
    return selectionInput
}

function handleListSelectionChange(e) {
    state.selectedList = e.formInput.selectedList
    updateState()
    return CardService.newNavigation()
        .updateCard(getCardTrelloNewCard(state))
}

function getWidgetCardName(props):GoogleAppsScript.Card.Widget {
    return CardService.newTextInput()
        .setTitle("Name")
        .setFieldName("name")
        .setValue(props.subjectLine)
}

function getWidgetDescription():GoogleAppsScript.Card.Widget {
    return CardService.newTextInput()
        .setMultiline(true)
        .setFieldName("description")
        .setTitle("Description")
}

function getWidgetDueDate():GoogleAppsScript.Card.Widget {
    const now = new Date()
    return CardService.newTextInput()
        .setFieldName("dueDate")
        .setTitle("Due Date")
        .setHint(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`)
}

function getWidgetSubmitCard():GoogleAppsScript.Card.Widget {
    return CardService.newTextButton()
        .setText("ADD")
        .setOnClickAction(CardService.newAction()
            .setFunctionName("handleTrelloNewCardSubmit")
            .setLoadIndicator(CardService.LoadIndicator.SPINNER))
}

function handleTrelloNewCardSubmit(e) {
    const accessToken = e.messageMetadata.accessToken
    GmailApp.setCurrentMessageAccessToken(accessToken)

    const messageId = e.messageMetadata.messageId;
    const message = GmailApp.getMessageById(messageId);

    const thread = message.getThread()
    const threadLink = thread.getPermalink()

    new Card({
        name: e.formInput.name,
        desc: e.formInput.description,
        due: e.formInput.dueDate
    }).save(e.formInput.selectedList).addLinkAttachment(threadLink)
    return CardService.newNavigation()
        .popToRoot()
}