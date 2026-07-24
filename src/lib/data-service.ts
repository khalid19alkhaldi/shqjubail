import { MOCK_ORDERS } from "./mock-data";

export const getOrders = () => {
  const saved = localStorage.getItem("shq_orders");
  if (!saved) {
    localStorage.setItem("shq_orders", JSON.stringify(MOCK_ORDERS));
    return MOCK_ORDERS;
  }
  return JSON.parse(saved);
};

export const saveOrder = (newOrder: any) => {
  const orders = getOrders();
  const updated = [newOrder, ...orders];
  localStorage.setItem("shq_orders", JSON.stringify(updated));
  return updated;
};

export const updateOrderStatus = (orderId: string, status: string, extraData = {}) => {
  const orders = getOrders();
  const updated = orders.map((o: any) =>
    o.id === orderId ? { ...o, status, ...extraData } : o
  );
  localStorage.setItem("shq_orders", JSON.stringify(updated));
  return updated;
};
