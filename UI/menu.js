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
            addedToCart: ["Samgyetang",2,3],
            qty: {}
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
    },
    // mounted() { 
    // },
    methods: {

        updateQty(){
            this.addedToCart.forEach(c => {
                this.qty[c] = 1
                // console.log(this.qty)
            });
        }

        

        }
    } // methods
);
const vm = app.mount('#app'); 