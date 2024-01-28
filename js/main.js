const closeBtnCart = document.querySelector(".cart-view__close-btn");
const blackout = document.querySelector(".blackout");
const cartview = document.querySelector(".cart-view");
const navCartBtn = document.querySelector(".nav__cart-btn");
const consoleList = document.querySelector(".console-list");
const cartViewCartList = document.querySelector(".cart-view__cart-list");
const cartViewCartListEmpty = document.querySelector(".cart-view__cart-list-empty");
const cartViewPrice = document.querySelector(".cart-view__price");
const promoCheckbox = document.getElementById("promo-checkbox");
const availabilityСheckbox = document.getElementById("availability-checkbox");
const navInput = document.querySelector(".nav__input input");
const navBtnSearch = document.querySelector(".nav__btn-search");
const navInputClearBtn = document.querySelector(".nav__input-clear-btn");

const priceRangeInputFrom = document.getElementById("price-range__input-from");
const priceRangeInputTo = document.getElementById("price-range__input-to");

let dataItems = [];
let consoleCart = [];
let countCart = 0;
let countCartPrice = 0;
let isPromoState = false;
let isAvailabilityState = false;

let searchItemText = "";
let priceRangeFrom = 0;
let priceRangeTo = 999990;

navInput.addEventListener("input", () => {
  searchItemText = navInput.value;
});

navCartBtn.addEventListener("click", () => {
  blackout.style.display = "block";
  cartview.style.display = "flex";
});

closeBtnCart.addEventListener("click", () => {
  blackout.style.display = "none";
  cartview.style.display = "none";
});

blackout.addEventListener("click", () => {
  blackout.style.display = "none";
  cartview.style.display = "none";
});

navInputClearBtn.addEventListener("click", () => {
  searchItemText = "";
  navInput.value = "";
  const filterArr = dataItems.filter((item) => filterData(item));
  renderData(filterArr);
});

navBtnSearch.addEventListener("click", () => {
  const filterArr = dataItems.filter((item) => filterData(item));
  renderData(filterArr);
});

promoCheckbox.addEventListener("click", () => {
  isPromoState = !isPromoState;
  const filterArr = dataItems.filter((item) => filterData(item));
  renderData(filterArr);
});

availabilityСheckbox.addEventListener("click", () => {
  isAvailabilityState = !isAvailabilityState;
  const filterArr = dataItems.filter((item) => filterData(item));
  renderData(filterArr);
});

priceRangeInputFrom.addEventListener("change", () => {
  priceRangeFrom = priceRangeInputFrom.value ? priceRangeInputFrom.value : 0;
  const filterArr = dataItems.filter((item) => filterData(item));
  renderData(filterArr);
});

priceRangeInputTo.addEventListener("change", () => {
  priceRangeTo = priceRangeInputTo.value ? priceRangeInputTo.value : 999990;
  const filterArr = dataItems.filter((item) => filterData(item));
  renderData(filterArr);
});

const getData = async () => {
  return await fetch("https://mocki.io/v1/085d2dca-28f1-4d4f-8e1c-6e319bbcdc67").then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Data not found");
    }
  });
};

const filterData = (item) => {
  if (isPromoState) {
    if (!item.sale) return false;
  }

  if (isAvailabilityState) {
    if (!item.availability) return false;
  }

  if (searchItemText != "") {
    const title = item.title.toUpperCase();
    if (!title.includes(searchItemText.toUpperCase())) return false;
  }

  if (item.price < priceRangeFrom) return false;
  if (item.price > priceRangeTo) return false;

  return true;
};

const renderData = (items) => {
  consoleList.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "console-list__card";

    card.innerHTML = `
    <div class="console-list__card-img">
        <img src="${item.img}" alt="ps4pro" />
    </div>
      <div>
        <p class="console-list__card-price">${item.price} ₽</p>
        <p class="console-list__card-title">${item.title}</p>
        <button class="console-list__card-btn blue-btn" disabled>В корзину</button>
        ${item.sale ? '<div class="hot-sale-btn">🔥Hot Sale🔥</div>' : ""}
      </div>
  `;
    item.count = 0;

    const btnClick = card.querySelector(".console-list__card-btn");
    if (item.availability) btnClick.disabled = false;
    consoleList.appendChild(card);
    btnClick.addEventListener("click", () => {
      changeCountItemsCart(item, 1);
      createOrChangeCountBadge();
    });
  });
};

const changeCountItemsCart = (item, countChange) => {
  const findItemCart = consoleCart.find((el) => {
    return el.title === item.title;
  });

  if (findItemCart) {
    item.count += countChange;
    if (item.count == 0) removeItemFromCart(item);
  } else {
    consoleCart.push(item);
    item.count = 1;
  }
};

const removeItemFromCart = (item) => {
  consoleCart = consoleCart.filter((el) => {
    return el.title !== item.title;
  });
};

const changeCartPrice = () => {
  countCartPrice = consoleCart.reduce((sum, item) => sum + item.price * item.count, 0);
  cartViewPrice.innerHTML = countCartPrice;
};

const createOrChangeCountBadge = () => {
  let badge = document.querySelector(".cart-badge");
  if (badge === null) {
    badge = document.createElement("div");
    badge.className = "cart-badge";
    navCartBtn.appendChild(badge);
  }
  countCart = consoleCart.reduce((sum, item) => sum + item.count, 0);
  if (countCart == 0) {
    badge.remove();
  } else {
    badge.innerHTML = countCart;
  }
};

getData().then((data) => {
  dataItems = data.goods;
  renderData(data.goods);
});

navCartBtn.addEventListener("click", () => {
  changeCartPrice();
  renderCartList();
});

const renderCartList = () => {
  const cards = document.querySelectorAll(".cart-view__cart-list .console-list__card");
  if (cards.length != 0) {
    cards.forEach((item) => {
      item.remove();
    });
  }

  if (consoleCart.length != 0) {
    cartViewCartListEmpty.innerHTML = "";
  } else {
    cartViewCartListEmpty.innerHTML = "Ваша корзина пока пуста";
    return;
  }

  consoleCart.forEach((item) => {
    const card = document.createElement("div");
    card.className = "console-list__card";

    card.innerHTML = `
    <div class="console-list__card-img">
        <img src="${item.img}" alt="ps4pro" />
    </div>

    <div>
    <div class="console-list__card-price-wrap">
      <p class="console-list__card-price">${item.price * item.count} ₽</p>
      <div class="console-list__card-price-counter cart-item-counter">
        <button class="cart-item-counter__minus cart-counter">
          <img src="./image/minus.png" alt="minus">
        </button>

        <input class="cart-item-counter__input" type="text" value="${item.count}">
        <button class="cart-item-counter__plus cart-counter">
          <img src="./image/plus.png" alt="plus">
        </button>
      </div>
    </div>

      <p class="console-list__card-title">${item.title}</p>
      <button class="console-list__card-btn blue-btn">Удалить из корзины</button>
      ${item.event ? '<div class="hot-sale-btn">🔥Hot Sale🔥</div>' : ""}
    </div>
  `;
    cartViewCartList.appendChild(card);

    const btnDelClick = card.querySelector(".console-list__card-btn");
    btnDelClick.addEventListener("click", () => {
      changeCountItemsCart(item, -item.count);
      changeCartPrice();
      createOrChangeCountBadge();
      renderCartList();
    });

    const counterPlusBtn = card.querySelector(".cart-item-counter__plus");
    const counterMinusBtn = card.querySelector(".cart-item-counter__minus");

    counterPlusBtn.addEventListener("click", () => {
      changeCountItemsCart(item, 1);
      changeCartPrice();
      createOrChangeCountBadge();
      renderCartList();
    });

    counterMinusBtn.addEventListener("click", () => {
      changeCountItemsCart(item, -1);
      changeCartPrice();
      createOrChangeCountBadge();
      renderCartList();
    });
  });
};
