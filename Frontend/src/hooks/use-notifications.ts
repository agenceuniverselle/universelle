import { useEffect, useState } from "react";
import axios from "axios";

export interface Notification {
  id: number;
  type: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("access_token"); // ✅ récupérer le token
    if (!token) return;

    try {
      const res = await axios.get("https://back-qhore.ondigitalocean.app/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.is_read).length);
    } catch (error) {
      console.error("Erreur notifications :", error);
    }
  };

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await axios.post(
        `https://back-qhore.ondigitalocean.app/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      fetchNotifications(); // recharger après lecture
    } catch (error) {
      console.error("Erreur lors du marquage comme lu :", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  return { notifications, unreadCount, markAsRead };
};
