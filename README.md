# dc-addresses
Scripts to pull property info on DC addresses

run using node 12

`node fetchAndSaveData.js` will iterate through all the addresses in `addresses.json` and will add any outdated info and save a new timestamped json file.

`node filterAddresses.js` will iterate through the data in `addresses.json` and will apply logic to find potential interesting addresses and will save a new filtered address json file.