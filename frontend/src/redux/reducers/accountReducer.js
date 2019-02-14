export default (state = {}, action) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      return {
        result: action.payload
      };
    default:
      return state;
  }
};
