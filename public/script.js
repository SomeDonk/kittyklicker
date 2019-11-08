var app = new Vue({
  el: '#app',
  data: {
    kittykount: 0,
  },
  created() {
    this.getKitties();
  },
  methods: {
    async getKitties() {
      try {
        let response = await axios.get("http://localhost:4200/api/kittykount");
        this.kittykount = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async kittyKlicked() {
      try {
        let response = await axios.post("http://localhost:4200/api/kittykount", {});
        this.getKitties();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
});