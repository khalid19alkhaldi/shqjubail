import { supabase } from "./supabase";
import { MOCK_ORDERS, PREVENTIVE_TASKS, MOCK_BUILDINGS, MOCK_NOTIFICATIONS } from "./mock-data";

const isClient = typeof window !== "undefined";

// Helper for timeout to prevent infinite hangs
const withTimeout = <T>(promise: Promise<T>, timeoutMs = 5000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeoutMs)
    ),
  ]);
};

// Notifications
export const getNotifications = async (role: string) => {
  if (!isClient) return [];
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('notifications')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false })
    );

    if (error) throw error;
    return data || [];
  } catch (error) {
    return MOCK_NOTIFICATIONS.filter((n: any) => n.role === role);
  }
};

export const markNotificationsAsRead = async (role: string) => {
  if (!isClient) return;
  try {
    await supabase
      .from('notifications')
      .update({ unread: false })
      .eq('role', role);
  } catch (error) {
    console.error("Error marking notifications read:", error);
  }
};

// Orders
export const getOrders = async () => {
  if (!isClient) return MOCK_ORDERS;
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
    );

    if (error || !data || data.length === 0) return MOCK_ORDERS;
    return data;
  } catch (error) {
    return MOCK_ORDERS;
  }
};

export const saveOrder = async (newOrder: any) => {
  if (!isClient) return;
  try {
    const { error } = await supabase.from('orders').insert([newOrder]);
    if (error) throw error;
  } catch (error) {
    const saved = localStorage.getItem("shq_orders");
    const orders = saved ? JSON.parse(saved) : MOCK_ORDERS;
    localStorage.setItem("shq_orders", JSON.stringify([newOrder, ...orders]));
  }
};

export const deleteOrder = async (orderId: string) => {
  if (!isClient) return;
  try {
    await supabase.from('orders').delete().eq('id', orderId);
  } catch (error) {
    const saved = localStorage.getItem("shq_orders");
    if (saved) {
      const orders = JSON.parse(saved);
      localStorage.setItem("shq_orders", JSON.stringify(orders.filter((o: any) => o.id !== orderId)));
    }
  }
};

export const updateOrderStatus = async (orderId: string, status: string, extraData = {}) => {
  if (!isClient) return;
  try {
    await supabase.from('orders').update({ status, ...extraData }).eq('id', orderId);
  } catch (error) {
    const saved = localStorage.getItem("shq_orders");
    if (saved) {
      const orders = JSON.parse(saved);
      const updated = orders.map((o: any) => o.id === orderId ? { ...o, status, ...extraData } : o);
      localStorage.setItem("shq_orders", JSON.stringify(updated));
    }
  }
};

// Statistics
export const getDashboardStats = async () => {
  const orders = await getOrders();
  const buildings = await getBuildings();

  const active = orders.filter((o: any) => o.status !== "مكتمل" && o.status !== "مرفوض من المقاول").length;
  const completed = orders.filter((o: any) => o.status === "مكتمل").length;
  const pendingApproval = orders.filter((o: any) => o.status === "تم تقديم عرض مالي").length;

  return { active, completed, pendingApproval, buildings: buildings.length };
};

// Preventive Tasks
export const getPreventiveTasks = async () => {
  if (!isClient) return PREVENTIVE_TASKS;
  try {
    const { data, error } = await withTimeout(
      supabase.from('preventive_tasks').select('*').order('next_date', { ascending: true })
    );
    if (error || !data || data.length === 0) return PREVENTIVE_TASKS;
    return data;
  } catch (error) {
    return PREVENTIVE_TASKS;
  }
};

// Buildings
export const getBuildings = async () => {
  if (!isClient) return MOCK_BUILDINGS;
  try {
    const { data, error } = await withTimeout(
      supabase.from('buildings').select('*').order('name', { ascending: true })
    );
    if (error || !data || data.length === 0) return MOCK_BUILDINGS;
    return data;
  } catch (error) {
    return MOCK_BUILDINGS;
  }
};

export const addBuilding = async (newBuilding: any) => {
  if (!isClient) return;
  try {
    await supabase.from('buildings').insert([newBuilding]);
  } catch (error) {
    console.error("Error adding building:", error);
  }
};
