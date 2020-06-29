const fs = require('fs')
const fetch = require('node-fetch');
const addresses = require('./addresses.json');

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, ' '));
  } catch (err) {
    console.error(err)
  }
}

let results = {}

async function filterAddresses(){
  let processCount = 0;
  console.log(`Starting with ${Object.keys(addresses).length} addresses`);
  for (address in addresses) {
    let cur = addresses[address];
    // console.log(JSON.stringify(cur, null, ' '));
    const numOwners = cur.ownerInfo.ownerData.length;
    const numUnits = cur.charDetails.charData.length && cur.charDetails.charData[0].NUM_UNITS;
    const yrRmdl = cur.charDetails.charData.length && cur.charDetails.charData[0].YR_RMDL;
    console.log('data', yrRmdl);
    if (
      numOwners <= 3
      && (!numUnits || numUnits < 3)
      // Addresses with lots of custructions and other "stuff"
      && JSON.stringify(cur).length < 20000
      // Last sold before 2001
      && (cur.ownerInfo.ownerData && cur.ownerInfo.ownerData[0] && cur.ownerInfo.ownerData[0].SALEDATE < new Date('2001-01-01'))
      && (cur.licenseDetails.licenseData.length >= 1)
      && (!yrRmdl || yrRmdl < 2005)
    ){
      results[address] = cur;
    }
    processCount++;
    // if (processCount > 20) break;
  };
  storeData(results, `./filteredAddresses.json`);

  console.log(`Filtered down to ${Object.keys(results).length} addresses`);
  for (address in results) {
    let cur = addresses[address];
    const numOwners = cur.ownerInfo.ownerData.length;
    const numUnits = cur.charDetails.charData.length && cur.charDetails.charData[0].NUM_UNITS;

  };
}

filterAddresses();