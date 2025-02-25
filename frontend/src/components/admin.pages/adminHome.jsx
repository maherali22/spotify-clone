import React from "react";
import AdminSidebar from "./adminSidebar";
import Dashboard from "./adminDashboard";
import AdminNavbar from "./adminNavbar";

const AdminHome = () => {
  return (
    <div className="w-full min-h-screen bg-black text-white overflow-hidden">
      <AdminNavbar />
      <div className=" w-full flex h-screen fixed">
        <AdminSidebar />
        <main className="flex-1 w-full p-6 bg-black text-green-400 h-screen overflow-y-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
