const closeBtnCart = document.getElementsByClassName("cart-view__close-btn")
const blackout = document.getElementsByClassName('blackout')
const cartview = document.getElementsByClassName('cart-view')
const navCartBtn = document.getElementsByClassName('nav__cart-btn')

navCartBtn[0].addEventListener('click', () => {
    blackout[0].style.display = "block";
    cartview[0].style.display = "flex";
})

closeBtnCart[0].addEventListener('click', () => {
    blackout[0].style.display = "none";
    cartview[0].style.display = "none";
})

blackout[0].addEventListener('click', () => {
    blackout[0].style.display = "none";
    cartview[0].style.display = "none";
})