import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatsSection from "../components/StatsSection";
import ReportPothole from "../components/ReportPothole";

export default function Dashboard() {
  const [username, setUsername] = useState("User");
  const [greeting, setGreeting] = useState("");
  const [pothholes, setPotholes] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#f8fbff] to-[#eef3ff]">
      <Sidebar />

      <div className="flex-1 p-6 space-y-8">

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-blue-600">
            {greeting}, {username} 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Helping you build better cities.
          </p>
        </div>

        <StatsSection />

        {/* 👇 THIS is the correct integration */}
        {/* <ReportPothole /> */}
        <ReportPothole onNewPothole={(p) => setPotholes(prev => [...prev, p])} />

      </div>
    </div>
  );
}
