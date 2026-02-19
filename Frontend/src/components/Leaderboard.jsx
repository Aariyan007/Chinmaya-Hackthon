import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));

        userArray.sort((a, b) => (b.coins || 0) - (a.coins || 0));

        setUsers(userArray);
      }
    });
  }, []);

  // If all users have 0 coins → show only logged user
  const filteredUsers =
    users.every(u => (u.coins || 0) === 0)
      ? users.filter(u => u.id === currentUserId)
      : users;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        Top Informers
      </h2>

      {filteredUsers.map((user, index) => (
        <div
          key={user.id}
          className="flex justify-between py-2 border-b last:border-none"
        >
          <span>
            {index + 1}. {user.username}
          </span>
          <span>🪙 {user.coins || 0}</span>
        </div>
      ))}
    </div>
  );
}
