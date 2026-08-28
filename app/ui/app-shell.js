"use client";

import { useEffect, useState } from "react";
import { IconLeaf, IconLock, IconMail } from "@tabler/icons-react";
import Dashboard from "./dashboard";
import { apiPost } from "../lib/api";

export default function AppShell() {
  const [authenticated, setAuthenticated] = useState(false); const [ready, setReady] = useState(false);
  useEffect(() => { setAuthenticated(Boolean(window.localStorage.getItem("htx_auth_token"))); setReady(true); }, []);
  if (!ready) return null;
  return authenticated ? <Dashboard /> : <LoginScreen onAuthenticated={() => setAuthenticated(true)} />;
}

function LoginScreen({ onAuthenticated }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(""); try { const result = await apiPost("/api/auth/login", { email, password }); window.localStorage.setItem("htx_auth_token", result.token); onAuthenticated(); } catch (reason) { setError(reason.message); } finally { setLoading(false); } };
  return <main className="login-screen"><section className="login-panel"><div className="login-brand"><span><IconLeaf size={25} /></span><div><b>HTX Số</b><small>Đồng Tháp</small></div></div><div className="login-heading"><p>HỆ THỐNG ĐIỀU HÀNH</p><h1>Đăng nhập</h1><span>Truy cập dữ liệu quản trị, vùng trồng và chuỗi nông sản theo quyền được cấp.</span></div><form onSubmit={submit}><label><span>Email công việc</span><div><IconMail size={17} /><input value={email} type="email" autoComplete="email" required onChange={(event) => setEmail(event.target.value)} /></div></label><label><span>Mật khẩu</span><div><IconLock size={17} /><input value={password} type="password" autoComplete="current-password" required onChange={(event) => setPassword(event.target.value)} /></div></label>{error && <p className="login-error">{error}</p>}<button className="primary-btn" disabled={loading}>{loading ? "Đang xác thực…" : "Đăng nhập hệ thống"}</button></form><p className="login-note">Mọi lần đăng nhập và thay đổi quyền đều được ghi nhận nhật ký hệ thống.</p></section></main>;
}
