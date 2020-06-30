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
    const saleDate = cur.ownerInfo.ownerData && cur.ownerInfo.ownerData[0] && cur.ownerInfo.ownerData[0].SALEDATE;
    const taxVal = cur.taxData && Number(cur.taxData['2016_Assessment'].replace('$','').replace(/,/g,''));
    // console.log('data', saleDate);
    // if (address.includes(`1739 S `)) {
    //   console.log('data', saleDate);
    //   console.log(!numUnits || numUnits === 0 || numUnits < 3);
    //   console.log(!saleDate || new Date(saleDate) < new Date('2005-01-01'));
    //   console.log(cur.licenseDetails.licenseData.length >= 1);
    //   console.log(!taxVal || (taxVal < 2000000 && taxVal > 900000));
    // }
    if (
      (!numUnits || numUnits === 0 || numUnits < 3)
      // Addresses with lots of custructions and other "stuff"
      // && JSON.stringify(cur).length < 20000
      // Last sold before 2001
      && (!saleDate || new Date(saleDate) < new Date('2005-01-01'))
      //Has a legal C/O
      && (cur.licenseDetails.licenseData.length >= 1)
      //Exclude buildings that have multiple units (i.e. condos)
      && (cur.charDetails.charData.length === 1)
      // && (!yrRmdl || yrRmdl < 2005)
      && (!taxVal || (taxVal < 2000000 && taxVal > 900000))
    ){
      // console.log(address);
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