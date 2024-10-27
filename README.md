# orange-desktop-app

This is a desktop, system-tray accessory app for the [Orange ($ORA)](https://oranges.meme) project. It provides a quick way to view current stats for ORA as well as mine ORA using a local Algorand node. The app is built using Tauri, React, and Typescript.

Much of this app is based on [source code](https://github.com/grzracz/OrangeApp) for the oranges.meme site and OG miner created by Grzegorz Raczek (aka @grzracz). Many thanks to him for his work on the original project!

## Configuration 

This app currently requires a local Algorand node to be running in order to operate. Running your own node allows you to use this app without any dependencies on any other services as everything is done directly with the Algorand blockchain in a completely decentralized manner. 

For more technically inclined users, you can run your own node by following the instructions on the [Algorand Developer Portal](https://developer.algorand.org/docs/run-a-node/setup/install/).

For users who are not technically inclined, you can use [Aust's 1-Click Node (A1CN)](https://github.com/AustP/austs-one-click-node). It is probably the easiest way to get a node up and running quickly. 

Once you have a node running, start this application and go to the "Node" tab. Here you will enter two relevant configuration values:

* Token: The API token to access your node. The current token can be viewed by reading the contents of the algod.token in the data directory of your node. (If using A1CN, you can view the token in the application.) 
* Port: The port that your node is running on. 

## Features

Once you have your node configured, you can use the app to view the current stats for ORA and mine ORA. The home page shows the current price of ORA in Algo and USD using [Vestige's online API](https://free-api.vestige.fi/docs. Other values are read directly from the blockchain using your node.

The "Mine" tab allows you to mine ORA. It requires a wallet that you can provide via seed phrase or allow you to generate a new wallet. Using either path, the app will require you to set a password. The password is used to encrypt the wallet for storage on your local machine. If you generate a wallet, you can recover the seed phrase for it from the Wallet dialog available in the upper right of the mining page. (Requires password to copy the seed phrase.)

Mining is currently based on OG miner. The app will automatically start the miner when you click the "Start Mining" button. You can stop the miner at any time by clicking the "Stop Mining" button. You can configure the rate of transactions as well as amount to send per transaction. 

## Roadmap

* Create more advanced settings for mining (burst/trickle, conditions for pausing, etc.)
* Add additional stats

## Development

Install dependencies:

```bash
yarn install
```

Running the app:

```bash
yarn tauri dev
```

Building the app:

```bash
yarn tauri build
```

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
