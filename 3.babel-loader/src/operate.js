debugger;
export default {
  getList() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Math.floor(Math.random() * 100000000));
      }, 1000);
    });
  },
  isContains(arr, character) {
    return arr.includes(character);
  },
  asyncFun() {
    return (dispatch) => (action) => dispatch(action);
  },
  add() {
    return (a, b) => a + b;
  },
};
