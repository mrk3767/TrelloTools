### Install add-on in Gmail
1. Open Gmail
1. Navigate to `Settings`->`Add-ons`
1. Check `Enable developer add-ons for my account`
1. Enter deployment ID (obtain from dev setup or stable deployments below)
1. Click install

### Setup for development

1. Clone repo
1. `npm install`
1. `npx clasp login`
1. Navigate to the [G Suite Developer Hub](https://script.google.com/home/usersettings)
1. Enable the `Google Apps Script API`
1. `npx clasp create`
1. Select `standalone`
1. `npm clasp push`
1. Get your key and secret (at the bottom of the page) from [Trello](https://trello.com/app-key)
1. `npx clasp open`
1. Navigate to `File`->`Project Properties`->`Script Properties`
1. Add two rows
    1. `trello.key`:`<KEY>`
    1. `trello.secret`:`<SECRET>`
1. Save
1. Navigate to `Publish`->`Deploy from manifest...`
1. Click `Get ID`
1. Copy the deployment ID

### Stable deployments
* `AKfycbzVf5oSzTU0uKvWv3Az5LV5E2NTAj1Z-waBEeSE_AIGZXG1yj1kvU9B5EFz3Em9GRUjnA`

### Thanks
* [Google Apps Script](https://developers.google.com/apps-script/overview)
* [Trello API](https://developers.trello.com)
* [Google Clasp](https://github.com/google/clasp)
* [Microsoft TypeScript](https://github.com/Microsoft/TypeScript)
