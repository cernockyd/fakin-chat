
# fakin-chat

## Get started

Be sure to have Node >= 6 installed.

Clone
```bash
git clone https://github.com/awfulthings/fakin-chat.git && cd fakin-chat
```

Install dependencies
```bash
yarn
```

Run
```bash
yarn start
```

## Fetching books metadata
Books metadata are fetched from Google Books API.

You may need to:

- Set up Google Cloud project
- [Generate API key](https://support.google.com/cloud/answer/6158862)
- Enable [Google Books API](https://console.cloud.google.com/apis/dashboard) within your project

### Fetch metadata

Call this with your Google Books API key to fetch data.
- presumes that you have `raw.data.json` with books
- outputs `src/data.json`
```bash
node DataHelper.js fetch <GOOGLE BOOKS API KEY>
```

### Process fetched data for recommendation operations
- presumes that you have `src/data.json` with fetched m
etadata
- outputs `src/recommendation-data.json`
```bash
node DataHelper.js process
```


## Deploy

- Install [firebase cli](https://firebase.google.com/docs/cli/)
- Run `yarn build && firebase deploy` to generate and deploy static app.