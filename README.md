# Description

This VSCode extension aims to provide a better language support for the smart-contract language of Massa blockchain. 
Check out our [discord](https://discord.gg/vFXVFwqtHT) and our [twitter](https://twitter.com/osmiumtoolchain) for important announcements.

# Usage
The extension can be downloaded directly from the VSCode Marketplace by searching for "Osmium massa" or by using the direct ID [osmiumtoolchains.osmium-massa-extension](https://marketplace.visualstudio.com/items?itemName=OsmiumToolchains.osmium-massa-extension).  

When openning a massa project/file, all the features will be enabled by default. 
  

# Project structure
## libs
This folder contains a set of generic rust libraries to manipulate massa related data such as project and source files. Thoses libraries can be used in your projects.  

## servers
This directory contains all the LSP and DAP servers necessary for all the extension's features. Thoses servers can also be used for another IDE integration (which is not on our roadmap).

## sidebar
The frontend project related to the sidebar panel of the extension.

## vscode
This folders contains the proper extension project scaffold that launches the server and provide some features in typescript
