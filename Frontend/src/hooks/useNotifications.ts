// hooks/use-notifications.ts
import { useEffect, useState } from "react";
import axios from "axios";

export interface Notification {
  id: string;
  type: "message" | "comment" | "contact";
  content: string;
  createdAt: string;
  isRead: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("https://back-qhore.ondigitalocean.app/api/notifications");
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // première récupération
    const interval = setInterval(fetchNotifications, 10000); // toutes les 10 sec
    return () => clearInterval(interval);
  }, []);

  return { notifications, unreadCount };
};
