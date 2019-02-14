export const resetBalance = (comment) => ({
  comment,
  type: 'RESET_BALANCE'
});

export const increaseBalance = (id, comment) => ({
  id,
  comment,
  type: 'INCREASE_BALANCE'
});

export const decreaseBalance = (id) => ({
  id,
  type: 'DECREASE_BALANCE'
});