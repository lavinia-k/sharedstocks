export const setAccount = id => dispatch => {
  dispatch({
    type: "SET_ACCOUNT",
    payload: id
  });
};
