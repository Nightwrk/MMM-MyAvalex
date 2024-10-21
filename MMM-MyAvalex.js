/* TO DO
Order properly by Date

/* Sort the dates 
   const returnDates = Object.fromEntries(
   Object.entries(sortable).sort(([,a],[,b]) => a-b)
   ); */

Module.register("MMM-MyAvalex", {

  defaults: {
    title: "My Avalex",
    exampleContent: "",
    dateFormat: "MMM Do",
    updateInterval:  6 * 60 * 60 * 1000, // Defaults to 4  hours = 4 * 60 * 60 * 1000
  },

  getHeader() {
    return this.config.title;
  },

  /**
   * Apply the default styles.
   */
  getStyles() {
    return ["myavalex.css"]
  },

  	// Define required scripts.
	getScripts () {
		return [ "moment.js"];
	},

  /**
   * Pseudo-constructor for our module. Initialize stuff here.
   */
  start() {
    this.templateContent = this.config.exampleContent
    this.loaded = false;
    this.trashInfo = "";
    this.getTrashDates();
    this.scheduleUpdate();
    Log.info(`[MyAvalex] Update scheduled in ${this.config.updateInterval}`)

  },

  // Schedule the update interval and update
  scheduleUpdate(delay) {
    let nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    const self = this;
    setInterval(() => {
      self.getTrashDates();
    }, nextLoad);
  },

  
  getTrashDates() {
    this.sendSocketNotification("GET_TRASH_INFO")
  },

  /**
   * Handle notifications received by the node helper.
   * So we can communicate between the node helper and the module.
   *
   * @param {string} notification - The notification identifier.
   * @param {any} payload - The payload data`returned by the node helper.
   */
  socketNotificationReceived: function (notification, payload) {
    if (notification === "EXAMPLE_NOTIFICATION") {

      this.loaded = true;
      this.trashInfo = payload;
      this.updateDom()
    }
  },

  /**
   * Render the page we're on.
   */
  getDom() {
    
    const wrapper = document.createElement("div")
        
    if (this.loaded === false) {
      wrapper.innerHTML = this.translate("Loading...");
      wrapper.className = "dimmed light small";
      return wrapper;
    } else { 
      wrapper.className = "bindates";

      const today = moment().startOf("day");
      const tomorrow = moment(today).add(1, "days");
     
      const dateTable = document.createElement("table");

      for (const detail of this.trashInfo) {
        const dateRow = document.createElement("tr")
        const imageCell= document.createElement("td")
        imageCell.className = "img";
        const myImage = new Image();
        myImage.src = this.file(`${detail["_pickupTypeText"]}.png`);
        imageCell.appendChild(myImage);
        dateRow.appendChild(imageCell);
       
        const dateCell = document.createElement("td");   
        const pickupDate = moment(detail["pickupDates"][0]);

       if (today.isSame(pickupDate)) {
        dateCell.className = "today";
        dateCell.innerHTML = "Today";
        } else if(moment(today).add(1, "days").isSame(pickupDate)) {
          dateCell.className = "tomorrow";
          dateCell.innerHTML =  "Tomorrow";
        } else {
          dateCell.className = "bin-date";
          dateCell.innerHTML =  moment(pickupDate).format(this.config.dateFormat);
        }
        dateRow.appendChild(dateCell);
        dateTable.appendChild(dateRow);
    }
      
      wrapper.appendChild(dateTable);
      return wrapper
    }
 
  },

  /**
   * This is the place to receive notifications from other modules or the system.
   *
   * @param {string} notification The notification ID, it is preferred that it prefixes your module name
   * @param {number} payload the payload type.
   */
  notificationReceived(notification, payload) {
    if (notification === "TEMPLATE_RANDOM_TEXT") {
      this.templateContent = `${this.config.exampleContent} ${payload}`
      this.updateDom()
    }
  }
})
