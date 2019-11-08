var app = new Vue(
{
    el: '#app',
    data:
    {
        kittykount: 0,
    },
    created()
    {
        this.getKitties();
    },
    methods:
    {
        async getKitties()
        {
            try
            {
                let response = await axios.get("http://cs260.jaredsw.com:4200/api/kittykount");
                this.kittykount = response.data;
                console.log("In getKitties, kittykount = " + this.kittykount);
                return true;
            }
            catch (error)
            {
                console.log(error);
            }
        },
        async kittyKlicked()
        {
            console.log("In kittyKlicked, kittykount = " + this.kittykount);
            try
            {
                let response = await axios.post("http://cs260.jaredsw.com:4200/api/kittykount", {});
                console.log(response.data);
                this.kittykount = response.data;
                return true;
            }
            catch (error)
            {
                console.log(error);
            }
        },
    }
});
