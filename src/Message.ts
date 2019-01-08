class Message {
    public accessToken: string;
    public  messageId: any;
    public  message: GoogleAppsScript.Gmail.GmailMessage;
    public  thread: GoogleAppsScript.Gmail.GmailThread;
    public  threadLink: string;
    public  subjectLine: string;
    constructor(e) {
        this.accessToken = e.messageMetadata.accessToken;
        GmailApp.setCurrentMessageAccessToken(this.accessToken);

        this.messageId = e.messageMetadata.messageId;
        this.message = GmailApp.getMessageById(this.messageId);

        this.thread = this.message.getThread();
        this.threadLink = this.thread.getPermalink();

        this.subjectLine = this.message.getSubject()
    }
    public labelAsTrello() {
        const label = GmailApp.getUserLabelByName("Trello")
        this.thread.addLabel(label)
        return this
    }

    public archive() {
        this.thread.moveToArchive()
        return this
    }
}

function getMessageDetails(e) {
    const accessToken = e.messageMetadata.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    const messageId = e.messageMetadata.messageId;
    const message = GmailApp.getMessageById(messageId);

    const thread = message.getThread();
    const threadLink = thread.getPermalink();

    const subjectLine = message.getSubject()
}
