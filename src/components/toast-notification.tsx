"use client";

import { useEffect, useState } from "react";

type ToastNotificationProps = {
  title: string;
  message: string;
};

export function ToastNotification({ title, message }: ToastNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setVisible(true), 850);
    const hideTimer = window.setTimeout(() => setVisible(false), 7800);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <aside className="toast-notification" role="status">
      <span className="toast-notification__spark" aria-hidden="true">
        ✦
      </span>
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      <button aria-label="Close notification" onClick={() => setVisible(false)} type="button">
        ×
      </button>
    </aside>
  );
}
