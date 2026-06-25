import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://cheshireshelfapp-env.eba-pzcyg6yq.eu-north-1.elasticbeanstalk.com";

type ValuesResponse<T> = {
  $values?: T[];
};

type PagedResponse<T> = {
  data?: ValuesResponse<T> | T[];
  $values?: T[];
};

export type AdminUser = {
  id: string;
  userName: string;
  email: string;
  roles: string[];
};

type AdminUserResponse = {
  id: string;
  userName: string;
  email: string;
  roles?: ValuesResponse<string> | string[] | null;
};

export type AdminOrder = {
  id: string;
  status: number | string;
  createdAt?: string;
  totalPrice?: number;
};

export type PromoCode = {
  id?: string;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
};

const adminClient = axios.create({
  baseURL: API_BASE_URL,
});

adminClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const unwrapValues = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const objectData = data as PagedResponse<T>;

  if (Array.isArray(objectData.$values)) {
    return objectData.$values;
  }

  if (Array.isArray(objectData.data)) {
    return objectData.data;
  }

  if (
    objectData.data &&
    typeof objectData.data === "object" &&
    "$values" in objectData.data &&
    Array.isArray((objectData.data as ValuesResponse<T>).$values)
  ) {
    return (objectData.data as ValuesResponse<T>).$values ?? [];
  }

  return [];
};

const normalizeRoles = (
  roles: ValuesResponse<string> | string[] | null | undefined,
): string[] => {
  if (Array.isArray(roles)) {
    return roles;
  }

  if (roles && Array.isArray(roles.$values)) {
    return roles.$values;
  }

  return [];
};

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string") {
      if (data.includes("FOREIGN KEY constraint failed")) {
        return "User cannot be deleted because they have related data.";
      }

      return data;
    }

    if (error.response?.status === 500) {
      return "Server error. User probably has related data.";
    }

    if (error.response?.status === 400) {
      return "Bad request. Backend rejected this operation.";
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const getUsers = async (): Promise<AdminUser[]> => {
  const response = await adminClient.get("/api/v1/Admin/get-all-users", {
    params: {
      page: 1,
      pageSize: 100,
    },
  });

  const users = unwrapValues<AdminUserResponse>(response.data);

  return users.map((user) => ({
    id: user.id,
    userName: user.userName,
    email: user.email,
    roles: normalizeRoles(user.roles),
  }));
};

export const deleteUser = async (user: AdminUser) => {
  try {
    await adminClient.delete(
      `/api/v1/Admin/delete-user-by-name/${user.userName}`,
    );
  } catch (adminDeleteError) {
    console.warn("Admin delete by username failed, trying delete by id.");

    await adminClient.delete(`/api/User/${user.id}`);
  }
};

export const assignAdminByName = async (userName: string) => {
  await adminClient.post(
    `/api/v1/Admin/assign-admin-role-by-name/${userName}`,
    null,
  );
};

export const removeAdminByName = async (userName: string) => {
  await adminClient.post(
    `/api/v1/Admin/remove-admin-role-by-name/${userName}`,
    null,
  );
};

export const getOrders = async (): Promise<AdminOrder[]> => {
  const response = await adminClient.get("/api/Order/get-all-orders");

  return unwrapValues<AdminOrder>(response.data);
};

export const updateOrderStatus = async (orderId: string, status: number) => {
  await adminClient.patch(`/api/Order/${orderId}/status`, { status });
};

export const deleteOrder = async (orderId: string) => {
  await adminClient.delete(`/api/Order/${orderId}`);
};

export const getPromoCodes = async (): Promise<PromoCode[]> => {
  const response = await adminClient.get("/api/v1/PromoCode/get-all");

  return unwrapValues<PromoCode>(response.data);
};

export const createPromoCodeRequest = async (
  code: string,
  discount: number,
  expiryDate: string,
) => {
  await adminClient.post("/api/v1/PromoCode/Create", {
    code,
    discount,
    expiryDate,
  });
};

export const activatePromoCodeRequest = async (code: string) => {
  await adminClient.post(
    `/api/v1/PromoCode/Activate?code=${encodeURIComponent(code)}`,
    null,
  );
};

export const deactivatePromoCodeRequest = async (code: string) => {
  await adminClient.post(
    `/api/v1/PromoCode/Deactivate?code=${encodeURIComponent(code)}`,
    null,
  );
};

export const deletePromoCodeRequest = async (code: string) => {
  await adminClient.delete(
    `/api/v1/PromoCode/Delete?code=${encodeURIComponent(code)}`,
  );
};
