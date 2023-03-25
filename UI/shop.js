let products = [
  {
    //id is set by stripe (API ID)
    id: "price_1Mp5cGLMDbRFX4apTEOuwPxV",
    name: "Samgyetang",
    image:
      "https://media.istockphoto.com/id/157696672/photo/samgyetang.jpg?s=612x612&w=0&k=20&c=or-UOnyrtEMdj1WzDSx5KB7weYRzzFPnBlkYAJx4qdY=",
    price: 8,
  },
  {
    id: "price_1Mp6eyLMDbRFX4apPIoes8fr",
    name: "Tteokbokki",
    image:
      "https://images.lifestyleasia.com/wp-content/uploads/sites/6/2022/12/10114925/tteokbokki-guide-korean-street-food.jpg",
    price: 5,
  },
  {
    id: "price_1MpCw3LMDbRFX4apeXYxSJEO",
    name: "Eomuk",
    image: "https://futuredish.com/wp-content/uploads/2022/03/Eomuk-Tang.jpg",
    price: 6,
  },
  {
    id: "price_1MpCxZLMDbRFX4ap19ayirR3",
    name: "Kimchi Jeon",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_6UZEVHicPrwMLUiF6jx-o3WEjcaZg520GQ&usqp=CAU",
    price: 4,
  },
  {
    id: "price_1MpCyQLMDbRFX4apcoZTd5jd",
    name: "Bulgogi Kimbap",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToV4srjn50TiTZP9zZqVD3ptkmod280qa8Yw&usqp=CAU",
    price: 8,
  },
];

document.getElementById("list").innerHTML = products
  .map((product) => {
    var { name, image, price } = product;
    return `

<div class="shop-item">
<div class="shop-image-box">
<img class="shop-item-image" src=${image}>
</div>
<span class="shop-item-title">${name}</span>
<div class="shop-item-price">$${price}</div>
<div class="shop-item-details">
    <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
</div>
</div
</div>`;
  })
  .join("");

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  var removeCartItemButtons = document.getElementsByClassName("btn-danger");
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  var addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }
}


function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.parentElement.remove();
  updateCartTotal();
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function addToCartClicked(event) {
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
  var cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("This item is already added to the cart");
      return;
    }
  }
  var cartRowContents = `
  <div class="row cart-item-row">
        <div class="cart-item col-md-4">
            <div class="cart-image-box">
            <img class="cart-item-image" src="${imageSrc}">
            </div>
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price col-md-3">${price}</span>
        <div class="cart-quantity col-md-2">
            <input class="cart-quantity-input" type="number" value="1">
        </div>
        <div class="col remove-item-button">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>
        </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-item-row");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$" + total;
}
