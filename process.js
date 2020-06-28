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

async function getOwners(address) {
  console.log('fetching owner data for:', address);
  var post = await fetch('https://scout.dcra.dc.gov/api/Results/Owners', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJraWQiOiJNZmk0dmlpNW5iRmI0YnBscmY0dTFlNktDYXh3aDVIbk1rOFlhbkZhYThVIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULlpJZ0JPLWYydWMydjdHTWctS0VZSFJadmJwVE9HR2lkZW1ielVDOFdQZVEiLCJpc3MiOiJodHRwczovL2FjY2Vzc2RjLmRjcmEuZGMuZ292L29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTU5MzM2MTAyNSwiZXhwIjoxNTkzMzY4MjI1LCJjaWQiOiIwb2FsYXA4Y1FudElzMGIxTjRoNSIsInVpZCI6IjAwdTFtOWs3cURVM3FHZ0tGNGg2Iiwic2NwIjpbIm9wZW5pZCJdLCJzdWIiOiJkd29sZmFuZCtkY3JhQGdtYWlsLmNvbSJ9.GD89TEItveCCWzCnb4r1tvfQeDRxx9n7n0EtotGVk5thbVLQFwaBSTr7N32XiW9T40-pgd1gSYTiXH5TvcWeJcXQHXFupILieXjrGLXq4TbraP3uff3pZ36LVpwVf2KLTsFIxj7ANR-pTIJq_5vXoSER9LcdfKJ5ihYkcgpRJ6xDizv7D_ooweWFmuCqNmr8nEjiWr4L3zKyT3rLv5HIV5_Sz-pOWiQK62Gg6XETq__I45AOyjjXbOPi4DEo4mRB4yR221yGN71MV9Vw-Zi9Y-7peu92mWwdRirrUHQD9NJMa4_nZGlDhAh6YO6iqFQEjYdpdtqW7UiDxQhv1NPHCw',
    },
    body: JSON.stringify({ "searchType": "address", "sslOrAddress": address }),
  });
  response = await post.json();
  return response.Result.DATA;
};

async function getData(){
  for (address in addresses) {
    if (!addresses[address].ownerInfo || new Date(addresses[address].ownerInfo.updated) < new Date('2020-06-27')) {
      addresses[address].ownerInfo = {updated: new Date(), ownerData: await getOwners(address)};
    }
  };
  storeData(addresses, `./addresses-${new Date().toISOString()}.json`);
}

getData();