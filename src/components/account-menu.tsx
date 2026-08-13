"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { logoutAction } from "@/features/auth/actions";

export function AccountMenu({ initial, label }: { initial: string; label: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);

  return (
    <div className="account-menu" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="account-menu__trigger"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span aria-hidden="true" className="account-menu__avatar">{initial}</span>
        <span className="account-menu__name">{label}</span>
        <span aria-hidden="true" className="account-menu__chevron">⌄</span>
      </button>
      {open && (
        <div aria-label="账户菜单 / Account menu" className="account-menu__dropdown" role="menu">
          <Link href="/account" onClick={() => setOpen(false)} role="menuitem">个人资料 <small>Profile</small></Link>
          <Link href="/account/posts" onClick={() => setOpen(false)} role="menuitem">我的发布 <small>My posts</small></Link>
          <Link href="/account#settings" onClick={() => setOpen(false)} role="menuitem">设置 <small>Settings</small></Link>
          <form action={logoutAction}>
            <button role="menuitem" type="submit">退出登录 <small>Sign out</small></button>
          </form>
        </div>
      )}
    </div>
  );
}
