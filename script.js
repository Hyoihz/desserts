fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
        dessertsData = data;

        for (let i = 0; i < data.length; i++) {
            const formattedPrice = data[i].price.toFixed(2);

            const dessertCardTemplate = `
                <div class="dessert__card">
                    <div class="dessert__top-group">
                        <picture class="dessert__img-wrapper">
                            <source media="(min-width: 1024px)" srcset="${data[i].image.desktop}">
                            <source media="(min-width: 768px)" srcset="${data[i].image.tablet}">
                            <img
                                src="${dessertsData[i].image.mobile}"
                                alt="waffle with berries"
                                class="dessert__img"
                            />
                        </picture>
                        <button
                            class="dessert__cart-default"
                        >
                            <img
                                src="./assets/images/icon-add-to-cart.svg"
                                alt="add to cart icon"
                            />Add to Cart
                        </button>
                        <div class="dessert__cart-selected">
                            <button
                                class="dessert__cart-decrement"
                            >
                                <img
                                    src="./assets/images/icon-decrement-quantity.svg"
                                    alt="decrement icon"
                                />
                            </button>
                            <p class="dessert__cart-quantity">
                                1
                            </p>
                            <button
                                class="dessert__cart-increment"
                            >
                                <img
                                    src="./assets/images/icon-increment-quantity.svg"
                                    alt="increment icon"
                                />
                            </button>
                        </div>
                    </div>
                    <div class="dessert__bottom-group">
                        <p
                            class="dessert__category"
                        >
                            ${data[i].category}
                        </p>
                        <p class="dessert__name">
                            ${data[i].name}
                        </p>
                        <p
                            class="dessert__price"
                        >
                            $${formattedPrice}
                        </p>
                    </div>
                </div>
            `;

            document.querySelector(".dessert__cards").innerHTML +=
                dessertCardTemplate;
        }

        const defaultDessertCarts = document.querySelectorAll(
            ".dessert__cart-default"
        );

        const decrementDessertCarts = document.querySelectorAll(
            ".dessert__cart-decrement"
        );

        const incrementDessertCarts = document.querySelectorAll(
            ".dessert__cart-increment"
        );

        const yourCartConfirm = document.querySelector(".your-cart__confirm");
        const confirmedNewOrder = document.querySelector(
            ".order-confirmed__new-order"
        );

        defaultDessertCarts.forEach((btn) => {
            btn.addEventListener("click", () => {
                const dessertWrapperElem = btn.closest(".dessert__card");

                const dessertName = dessertWrapperElem
                    .querySelector(".dessert__bottom-group .dessert__name")
                    .textContent.trim();
                const dessertCost = dessertWrapperElem
                    .querySelector(".dessert__bottom-group .dessert__price")
                    .textContent.trim();

                const cartEmptyElem =
                    document.querySelector(".your-cart__empty");
                const cartNotEmptyElem = document.querySelector(
                    ".your-cart__not-empty"
                );

                const formattedPrice = dessertCost.replace("$", "");

                addedToCart[dessertName] = {
                    quantity: 0,
                    price: 0,
                    totalCost: 0,
                };

                addedToCart[dessertName].quantity += 1;
                addedToCart[dessertName].price = formattedPrice;
                addedToCart[dessertName].totalCost +=
                    parseFloat(formattedPrice);

                cartEmptyElem.classList.add("hidden");
                cartNotEmptyElem.classList.add("block");

                toggleDessertState(dessertName, "add");
                updateCartState();

                console.table(addedToCart);
            });
        });

        decrementDessertCarts.forEach((btn) => {
            btn.addEventListener("click", () => {
                const dessertWrapperElem = btn.closest(".dessert__card");

                const dessertQuantityElem = dessertWrapperElem.querySelector(
                    ".dessert__top-group .dessert__cart-quantity"
                );
                const dessertName = dessertWrapperElem
                    .querySelector(".dessert__bottom-group .dessert__name")
                    .textContent.trim();
                const dessertCost = dessertWrapperElem
                    .querySelector(".dessert__bottom-group .dessert__price")
                    .textContent.trim();

                const formattedPrice = dessertCost.replace("$", "");

                let dessertQuantity = parseInt(
                    dessertQuantityElem.textContent.trim()
                );

                console.log("quantity outside", dessertQuantity);
                if (dessertQuantity === 1) {
                    toggleCartVisibility();
                    toggleDessertState(dessertName, "remove");

                    delete addedToCart[dessertName];
                } else {
                    dessertQuantity--;
                    dessertQuantityElem.textContent = dessertQuantity;

                    addedToCart[dessertName].quantity -= 1;
                    addedToCart[dessertName].price = formattedPrice;
                    addedToCart[dessertName].totalCost -=
                        parseFloat(formattedPrice);
                }

                updateCartState();

                console.table(addedToCart);
            });
        });

        incrementDessertCarts.forEach((btn) => {
            btn.addEventListener("click", () => {
                const dessertWrapper = btn.closest(".dessert__card");

                const dessertQuantityElem = dessertWrapper.querySelector(
                    ".dessert__top-group .dessert__cart-quantity"
                );
                const dessertName = dessertWrapper
                    .querySelector(".dessert__bottom-group .dessert__name")
                    .textContent.trim();
                const dessertCost = dessertWrapper
                    .querySelector(".dessert__bottom-group .dessert__price")
                    .textContent.trim();

                const formattedPrice = dessertCost.trim().replace("$", "");

                let dessertQuantity = parseInt(
                    dessertQuantityElem.textContent.trim()
                );

                dessertQuantity++;
                dessertQuantityElem.textContent = dessertQuantity;

                addedToCart[dessertName].quantity += 1;
                addedToCart[dessertName].price = formattedPrice;
                addedToCart[dessertName].totalCost +=
                    parseFloat(formattedPrice);

                updateCartState();

                console.table(addedToCart);
            });
        });

        yourCartConfirm.addEventListener("click", () => {
            populateConfirmedOrder();

            document.body.classList.add("disable-scroll");
            document.querySelector(".order-confirmed").classList.add("block");
            document
                .querySelector(".order-confirmed__overlay")
                .scrollIntoView();
        });

        confirmedNewOrder.addEventListener("click", () => {
            document.body.classList.remove("disable-scroll");
            document
                .querySelector(".order-confirmed")
                .classList.remove("block");

            Object.keys(addedToCart).forEach((key) => {
                toggleDessertState(key, "remove");
                resetQuantityState(key);
            });

            addedToCart = {};

            toggleCartVisibility();
            updateCartTotals();
        });
    });

const getDessertElem = (text) => {
    const dessertCards = document.querySelectorAll(".dessert__name");

    return Array.from(dessertCards).find(
        (elem) => elem.textContent.trim() === text
    );
};

const getTotalQuantity = () => {
    return Object.values(addedToCart).reduce(
        (sum, item) => sum + item.quantity,
        0
    );
};

const getTotalCost = () => {
    return Object.values(addedToCart).reduce(
        (sum, item) => sum + item.totalCost,
        0
    );
};

const toggleDessertState = (dessertName, action) => {
    const dessertElem = getDessertElem(dessertName);
    const dessertWrapperElem = dessertElem.closest(".dessert__card");

    const dessertImgElem = dessertWrapperElem.querySelector(
        ".dessert__top-group .dessert__img"
    );
    const cartDefaultElem = dessertWrapperElem.querySelector(
        ".dessert__top-group .dessert__cart-default"
    );
    const cartSelectedElem = dessertWrapperElem.querySelector(
        ".dessert__top-group .dessert__cart-selected"
    );

    if (action === "add") {
        dessertImgElem.classList.add("dessert__img--selected");
        cartDefaultElem.classList.add("hidden");
        cartSelectedElem.classList.add("flex");
    } else if (action === "remove") {
        dessertImgElem.classList.remove("dessert__img--selected");
        cartDefaultElem.classList.remove("hidden");
        cartSelectedElem.classList.remove("flex");
    }
};

const toggleCartVisibility = () => {
    console.log(getTotalQuantity());

    if (getTotalQuantity() <= 1) {
        const cartEmptyElem = document.querySelector(".your-cart__empty");
        const cartNotEmptyElem = document.querySelector(
            ".your-cart__not-empty"
        );

        cartEmptyElem.classList.remove("hidden");
        cartNotEmptyElem.classList.remove("block");
    }
};

const resetQuantityState = (dessertName) => {
    const dessertElem = getDessertElem(dessertName);
    const dessertWrapperElem = dessertElem.closest(".dessert__card");

    const dessertQuantityElem = dessertWrapperElem.querySelector(
        ".dessert__top-group .dessert__cart-quantity"
    );

    dessertQuantityElem.textContent = 1;
};

const updateCartTotals = () => {
    const cartQuantityElem = document.querySelector(".your-cart__quantity");
    const cartTotalCostElem = document.querySelector(".your-cart__total-cost");

    const totalQuantity = getTotalQuantity();
    const totalCost = getTotalCost();

    cartQuantityElem.textContent = totalQuantity;
    cartTotalCostElem.textContent = `$${totalCost.toFixed(2)}`;
};

const updateCartState = () => {
    let cartMarkup = "";

    Object.keys(addedToCart).forEach((key) => {
        const cartOrderTemplate = `
            <div class="your-cart__order-wrapper">
                <div class="your-cart-order-content">
                    <p class="your-cart__order-name">${key}</p>
                    <div class="your-cart__order-details">
                        <p class="your-cart__order-quantity">${
                            addedToCart[key].quantity
                        }x</p>
                        <p class="your-cart__order-price">@ $${
                            addedToCart[key].price
                        }</p>
                        <p class="your-cart__order-total">$${addedToCart[
                            key
                        ].totalCost.toFixed(2)}</p>
                    </div>
                </div>
                <button class="your-cart__order-remove">
                    <img src="./assets/images/icon-remove-item.svg" alt="" />
                </button>
            </div>
        `;

        cartMarkup += cartOrderTemplate;
    });

    document.querySelector(".your-cart__order").innerHTML = cartMarkup;

    updateCartTotals();
    cartOrderRemoveHandler();
};

const cartOrderRemoveHandler = () => {
    const cartRemoveOrders = document.querySelectorAll(
        ".your-cart__order-remove"
    );

    cartRemoveOrders.forEach((btn) => {
        btn.addEventListener("click", () => {
            const orderName =
                btn.previousElementSibling.firstElementChild.textContent;

            toggleCartVisibility();

            delete addedToCart[orderName];

            resetQuantityState(orderName);
            toggleDessertState(orderName, "remove");
            updateCartState();

            console.table(addedToCart);
        });
    });
};

const populateConfirmedOrder = () => {
    let orderMarkup = "";

    Object.keys(addedToCart).forEach((key) => {
        const matchedDessert = dessertsData.find((item) => item.name === key);
        const dessertThumbnail = matchedDessert.image.thumbnail;

        confirmedOrderTemplate = `
            <div class="order-confirmed__order">
                <div
                    class="order-confirmed__left"
                >
                    <div
                        class="order-confirmed__img-wrapper"
                    >
                        <img
                            src="${dessertThumbnail}"
                            alt="product thumbnail"
                            class="order-confirmed__img"
                        />
                    </div>
                    <div
                        class="order-confirmed__content"
                    >
                        <p
                            class="order-confirmed__name"
                        >
                        ${key}
                        </p>
                        <div
                            class="order-confirmed__details"
                        >
                            <p
                                class="order-confirmed__quantity"
                            >
                                ${addedToCart[key].quantity}x
                            </p>
                            <p
                                class="order-confirmed__price"
                            >
                                @ $${addedToCart[key].price}
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    class="order-confirmed__right"
                >
                    <p
                        class="order-confirmed__total"
                    >
                        $${addedToCart[key].totalCost.toFixed(2)}
                    </p>
                </div>
            </div>
        `;

        orderMarkup += confirmedOrderTemplate;
    });

    document.querySelector(".order-confirmed__orders-wrapper").innerHTML =
        orderMarkup;

    const orderTotalCostElem = document.querySelector(
        ".order-confirmed__total-cost"
    );
    const totalCost = getTotalCost();

    orderTotalCostElem.textContent = `$${totalCost.toFixed(2)}`;
};

let dessertsData = {};
let addedToCart = {};
