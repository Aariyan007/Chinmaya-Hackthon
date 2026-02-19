import Sidebar from "../components/Sidebar";

export default function Profile() {
  const username = localStorage.getItem("username");

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-blue-600">
          Profile
        </h1>
        <p className="mt-4">Username: {username}</p>
      </div>
    </div>
  );
}
