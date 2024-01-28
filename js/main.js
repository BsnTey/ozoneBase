const closeBtnCart = document.querySelector(".cart-view__close-btn");
const blackout = document.querySelector(".blackout");
const cartview = document.querySelector(".cart-view");
const navCartBtn = document.querySelector(".nav__cart-btn");
const consoleList = document.querySelector(".console-list");
const cartViewCartList = document.querySelector(".cart-view__cart-list");
const cartViewCartListEmpty = document.querySelector(".cart-view__cart-list-empty");
const cartViewPrice = document.querySelector(".cart-view__price");

const cartItemCounterMinus = document.querySelector(".cart-item-counter-minus");

let consoleCart = [];
let countCart = 0;
let countCartPrice = 0;

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

const getData = async () => {
  return await fetch("https://mocki.io/v1/085d2dca-28f1-4d4f-8e1c-6e319bbcdc67").then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Data not found");
    }
  });
};

const renderData = (items) => {
  items.goods.forEach((item) => {
    const card = document.createElement("div");
    card.className = "console-list__card";

    card.innerHTML = `
    <div class="console-list__card-img">
        <img src="${item.img}" alt="ps4pro" />
    </div>
      <div>
        <p class="console-list__card-price">${item.price} ₽</p>
        <p class="console-list__card-title">${item.title}</p>
        <button class="console-list__card-btn blue-btn">В корзину</button>
        ${item.availability ? '<div class="hot-sale-btn">🔥Hot Sale🔥</div>' : ""}
      </div>
  `;
    item.count = 0;
    consoleList.appendChild(card);

    const btnClick = card.querySelector(".console-list__card-btn");

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
  renderData(data);
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
