import { MOCK_ORDERS, PREVENTIVE_TASKS, MOCK_BUILDINGS } from "./mock-data";

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

export const deleteOrder = (orderId: string) => {
  const orders = getOrders();
  const updated = orders.filter((o: any) => o.id !== orderId);
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

// Preventive Tasks
export const getPreventiveTasks = () => {
  const saved = localStorage.getItem("shq_preventive");
  if (!saved) {
    localStorage.setItem("shq_preventive", JSON.stringify(PREVENTIVE_TASKS));
    return PREVENTIVE_TASKS;
  }
  return JSON.parse(saved);
};

export const approvePreventiveTask = (taskId: string) => {
  const tasks = getPreventiveTasks();
  const updated = tasks.map((t: any) => {
    if (t.id === taskId) {
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 3); // Mock logic
      return { ...t, status: "تم التعميد", nextDate: nextDate.toISOString().split('T')[0] };
    }
    return t;
  });
  localStorage.setItem("shq_preventive", JSON.stringify(updated));
  return updated;
};

// Buildings
export const getBuildings = () => {
  const saved = localStorage.getItem("shq_buildings");
  if (!saved) {
    localStorage.setItem("shq_buildings", JSON.stringify(MOCK_BUILDINGS));
    return MOCK_BUILDINGS;
  }
  return JSON.parse(saved);
};

export const addBuilding = (newBuilding: any) => {
  const buildings = getBuildings();
  const updated = [newBuilding, ...buildings];
  localStorage.setItem("shq_buildings", JSON.stringify(updated));
  return updated;
};
