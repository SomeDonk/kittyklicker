var app = new Vue({
  el: '#app',
  data: {
    kittykount: 0,
    klickPower: 1,
    klickUpgradeCost: 10,
  },
  created() {
    this.getKitties();
  },
  methods: {
    async getKitties() {
      try {
        let response = await axios.get("http://cs260.jaredsw.com:4200/api/kittykount");
        this.kittykount = response.data;
        response = await axios.get("http://cs260.jaredsw.com:4200/api/klickpower");
        this.klickPower = response.data;
        response = await axios.get("http://cs260.jaredsw.com:4200/api/klickupgradecost");
        this.klickUpgradeCost = response.data;
        console.log("In getKitties, kittykount = " + this.kittykount);
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async kittyKlicked() {
      console.log("In kittyKlicked, kittykount = " + this.kittykount);
      try {
        let response = await axios.post("http://cs260.jaredsw.com:4200/api/kittykount", { klickpower: this.klickPower });
        console.log(response.data);
        this.kittykount = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async doublePower() {
      console.log("In double power");
      try {
        if (this.kittykount >= this.klickUpgradeCost) {
          this.klickPower = this.klickPower * 2;
          this.kittykount = this.kittykount - this.klickUpgradeCost;
          this.klickUpgradeCost = this.klickUpgradeCost * 10;
          let response = await axios.post("http://cs260.jaredsw.com:4200/api/doublepower", {klickpower: this.klickPower, kittykount: this.kittykount, klickupgradecost: this.klickUgradeCost});
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  }
});
