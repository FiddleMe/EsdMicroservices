function fly(){
        console.log("hello")
      const cart = document.querySelector('.shopping-cart');
      const img = this.parentNode.parentNode.querySelector('.item img');
      console.log(img)
  
      if (img) {
        const imgClone = img.cloneNode();
        imgClone.style.opacity = '0.5';
        imgClone.style.position = 'absolute';
        imgClone.style.height = '150px';
        imgClone.style.width = '150px';
        imgClone.style.zIndex = '100';
        document.body.appendChild(imgClone);
  
        const imgRect = img.getBoundingClientRect();
        const cartRect = cart.getBoundingClientRect();
        const startX = imgRect.left + (imgRect.width / 2);
        const startY = imgRect.top + (imgRect.height / 2);
        const endX = cartRect.left + (cartRect.width / 2);
        const endY = cartRect.top + (cartRect.height / 2);
        let x = startX;
        let y = startY;
        let width = imgRect.width;
        let height = imgRect.height;
  
        const intervalId = setInterval(function() {
          if (x < endX) x += 10;
          if (y < endY) y += 10;
          if (width > 75) width -= 5;
          if (height > 75) height -= 5;
          imgClone.style.left = x + 'px';
          imgClone.style.top = y + 'px';
          imgClone.style.width = width + 'px';
          imgClone.style.height = height + 'px';
          if (x >= endX && y >= endY && width <= 75 && height <= 75) {
            clearInterval(intervalId);
            document.body.removeChild(imgClone);
            cart.classList.add('shake');
            setTimeout(function() {
              cart.classList.remove('shake');
            }, 200);
          }
        }, 10);
      }
    }
  
// <div id='app'></div>
const app = Vue.createApp({ 
    data() { 
        return { 
            menu: [],
            pics: {'Samgyetang':"https://media.istockphoto.com/id/157696672/photo/samgyetang.jpg?s=612x612&w=0&k=20&c=or-UOnyrtEMdj1WzDSx5KB7weYRzzFPnBlkYAJx4qdY=",
            "Tteokbokki":"https://images.lifestyleasia.com/wp-content/uploads/sites/6/2022/12/10114925/tteokbokki-guide-korean-street-food.jpg",
            "Eomuk": "https://futuredish.com/wp-content/uploads/2022/03/Eomuk-Tang.jpg",
            "Kimchi Jeon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_6UZEVHicPrwMLUiF6jx-o3WEjcaZg520GQ&usqp=CAU",
            "Bulgogi Kimbap": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToV4srjn50TiTZP9zZqVD3ptkmod280qa8Yw&usqp=CAU"},
            addedToCart: [],
            qty: {},
            recommended: []
            // total: 0
        };
    }, // data
    // computed: { 
    //     derivedProperty() {
    //         return false;
    //     }  
    // }, // computed
    created() { 
        axios.get('http://127.0.0.1:8080/api/product')
            .then(response => {
                this.menu= response.data;
                console.log(this.menu)
            })
            .catch( error => {
                console.log(error.message);
            });
        axios.get('http://127.0.0.1:5010/analytics/top_menu_items')
            .then(response => {
                this.recommended = 
                console.log(this.menu)
            })
            .catch( error => {
                console.log(error.message);
            });
        if (localStorage.getItem('orders')){
            this.qty = JSON.parse(localStorage.getItem('orders'))
            // console.log(this.qty)
            // localStorage.clear()
            for(q in this.qty){
                console.log(this.qty[q])
                for(i=this.qty[q];i--;i>0){
                    console.log("hello")
                    this.addedToCart.push(q)
                    // console.log(this.qty)
                }
            }; 
            if(document.location.href=="http://127.0.0.1:5500/UI/menu.html"){
                localStorage.clear()
                this.qty={}
            }
        }
    },
    // mounted() { 
    // },
    methods: {

        updateQty(){
            this.addedToCart.forEach(c => {
                if (!this.qty[c]){
                    this.qty[c]=0
                }
                this.qty[c] += 1
                localStorage.setItem('orders',JSON.stringify(this.qty))
                // console.log(localStorage.getItem('orders'))
            });
        },
        addToCart(x){
            this.addedToCart.push(x)
            // console.log(this.addedToCart)
            // localStorage.setItem('orders',JSON.stringify(this.qty))
        },
        getPrice(o){
            for (m of this.menu){
                if (m.name==o){
                    return m.price
                }
            }
        },
        total(){
            total = 0
            for (x in this.qty){
                // console.log(x)
                total+= this.getPrice(x)*this.qty[x]
            }
            return total
        }
        }
    } // methods
);
const vm = app.mount('#app'); 