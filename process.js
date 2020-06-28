const fs = require('fs')
const fetch = require('node-fetch');
const addresses = require('./addresses.json');

const authHeader = 'Bearer eyJraWQiOiJNZmk0dmlpNW5iRmI0YnBscmY0dTFlNktDYXh3aDVIbk1rOFlhbkZhYThVIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULm42clFqV2d4eERoeTJuQ3hPWUtqVkhwcnNXOUY0RTZnR2dLY2JQdFJRRHciLCJpc3MiOiJodHRwczovL2FjY2Vzc2RjLmRjcmEuZGMuZ292L29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTU5MzM2NzkxOCwiZXhwIjoxNTkzMzc1MTE4LCJjaWQiOiIwb2FsYXA4Y1FudElzMGIxTjRoNSIsInVpZCI6IjAwdTFtOWs3cURVM3FHZ0tGNGg2Iiwic2NwIjpbInByb2ZpbGUiLCJlbWFpbCIsIm9wZW5pZCJdLCJzdWIiOiJkd29sZmFuZCtkY3JhQGdtYWlsLmNvbSJ9.Q760TadIl5c1SizwAnwpx6GNmxeIoiwhLRaBuVosYNx5TJMur_2hti2xWebXXZydW49o9QkbDR0Uax1CYdQyBBW7TKSqWJyhppxf0323crLgMW9qXUPKnhK9STN8RrYK3DQmu6H1qklditZGJ-YK7VXz0rBtmKEGCD4pzA4QGC34f6HLtkIJq1LQAbHL_ELQumNWy0vhSoswgsyhXCQZjQ_dMAQKPXOZVIxcOfnS4kZZssenQ2E2TmMcsop8rgTfaoDOfely_YpSzbjAExpDvaf5USYNiKrs13yLExx0BWavKPfdCX4BMR4hZj05yktrGA11_g1ghlAFj1kpegeT1A';

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, ' '));
  } catch (err) {
    console.error(err)
  }
}

async function getOwners(address) {
  console.log('fetching owner data for:', address);
  var post = await fetch('https://scout.dcra.dc.gov/api/Results/Owners', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify({ "searchType": "address", "sslOrAddress": address }),
  });
  response = await post.json();
  return response.Result.DATA;
};

async function getAddressDetails(address) {
  console.log('fetching address details data for:', address);
  let response;
  try {
    var post = await fetch('https://scout.dcra.dc.gov/api/SearchResult/ResultDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ "AddressOrSslInfo": address }),
    });
    response = await post.json();
    return response.Result.DATA;
  } catch(error) {
    console.log('Response', response);
  }
};

async function getLicenses(address) {
  console.log('fetching business license data for:', address);
  let response;
  try {
    var post = await fetch('https://scout.dcra.dc.gov/api/Results/BBL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({searchType: "address", sslOrAddress: address}),
    });
    response = await post.json();
    return response.Result.DATA;
  } catch(error) {
    console.log('Response', response);
  }
};

async function getPermits(address) {
  console.log('fetching permit data for:', address);
  let response;
  try {
    var post = await fetch('https://scout.dcra.dc.gov/api/Results/IssuedPermits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({searchType: "address", sslOrAddress: address}),
    });
    response = await post.json();
    return response.Result.DATA;
  } catch(error) {
    console.log('Response', response);
  }
};

async function getInspections(address) {
  console.log('fetching inspection data for:', address);
  let response;
  try {
    var post = await fetch('https://scout.dcra.dc.gov/api/Results/ConstructionInspection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({searchType: "address", sslOrAddress: address}),
    });
    response = await post.json();
    return response.Result.DATA;
  } catch(error) {
    console.log('Response', response);
  }
};

async function getOccupancy(address) {
  console.log('fetching Occupancy data for:', address);
  let response;
  try {
    var post = await fetch('https://scout.dcra.dc.gov/api/Results/Occupancy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({searchType: "address", sslOrAddress: address}),
    });
    response = await post.json();
    return response.Result.DATA;
  } catch(error) {
    console.log('Response', response);
  }
};

async function getData(){
  const refreshDate = new Date('2020-06-27');
  let processCount = 0;
  for (address in addresses) {
    if (!addresses[address].ownerInfo
      || !addresses[address].ownerInfo.ownerData
      || new Date(addresses[address].ownerInfo.updated) < refreshDate) {
      addresses[address].ownerInfo = {updated: new Date(), ownerData: await getOwners(address)};
      processCount++;
    }
    if (!addresses[address].addressDetails
      // || !addresses[address].addressDetails.addressData
      || new Date(addresses[address].addressDetails.updated) < refreshDate) {
      addresses[address].addressDetails = {updated: new Date(), addressData: await getAddressDetails(address)};
      processCount++;
    }
    if (!addresses[address].licenseDetails
      || new Date(addresses[address].licenseDetails.updated) < refreshDate) {
      addresses[address].licenseDetails = {updated: new Date(), licenseData: await getLicenses(address)};
      processCount++;
    }
    if (!addresses[address].permitDetails
      || new Date(addresses[address].permitDetails.updated) < refreshDate) {
      addresses[address].permitDetails = {updated: new Date(), permitData: await getPermits(address)};
      processCount++;
    }
    if (!addresses[address].inspectionDetails
      || new Date(addresses[address].inspectionDetails.updated) < refreshDate) {
      addresses[address].inspectionDetails = {updated: new Date(), inspectionData: await getInspections(address)};
      processCount++;
    }
    if (!addresses[address].occupancyDetails
      || new Date(addresses[address].occupancyDetails.updated) < refreshDate) {
      addresses[address].occupancyDetails = {updated: new Date(), occupancyData: await getOccupancy(address)};
      processCount++;
    }
    if (processCount > 100) break;
  };
  storeData(addresses, `./addresses-${new Date().toISOString()}.json`);
}

getData();