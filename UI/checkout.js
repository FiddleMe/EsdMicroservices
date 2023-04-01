const cardDrop = document.getElementById('card-dropdown');
let activeDropdown;
cardDrop.addEventListener('click',function(){
  var node;
  for (var i = 0; i < this.childNodes.length-1; i++)
    node = this.childNodes[i];
    if (node.className === 'dropdown-select') {
      node.classList.add('visible');
       activeDropdown = node; 
    };
})

window.onclick = function(e) {
  // console.log(e.target.tagName)
  // console.log('dropdown');
  // console.log(activeDropdown)
  if (e.target.tagName === 'LI' && activeDropdown){
    if (e.target.innerHTML === 'Master Card') {
      document.getElementById('credit-card-image').src = 'https://dl.dropboxusercontent.com/s/2vbqk5lcpi7hjoc/MasterCard_Logo.svg.png';
          activeDropdown.classList.remove('visible');
      activeDropdown = null;
      e.target.innerHTML = document.getElementById('current-card').innerHTML;
      document.getElementById('current-card').innerHTML = 'Master Card';
    }
    else if (e.target.innerHTML === 'American Express') {
         document.getElementById('credit-card-image').src = 'https://dl.dropboxusercontent.com/s/f5hyn6u05ktql8d/amex-icon-6902.png';
          activeDropdown.classList.remove('visible');
      activeDropdown = null;
      e.target.innerHTML = document.getElementById('current-card').innerHTML;
      document.getElementById('current-card').innerHTML = 'American Express';      
    }
    else if (e.target.innerHTML === 'Visa') {
         document.getElementById('credit-card-image').src = 'https://dl.dropboxusercontent.com/s/ubamyu6mzov5c80/visa_logo%20%281%29.png';
          activeDropdown.classList.remove('visible');
      activeDropdown = null;
      e.target.innerHTML = document.getElementById('current-card').innerHTML;
      document.getElementById('current-card').innerHTML = 'Visa';
    }
  }
  else if (e.target.className !== 'dropdown-btn' && activeDropdown) {
    activeDropdown.classList.remove('visible');
    activeDropdown = null;
  }
}

const app = Vue.createApp({ 
    data() { 
        return { 
            food: {},
            qty: {},
            menu: [],
            addedToCart: [],
            pics: {'Samgyetang':"https://media.istockphoto.com/id/157696672/photo/samgyetang.jpg?s=612x612&w=0&k=20&c=or-UOnyrtEMdj1WzDSx5KB7weYRzzFPnBlkYAJx4qdY=",
            "Tteokbokki":"https://images.lifestyleasia.com/wp-content/uploads/sites/6/2022/12/10114925/tteokbokki-guide-korean-street-food.jpg",
            "Eomuk": "https://futuredish.com/wp-content/uploads/2022/03/Eomuk-Tang.jpg",
            "Kimchi Jeon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_6UZEVHicPrwMLUiF6jx-o3WEjcaZg520GQ&usqp=CAU",
            "Bulgogi Kimbap": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToV4srjn50TiTZP9zZqVD3ptkmod280qa8Yw&usqp=CAU"},
        };
    }, // data
    created() {
      axios.get('http://localhost:8080/api/product')
          .then(response => {
              this.menu= response.data;
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
    methods: {
      createCheckoutSession() {
        axios.post('http://localhost:4242/create-checkout-session', {
          TotalPrice: 100 // Replace with your desired total price
        })
          .then(response => {
            localStorage.removeItem("orders")
          })
          .catch(error => {
            console.log(error);
            // Handle error
          });
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
});
const vm =  app.mount('#app'); 