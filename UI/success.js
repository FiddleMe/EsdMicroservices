// const { json } = require("stream/consumers");

const app = Vue.createApp(
  {
    data() {
      return {
        pi: "",
        refundId: "",
        succrefund: "",
        status: ""
      };
    },

    methods: {
      handleRefund() {
        var dispRefund = document.getElementById('refund')
        if (!this.pi){
        let params = new URL(document.location).searchParams;
        let paymentId = params.get("RefundId");
        this.pi = paymentId
        }
        axios
          .post(
            "http://localhost:5100/refund",
            JSON.stringify({
              pi: this.pi,
              customerId: localStorage.getItem('email'),
            }),
            { headers: { "Content-Type": "application/json" } }
          )
          .then((response) => {
            console.log(response.data);
            this.refundId=response.data.data.refundID
            console.log(this.refundId)
            this.succrefund= "Refund requested. RefundID: "+ this.refundId
            dispRefund.classList.add('bg-success')
            dispRefund.classList.add('text-light')
          })
          .catch((error) => {
            console.log(error.message);
            this.succrefund = "Failed to create refund, it is likely that refund has already been initiated for this payment intent"
            dispRefund.classList.add('bg-danger')
            dispRefund.classList.add('text-light')
          });
      },
      checkStatus() {
        var dispStatus = document.getElementById('status')
        axios.post('http://127.0.0.1:5100/refundStatus ', JSON.stringify({RefundId: this.refundId}),{ headers: { "Content-Type": "application/json" } })
            .then(response => {
                console.log(response.data);
                this.status = response.data.data.refundStatus
                if(this.status=='succeeded'){
                  dispStatus.classList.add('bg-success')
                  dispStatus.classList.remove('bg-warning')
                  dispStatus.classList.remove('bg-danger')
                  dispStatus.classList.add('text-light')
                }
                else {
                  dispStatus.classList.add('bg-warning')
                  dispStatus.classList.add('text-light')
                }
            })
            .catch( error => {
                console.log(error.message);
            });
      },
    },
  } // methods
);
const vm = app.mount("#app");
