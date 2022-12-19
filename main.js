// CLOSE AND OPEN CART
let closeCart = document.querySelector(".close-cart");
let openCart = document.querySelector(".fa-shopping-cart");
let cart = document.querySelector(".cart");

closeCart.onclick = () => {
  cart.classList.add("active");
};
openCart.onclick = () => {
  cart.classList.remove("active");
};

// DOM loading
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

function start() {
  addEvents();
  updateTotal();
}
function addEvents() {
  // removeItemsEvent
  let remove_items = document.querySelectorAll(".fa-trash");
  for (let i = 0; i < remove_items.length; i++) {
    let Button = remove_items[i];
    Button.addEventListener("click", handle_removeCartItem);
  }
  //  quantity change
  let quantityInputs = document.querySelectorAll(".quantity");
  for (let i = 0; i < quantityInputs.length; i++) {
    let quantity = quantityInputs[i];
    quantity.addEventListener("change", changeQuantity);
  }
  //  addCartEvent
  let addCart = document.getElementsByClassName("fa-cart-plus");
  for (let i = 0; i < addCart.length; i++) {
    let Button = addCart[i];
    Button.addEventListener("click", addToCart);
  }
}
function handle_removeCartItem(event) {
  // let buttonClicked = event.target;
  event.target.parentElement.parentElement.remove();
  updateTotal();
}
// updateTotal

function updateTotal() {
  let itemRows = document.getElementsByClassName("item-row");
  let total = 0;
  for (let i = 0; i < itemRows.length; i++) {
    let item_Rows = itemRows[i];
    let priceElement = item_Rows.getElementsByClassName("product-price")[0];
    let quantityElement = item_Rows.getElementsByClassName("quantity")[0];
    console.log(quantityElement);
    let price = parseFloat(priceElement.innerText.replace("€", ""));
    let quantity = quantityElement.value;
    total += price * quantity;
  }
  total = total.toFixed(2);
  document.getElementById("total-price").innerText = "€" + total;
}
function changeQuantity(e) {
  if (isNaN(e.target.value) || e.target.value < 1) {
    e.target.value = 1;
  }
  updateTotal();
}
// add items to cart
let itemAdded = [];
function addToCart(event) {
  let title =
    event.target.parentElement.getElementsByClassName("title")[0].innerText;
  let price =
    event.target.parentElement.getElementsByClassName("price")[0].innerText;

  let picture =
    event.target.parentElement.getElementsByClassName("item_picture")[0].src;

  const product = cart.querySelector(".products-contents");

  let shopBox = addProductsToCart(title, price, picture);

  let newToAdd = { title, price, picture };
  if (itemAdded.find((el) => el.title == newToAdd.title)) {
    alert("product has already exist");
    return;
  } else {
    itemAdded.push(newToAdd);
  }

  let div = document.createElement("div");

  div.classList.add("item-row");
  div.innerHTML = addProductsToCart(title, price, picture);
  product.appendChild(div);

  let remove_items = product.querySelectorAll(".fa-trash");
  for (let i = 0; i < remove_items.length; i++) {
    let Button = remove_items[i];
    Button.addEventListener("click", handle_removeCartItem);
  }
  let quantityInputs = product.querySelectorAll(".quantity");
  for (let i = 0; i < quantityInputs.length; i++) {
    let quantity = quantityInputs[i];
    quantity.addEventListener("change", changeQuantity);
  }
  updateTotal();
}
function addProductsToCart(title, price, picture) {
  return `
  <img
   src=${picture}
    alt=""
    class="ite"
  />
  <div class="column2">
    <h2 class="product-name">${title}</h2>
    <h3 class="product-price">${price}</h3>
    <input type="number" value="1" class="quantity" />
    <spam>of quantity</spam>
  </div>
<div class="column3">
  <i class="fa fa-trash"></i>
</div>

`;
}
