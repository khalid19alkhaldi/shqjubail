import { supabase } from "./supabase";
import { MOCK_ORDERS, PREVENTIVE_TASKS, MOCK_BUILDINGS, MOCK_NOTIFICATIONS } from "./mock-data";

const isClient = typeof window !== "undefined";

// Helper for timeout to prevent infinite hangs
const withTimeout = <T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeoutMs)
    ),
  ]);
};

// Notifications
export const getNotifications = async (role: string) => {
  if (!isClient) return MOCK_NOTIFICATIONS.filter((n: any) => n.role === role);
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
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markNotificationsAsRead = async (role: string) => {
  if (!isClient) return;
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ unread: false })
      .eq('role', role);

    if (error) throw error;
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

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const saveOrder = async (newOrder: any) => {
  if (!isClient) return;
  try {
    const { error } = await supabase
      .from('orders')
      .insert([newOrder]);

    if (error) throw error;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string) => {
  if (!isClient) return;
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};

export const updateOrderStatus = async (orderId: string, status: string, extraData = {}) => {
  if (!isClient) return;
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, ...extraData })
      .eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

// Statistics (Parallelized)
export const getDashboardStats = async () => {
  try {
    const [ordersResult, buildingsResult] = await Promise.all([
      getOrders(),
      getBuildings()
    ]);

    const active = ordersResult.filter((o: any) => o.status !== "مكتمل" && o.status !== "مرفوض من المقاول").length;
    const completed = ordersResult.filter((o: any) => o.status === "مكتمل").length;
    const pendingApproval = ordersResult.filter((o: any) => o.status === "تم تقديم عرض مالي").length;

    return { active, completed, pendingApproval, buildings: buildingsResult.length };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { active: 0, completed: 0, pendingApproval: 0, buildings: 0 };
  }
};

// Preventive Tasks
export const getPreventiveTasks = async () => {
  if (!isClient) return PREVENTIVE_TASKS;
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('preventive_tasks')
        .select('*')
        .order('next_date', { ascending: true })
    );

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching preventive tasks:", error);
    return [];
  }
};

export const savePreventiveTask = async (newTask: any) => {
  if (!isClient) return;
  try {
    const { error } = await supabase
      .from('preventive_tasks')
      .insert([newTask]);

    if (error) throw error;
  } catch (error) {
    console.error("Error saving preventive task:", error);
    throw error;
  }
};

export const approvePreventiveTask = async (taskId: string) => {
  if (!isClient) return;
  try {
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 3);

    const { error } = await supabase
      .from('preventive_tasks')
      .update({
        status: "تم التعميد",
        next_date: nextDate.toISOString().split('T')[0]
      })
      .eq('id', taskId);

    if (error) throw error;
  } catch (error) {
    console.error("Error approving preventive task:", error);
  }
};

// Buildings
export const getBuildings = async () => {
  if (!isClient) return MOCK_BUILDINGS;
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('buildings')
        .select('*')
        .order('created_at', { ascending: false })
    );

    if (error) throw error;

    return (data || []).map((b: any) => ({
      ...b,
      activeOrders: b.active_orders // Compatibility bridge
    }));
  } catch (error) {
    console.error("Error fetching buildings:", error);
    return [];
  }
};

export const addBuilding = async (newBuilding: any) => {
  if (!isClient) return;
  try {
    const { error } = await supabase
      .from('buildings')
      .insert([newBuilding]);

    if (error) throw error;
  } catch (error) {
    console.error("Error adding building:", error);
    throw error;
  }
};
