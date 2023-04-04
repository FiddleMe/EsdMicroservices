function fly(r) {
  let id = "#" + r;
  var block = document.querySelector(id);
  const cart = document.querySelector(".shopping-cart");
  const img = block.querySelector(".item-img");
  console.log(img);

  if (img) {
    const imgClone = img.cloneNode();
    imgClone.style.opacity = "0.5";
    imgClone.style.position = "absolute";
    imgClone.style.height = "150px";
    imgClone.style.width = "150px";
    imgClone.style.zIndex = "100";
    document.body.appendChild(imgClone);

    const imgRect = img.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();
    const startX = imgRect.left + imgRect.width / 2;
    const startY = imgRect.top + imgRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;
    let x = startX;
    let y = startY;
    let width = imgRect.width;
    let height = imgRect.height;

    const intervalId = setInterval(function () {
      if (x < endX) x += 10;
      if (y < endY) y += 10;
      if (width > 75) width -= 5;
      if (height > 75) height -= 5;
      imgClone.style.left = x + "px";
      imgClone.style.top = y + "px";
      imgClone.style.width = width + "px";
      imgClone.style.height = height + "px";
      if (x >= endX && y >= endY && width <= 75 && height <= 75) {
        clearInterval(intervalId);
        document.body.removeChild(imgClone);
        cart.classList.add("shake");
        setTimeout(function () {
          cart.classList.remove("shake");
        }, 200);
      }
    }, 10);
  }
}

// <div id='app'></div>
const app = Vue.createApp(
  {
    data() {
      return {
        menu: [],
        pics: {
          Samgyetang:
            "https://media.istockphoto.com/id/157696672/photo/samgyetang.jpg?s=612x612&w=0&k=20&c=or-UOnyrtEMdj1WzDSx5KB7weYRzzFPnBlkYAJx4qdY=",
          Tteokbokki:
            "https://images.lifestyleasia.com/wp-content/uploads/sites/6/2022/12/10114925/tteokbokki-guide-korean-street-food.jpg",
          Eomuk:
            "https://futuredish.com/wp-content/uploads/2022/03/Eomuk-Tang.jpg",
          "Kimchi Jeon":
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_6UZEVHicPrwMLUiF6jx-o3WEjcaZg520GQ&usqp=CAU",
          "Bulgogi Kimbap":
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToV4srjn50TiTZP9zZqVD3ptkmod280qa8Yw&usqp=CAU",
        },
        addedToCart: [],
        qty: {},
        recommended: []
        // recoDetails: [],
        // total: 0
      };
    }, // data
    // computed: {
    //     derivedProperty() {
    //         return false;
    //     }
    // }, // computed
    created() {
      let params = new URL(document.location).searchParams;
      let email = params.get("email");
      localStorage.setItem('email',email)
      // console.log(localStorage.getItem('email'))
      // console.log(localStorage.getItem("yes"));
      // console.log(localStorage.getItem("no"));
      // console.log(localStorage.getItem('axios/placeorder'))
      axios
        .get("http://localhost:8080/api/product")
        .then((response) => {
          this.menu = response.data;
        })
        .catch((error) => {
          console.log(error.message);
        });
      axios
        .get("http://127.0.0.1:5010/analytics/top_menu_items")
        .then((response) => {
          console.log(response.data)
          this.recommended = response.data.data;
          // response.data.data.forEach((r) => {
          //   this.menu.forEach((m) => {
          //     if (r == m.name) {
          //       this.recoDetails.push(m);
          //     }
          //   });
          // });
          // console.log(this.recoDetails);
        })
        .catch((error) => {
          console.log(error.message);
        });
      if (localStorage.getItem("orders")) {
        this.qty = JSON.parse(localStorage.getItem("orders"));
        console.log(this.qty);

        for (q in this.qty) {
          for (i = this.qty[q]; i--; i > 0) {
            this.addedToCart.push(q);
          }
        }
        if (document.location.href == "http://localhost:3000/menu.html") {
          localStorage.removeItem('orders');
          this.qty = {};
        }
      }
    },
    // mounted() {
    // },
    methods: {
      handleCheckout() {
        this.continueShopping();
        var orderss = [];
        for (q in this.qty) {
          console.log(q);
          order = { product_name: q, quantity: this.qty[q] };
          orderss.push(order);
        }
        var args = {
          orderLineItemsDtoList: orderss,
          customerId: localStorage.getItem('email'),
          Mode: "eatinghere",
        };

        axios
          .post("http://localhost:5100/place_order", JSON.stringify(args), {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            // localStorage.setItem('axios/placeorder', JSON.stringify(response.data))
            var placeOrderId = response.data.data.order.orderId;
            // localStorage.setItem('axios/placeorder', placeOrderId)
            console.log(response.data.data.order.orderId);
            axios
              .post(
                "http://localhost:5100/requestInvoice",
                JSON.stringify({ orderId: placeOrderId }),
                { headers: { "Content-Type": "application/json" } }
              )
              .then((response) => {
                console.log("in axios");
                console.log(response.data);
                localStorage.removeItem('orders')
                this.qty = {}
                window.open(response.data.data.url, "_blank")
                // localStorage.setItem("yes", response.data);
                // axios
                //   .post("http://127.0.0.1:4242/create-checkout-session", {
                //     TotalPrice: this.total() * 100, // Replace with your desired total price
                //   })
                //   .then((response) => {
                //     // Handle success response
                //     console.log(response);
                //     window.location.href = response.data.url;
                //   })
                //   .catch((error) => {
                //     console.log(error);
                //     // Handle error
                //   });
              })
              .catch((error) => {
                console.log("in axios");
                console.log(error.message);
                localStorage.setItem("no", error.message);
              });
          })
          .catch((error) => {
            console.log(error.message);
          });

        // axios
        //   .post("http://127.0.0.1:4242/create-checkout-session", {
        //     TotalPrice: this.total() * 100, // Replace with your desired total price
        //   })
        //   .then((response) => {
        //     // Handle success response
        //     console.log(response)
        //     window.location.href = response.data.url;
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     // Handle error
        //   });
      },
      continueShopping() {
        for (q in this.qty) {
          console.log(q);
          if (this.qty[q] == 0) {
            delete this.qty[q];
          }
        }
        localStorage.setItem("orders", JSON.stringify(this.qty));
        // console.log(localStorage.getItem("orders"))
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
        fly("m" + x);
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
