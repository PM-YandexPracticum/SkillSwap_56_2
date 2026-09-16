import { Sidebar } from "@/shared/ui/Sidebar";
import { Outlet } from "react-router-dom";

export default function ProfilePage() {
 return (
  <main>
    <Sidebar />
    <Outlet />
  </main>
 )
}