export const calculateLevel = (coins) => {
  if (coins >= 10000) return { level: 4, badge: "👑" };
  if (coins >= 6000) return { level: 3, badge: "🥇" };
  if (coins >= 3000) return { level: 2, badge: "🥈" };
  if (coins >= 1000) return { level: 1, badge: "🥉" };
  return { level: 0, badge: "" };
};
