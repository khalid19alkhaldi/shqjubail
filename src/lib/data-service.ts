import { MOCK_ORDERS, PREVENTIVE_TASKS, MOCK_BUILDINGS, MOCK_NOTIFICATIONS } from "./mock-data";

const isClient = typeof window !== "undefined";

// Notifications
export const getNotifications = (role: string) => {
  if (!isClient) return [];
  const saved = localStorage.getItem("shq_notifications");
  let notifications = saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;

  if (!saved) {
    localStorage.setItem("shq_notifications", JSON.stringify(MOCK_NOTIFICATIONS));
  }

  return notifications.filter((n: any) => n.role === role);
};

export const markNotificationsAsRead = (role: string) => {
  if (!isClient) return;
  const saved = localStorage.getItem("shq_notifications");
  let notifications = saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;

  const updated = notifications.map((n: any) =>
    n.role === role ? { ...n, unread: false } : n
  );

  localStorage.setItem("shq_notifications", JSON.stringify(updated));
  return updated;
};

// Orders
export const getOrders = () => {
  if (!isClient) return MOCK_ORDERS;
  const saved = localStorage.getItem("shq_orders");
  if (!saved) {
    localStorage.setItem("shq_orders", JSON.stringify(MOCK_ORDERS));
    return MOCK_ORDERS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return MOCK_ORDERS;
  }
};

export const saveOrder = (newOrder: any) => {
  if (!isClient) return [newOrder, ...MOCK_ORDERS];
  const orders = getOrders();
  const updated = [newOrder, ...orders];
  localStorage.setItem("shq_orders", JSON.stringify(updated));
  return updated;
};

export const deleteOrder = (orderId: string) => {
  if (!isClient) return MOCK_ORDERS;
  const orders = getOrders();
  const updated = orders.filter((o: any) => o.id !== orderId);
  localStorage.setItem("shq_orders", JSON.stringify(updated));
  return updated;
};

export const updateOrderStatus = (orderId: string, status: string, extraData = {}) => {
  if (!isClient) return MOCK_ORDERS;
  const orders = getOrders();
  const updated = orders.map((o: any) =>
    o.id === orderId ? { ...o, status, ...extraData } : o
  );
  localStorage.setItem("shq_orders", JSON.stringify(updated));
  return updated;
};

// Statistics
export const getDashboardStats = () => {
  const orders = getOrders();
  const active = orders.filter((o: any) => o.status !== "مكتمل" && o.status !== "مرفوض من المقاول").length;
  const completed = orders.filter((o: any) => o.status === "مكتمل").length;
  const pendingApproval = orders.filter((o: any) => o.status === "تم تقديم عرض مالي").length;
  const buildings = getBuildings().length;

  return { active, completed, pendingApproval, buildings };
};

// Preventive Tasks
export const getPreventiveTasks = () => {
  if (!isClient) return PREVENTIVE_TASKS;
  const saved = localStorage.getItem("shq_preventive");
  if (!saved) {
    localStorage.setItem("shq_preventive", JSON.stringify(PREVENTIVE_TASKS));
    return PREVENTIVE_TASKS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return PREVENTIVE_TASKS;
  }
};

export const savePreventiveTask = (newTask: any) => {
  if (!isClient) return [newTask, ...PREVENTIVE_TASKS];
  const tasks = getPreventiveTasks();
  const updated = [newTask, ...tasks];
  localStorage.setItem("shq_preventive", JSON.stringify(updated));
  return updated;
};

export const approvePreventiveTask = (taskId: string) => {
  if (!isClient) return PREVENTIVE_TASKS;
  const tasks = getPreventiveTasks();
  const updated = tasks.map((t: any) => {
    if (t.id === taskId) {
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 3);
      return { ...t, status: "تم التعميد", nextDate: nextDate.toISOString().split('T')[0] };
    }
    return t;
  });
  localStorage.setItem("shq_preventive", JSON.stringify(updated));
  return updated;
};

// Buildings
export const getBuildings = () => {
  if (!isClient) return MOCK_BUILDINGS;
  const saved = localStorage.getItem("shq_buildings");
  if (!saved) {
    localStorage.setItem("shq_buildings", JSON.stringify(MOCK_BUILDINGS));
    return MOCK_BUILDINGS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return MOCK_BUILDINGS;
  }
};

export const addBuilding = (newBuilding: any) => {
  if (!isClient) return [newBuilding, ...MOCK_BUILDINGS];
  const buildings = getBuildings();
  const updated = [newBuilding, ...buildings];
  localStorage.setItem("shq_buildings", JSON.stringify(updated));
  return updated;
};
