const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isSameDate = (dateA, dateB) => {
  return normalizeDate(dateA).getTime() === normalizeDate(dateB).getTime();
};

const getToday = () => {
  return normalizeDate(new Date());
};

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return normalizeDate(tomorrow);
};

const getCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/* ⬇︎ For production, we use the actual business hours and cutoff time. */

/*const CASH_START_MINUTES = 8 * 60;
const CASH_END_MINUTES = 17 * 60;
const PREORDER_CUTOFF_MINUTES = 17 * 60;*/

/* ⬇︎ For testing purposes, we can set the cash order window to be always open and the preorder cutoff to be always in the future.  */

 const CASH_START_MINUTES = 0;
const CASH_END_MINUTES = 24 * 60;
const PREORDER_CUTOFF_MINUTES = 24 * 60; 

const validateCashOrder = (pickupDate) => {
  const nowMinutes = getCurrentMinutes();

  if (!isSameDate(pickupDate, getToday())) {
    return 'Cash orders are allowed for same-day pickup only';
  }

  if (nowMinutes < CASH_START_MINUTES || nowMinutes >= CASH_END_MINUTES) {
    return 'Cash orders can only be placed between 8:00 AM and 5:00 PM';
  }

  return null;
};

const validateBankTransferOrder = (pickupDate) => {
  const nowMinutes = getCurrentMinutes();

  if (!isSameDate(pickupDate, getTomorrow())) {
    return "Bank transfer is allowed only for tomorrow's pickup";
  }

  if (nowMinutes >= PREORDER_CUTOFF_MINUTES) {
    return 'Preorders for tomorrow must be placed before 5:00 PM today';
  }

  return null;
};

const canStudentCancel = (order) => {
  return order.orderStatus === 'pending';
};

const isValidStatusTransition = (currentStatus, nextStatus) => {
  const transitions = {
    pending: ['confirmed'],
    confirmed: ['preparing'],
    preparing: ['ready'],
    ready: ['completed'],
    completed: [],
    cancelled: [],
  };

  return transitions[currentStatus]?.includes(nextStatus) || false;
};

module.exports = {
  validateCashOrder,
  validateBankTransferOrder,
  canStudentCancel,
  isValidStatusTransition,
};