/*global axios Vue */
var app = new Vue({
  el: '#app',
  data: {
    showForm: false,
    user: null,
    username: '',
    password: '',
    error: '',
    kittyKount: 0,
    klickPower: 1,
    klickUpgradeCost: 10,
    loading: true,
    items: [],
    score: 0,
  },
  created() {
    this.getKitties();
    this.getUser();
  },
  methods: {
    async getKitties() {
      this.loading = true;
      try {
        let response = await axios.get("http://cs260.showardbyu.com:4200/api/klickinfo");
        if (response === null) await this.startItem();
        this.items = response.data;
        console.log(this.items);
        this.kittyKount = this.items[0].kount;
        this.klickPower = this.items[0].power;
        this.klickUpgradeCost = this.items[0].kost;

        console.log("In getKitties, kittyKount = " + this.kittyKount);
      }
      catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async startItem() {
      console.log("In startItem");
      try {
        let response = await axios.post('/api/start', {
          kount: 0,
          power: 1,
          kost: 10
        });
      }
      catch (error) {
        console.log(error);
      }

    },
    async kittyKlicked() {
      console.log("In kittyKlicked, kittyKount = " + this.kittyKount);
      try {
        let response = await axios.post("http://cs260.showardbyu.com:4200/api/kittykount/" + this.items[0]._id + "/" + this.user._id);
        console.log(response.data);
        this.kittyKount = response.data.kount;
        this.klickPower = response.data.power;
        this.klickUpgradeCost = response.data.kost;
        this.score = response.data.user_score;
      }
      catch (error) {
        console.log(error);
        this.toggleForm();
      }
    },
    async doublePower() {
      console.log("In double power");
      try {
        let response = await axios.post("http://cs260.showardbyu.com:4200/api/doublepower/" + this.items[0]._id);
        this.kittyKount = response.data.kount;
        this.klickPower = response.data.power;
        this.klickUpgradeCost = response.data.kost;
      }
      catch (error) {
        console.log(error);
      }
    },
    
    toggleForm() {
      this.error = "";
      this.username = "";
      this.password = "";
      this.showForm = !this.showForm;
    },
    async register() {
      this.error = "";
      try {
        let response = await axios.post("/api/users", {
          username: this.username,
          password: this.password
        });
        this.user = response.data;
        // close the dialog
        this.toggleForm();
      }
      catch (error) {
        this.error = error.response.data.message;
      }
    },
    async login() {
      this.error = "";
      try {
        let response = await axios.post("/api/users/login", {
          username: this.username,
          password: this.password
        });
        this.user = response.data;
        // close the dialog
        this.toggleForm();
      }
      catch (error) {
        this.error = error.response.data.message;
      }
    },
    async logout() {
      try {
        let response = await axios.delete("/api/users");
        this.user = null;
      }
      catch (error) {
        // don't worry about it
      }
    },
    async getUser() {
      try {
        let response = await axios.get("/api/users");
        this.user = response.data;
        this.score = this.user.score;
      }
      catch (error) {
        // Not logged in. That's OK!
      }
    },
    closeForm() {
      this.showForm = false;
    },
  },

});
