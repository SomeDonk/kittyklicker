/*global axios Vue */
var app = new Vue({
    el: '#leader',
    data: {
        users: [],
        rankedUsers: [],
        loading: true,
    },
    created() {
        this.getInfo();
    },
    methods: {
        async getInfo() {
            this.loading = true;
            try {
                let response = await axios.get("http://cs260.showardbyu.com:4200/api/users/all");
                this.users = response.data;

                this.users.sort(function(a, b) {
                    return parseInt(b.score) - parseInt(a.score);
                });
                
                for (let i = 0; i < this.users.length; i++) {
                    this.users[i].rank = i+1;
                }
            }
            catch (error) {
                console.log(error);
            }
            this.loading = false;
        },
    }
});
