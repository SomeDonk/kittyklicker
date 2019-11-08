var app = new Vue({
  el: '#app',
  data: {
    kittykount: 0,
    klickPower: 1,
    klickUgradeCost: 10,
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
        this.klickUgradeCost = response.data;
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
        if (this.kittykount >= this.klickUgradeCost) {
          this.klickPower = this.klickPower * 2;
          this.kittykount = this.kittykount - this.klickUgradeCost;
          this.klickUgradeCost = this.klickUgradeCost * 10;
          let response = await axios.post("http://cs260.jaredsw.com:4200/api/doublepower", {klickpower: this.klickPower, kittykount: this.kittykount, klickupgradecost: this.klickUgradeCost});
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  }
});
