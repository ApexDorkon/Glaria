import React from "react";

export default function Leaderboard({ type = "general", data = [] }) {
  // Limit max visible rows height based on approx row height (~56px * 5 = 280px)
  const maxVisibleRows = 5;
  const rowHeight = 56; // approx height for each table row including padding
  const maxHeight = rowHeight * maxVisibleRows;

  return (
    <div className="w-full max-w-[1440px] mx-auto bg-white/20 backdrop-blur-xl rounded-[3rem] border border-white/30 shadow-lg p-8 shadow-white/20">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">
        {type === "general" ? "Top Glarians" : "Project Leaderboard"}
      </h2>

      {/* Header table with top rounded corners */}
      <table
        className="
          w-full table-auto text-left text-gray-900 rounded-t-[3rem] overflow-hidden
          bg-white/10 backdrop-blur-md sticky top-0 z-10 border-b border-white/30
        "
      >
        <thead>
          <tr>
            <th className="py-4 px-6 font-semibold">No.</th>
            <th className="py-4 px-6 font-semibold">User</th>
            <th className="py-4 px-6 font-semibold text-right">
              {type === "general" ? "GLARIA" : "(Project)"} XP
            </th>
          </tr>
        </thead>
      </table>

      {/* Scrollable body with bottom rounded corners */}
      <div
        style={{ maxHeight: maxHeight, overflowY: "auto" }}
        className="rounded-b-[3rem] border border-white/30 shadow-inner"
      >
        <table className="w-full table-auto text-left text-gray-900 rounded-b-[3rem] overflow-hidden">
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-600 italic">
                  No data available
                </td>
              </tr>
            ) : (
              data.map(({ username, profilePhoto, points }, index) => (
                <tr
                  key={username}
                  className={index % 2 === 0 ? "bg-white/10" : "bg-white/5"}
                >
                  <td className="py-4 px-6 font-medium">{index + 1}</td>
                  <td className="py-4 px-6 flex items-center gap-4 font-semibold">
                    <img
                      src={profilePhoto || "/default-profile.png"}
                      alt={`${username}'s profile`}
                      className="w-12 h-12 rounded-full object-cover border border-white/40 shadow"
                    />
                    <span>{username}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-right">
                    <span className="inline-block bg-white/30 backdrop-blur-lg border border-white/40 px-6 py-2 rounded-full shadow-lg text-gray-900 text-base font-semibold">
                      {points}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}