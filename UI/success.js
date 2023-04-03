const app = Vue.createApp({

    methods: {
      handleRefund() {
        let params = new URL(document.location).searchParams;
        let paymentId = params.get("RefundId");
        console.log(paymentId)

        axios.get('http://localhost:5100/refund', {
            params: {
                pi:  paymentId
            }
        }, { headers: { "Content-Type": "application/json" } })
            .then(response => {
                console.log(response.data);
            })
            .catch( error => {
                console.log(error.message);
            });

        // axios.get('http://localhost:5100/refund', JSON.stringify({pi: paymentId}), { headers: { "Content-Type": "application/json" } })
        //     .then(response => {
        //         console.log(response.data);
        //     })
        //     .catch( error => {
        //         console.log(error.message);
        //     });

        // axios
        //   .post("http://localhost:5100/refund", JSON.stringify({pi: paymentId}), { headers: { "Content-Type": "application/json" } })
        //   .then((response) => {
        //     // Handle success response
        //     // window.location.href = "http://localhost:3000/refund";
        //     console.log(response.data)
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     // Handle error
        //   });
      },
      updateQty() {
        this.addedToCart.forEach((c) => {
          if (!this.qty[c]) {
            this.qty[c] = 0;
          }
          this.qty[c] += 1;
          localStorage.setItem("orders", JSON.stringify(this.qty));
          // console.log(localStorage.getItem('orders'))
        });
      },
      addToCart(x) {
        this.addedToCart.push(x);
        // console.log(this.addedToCart)
        // localStorage.setItem('orders',JSON.stringify(this.qty))
      },
      getPrice(o) {
        for (m of this.menu) {
          if (m.name == o) {
            return m.price;
          }
        }
      },
      total() {
        total = 0;
        for (x in this.qty) {
          // console.log(x)
          total += this.getPrice(x) * this.qty[x];
        }
        return total;
      },
    },
  } // methods
);
const vm = app.mount("#app");
