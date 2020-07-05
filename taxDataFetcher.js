const fetch = require('node-fetch');
const cheerio = require('cheerio');

const parseElement = (text) => {
  return text.replace(/\t/g, '').replace(/\n/g, '').trim();
};

const getTaxData = async (ssl) => {
  console.log(`fetching tax data for ${ssl}`)
  const request = await fetch(
    'https://www.taxpayerservicecenter.com/RP_Detail.jsp?ssl=0152%20%20%20%200090',
    {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "JSESSIONID=rxYe-YR06kLKy9E6g-Ggfr5rIPaq_oG4h_auiFOH4JOPbPw0UAwy!-1632701698"
      },
      "referrer": "https://www.taxpayerservicecenter.com/RP_Search.jsp?search_type=Assessment",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": null,
      "method": "GET",
      "mode": "cors"
    });
  const result = await request.text();
  let output = {};
  let $ = cheerio.load(result);

  //Record Details
  output.neighborhood = parseElement($(`td:contains('Neighborhood:')`).siblings()[1].children[0].data);
  output.subNeighborhood = parseElement($(`td:contains('Sub-Neighborhood:')`).siblings()[3].children[0].data);
  output.useCode = parseElement($(`td:contains('Use Code:')`).siblings()[1].children[0].data);
  output.class3Exception = parseElement($(`td:contains('Class 3 Exception:')`).siblings()[3].children[0].data);
  output.taxType = parseElement($(`td:contains('Tax Type:')`).siblings()[1].children[0].data);
  output.taxClass = parseElement($(`td:contains('Tax Class:')`).siblings()[3].children[0].data);
  output.homestead = parseElement($(`td:contains('Homestead Status:')`).siblings()[1].children[0].data);
  output.assessor = parseElement($(`td:contains('Assessor:')`).siblings()[1].children[0].data);
  output.grossBuildingArea = parseElement($(`td:contains('Gross Building Area:')`).siblings()[1].children[0].data);
  output.ward = parseElement($(`td:contains('Ward:')`).siblings()[3].children[0].data);
  output.landArea = parseElement($(`td:contains('Land Area:')`).siblings()[1].children[0].data);
  output.triennialGroup = parseElement($(`td:contains('Triennial Group:')`).siblings()[3].children[0].data);
  
  //Owner and Sales Information
  output.owner = parseElement($(`td:contains('Owner Name(s):')`).siblings()[1].children[0].data);
  output.careOf = parseElement($(`td:contains('Care Of:')`).siblings()[1].children[0].data);
  output.mailingAddr = parseElement($(`td:contains('Mailing Address:')`).siblings()[1].children[0].data);
  output.salePrice = parseElement($(`td:contains('Sale Price:')`).siblings()[1].children[0].data);
  output.recordationDate = parseElement($(`td:contains('Recordation Date:')`).siblings()[1].children[0].data);
  output.instrumentNum = parseElement($(`td:contains('Instrument No.:')`).siblings()[1].children[0].data);
  output.salesCode = parseElement($(`td:contains('Sales Code:')`).siblings()[1].children[0].data);
  output.salesType = parseElement($(`td:contains('Sales Type:')`).siblings()[1].children[0].data);

  //Tax Assessment
  const curTaxDesc = $("td:contains('Current Value')")[2].children[0].children[0].data;
  output.curTaxYear = curTaxDesc.substr(curTaxDesc.indexOf('(')+1, 4);
  output.landValCur = parseElement($(`td:contains('Land:')`).siblings()[1].children[0].data);
  output.improvementValCur = parseElement($(`td:contains('Improvements:')`).siblings()[1].children[0].data);
  output.totalValCur = parseElement($(`td:contains('Total Value:')`).siblings()[1].children[0].data);
  output.taxAssessmentCur = parseElement($(`td:contains('Taxable Assessment: *')`).siblings()[1].children[0].data);

  const proposedTaxDesc = $("td:contains('Proposed New Value')")[2].children[0].children[0].data;
  output.propTaxYear = proposedTaxDesc.substr(proposedTaxDesc.indexOf('(')+1, 4);
  output.landValProp = parseElement($(`td:contains('Land:')`).siblings()[2].children[0].data);
  output.improvementValProp = parseElement($(`td:contains('Improvements:')`).siblings()[2].children[0].data);
  output.totalValProp = parseElement($(`td:contains('Total Value:')`).siblings()[2].children[0].data);
  output.taxAssessmentProp = parseElement($(`td:contains('Taxable Assessment: *')`).siblings()[2].children[0].data);

  return output;
}

module.exports.getTaxData = getTaxData;

//getTaxData('0152    0090');