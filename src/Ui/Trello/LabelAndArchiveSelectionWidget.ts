export class LabelAndArchiveSelectionWidget {
    public render(): GoogleAppsScript.Card.Widget {
        return CardService.newSelectionInput()
            .setFieldName("handlingOptions")
            .setType(CardService.SelectionInputType.CHECK_BOX)
            .addItem('Label as "Trello" and archive?', "labelAndArchive", true)
    }
}
