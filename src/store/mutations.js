export default {
  addCounter(state,payload) {
    payload.count++
  },
  addToCart(state,paylaod) {
    paylaod.count = 1
    paylaod.checked = true
    state.cartList.push(paylaod)
  }
}
