const NodeHelper = require("node_helper")
const dayjs = require('dayjs')
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

module.exports = NodeHelper.create({

  async socketNotificationReceived(notification, payload) {
    if (notification === "GET_TRASH_INFO") {

      const start_date = new Date(Date.now());
      start_date.setDate(start_date.getDate() - 1);
      var end_date = new Date();
      end_date.setDate(end_date.getDate() + 30);

    const customer_data = {
      "PostCode": "2261EA",
      "Street": "",
      "HouseNumber": "31",
      "companyCode": "f7a74ad1-fdbf-4a43-9f91-44644f4d4222",
      "uniqueAddressID": "",
      "City": "",
      "Community": null,
      "startDate": start_date,
      "endDate": end_date
    }
    const requestURL_fetchAdress = "https://wasteprod2api.ximmio.com/api/FetchAdress";
  
    const customHeaders = {
        "Content-Type": "application/json",
    }
    const request_fetchAdress = new Request(requestURL_fetchAdress, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(customer_data), });
    
    const response_fetchAdress = await fetch(request_fetchAdress);
    const AdressInfo = await response_fetchAdress.json();

    const AdressDetails = AdressInfo.dataList[0];

    customer_data["uniqueAddressID"] = AdressDetails["UniqueId"];
    customer_data["Street"] = AdressDetails["Street"];
    customer_data["City"] = AdressDetails["City"];
    customer_data["Community"] = AdressDetails["Community"];

    /* return AdressInfo    
    console.log(`UniqueId: ${customer_data["uniqueAddressID"]}`);
    console.log(`Street: ${customer_data["Street"]}`);
    console.log(`City: ${customer_data["City"]}`);
    console.log(`Community: ${customer_data["Community"]}`);
    */
    const requestURL_Calendar = "https://wasteprod2api.ximmio.com/api/GetCalendar";
  
    const request_Calendar = new Request(requestURL_Calendar, {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(customer_data), });
    
    const response_Calendar = await fetch(request_Calendar);
    const CalenderInfo = await response_Calendar.json();

    const CalenderDetails = CalenderInfo.dataList;


    
      this.sendSocketNotification("EXAMPLE_NOTIFICATION", CalenderDetails)
    }
  },
})
