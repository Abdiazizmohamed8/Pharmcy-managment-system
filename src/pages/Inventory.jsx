import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

import { useTheme } from "../context/ThemeContext";

function Inventory({ openSidebar }) {
  const { darkMode } = useTheme();

  // Theme
  const ui = {
    bg: darkMode
      ? "bg-[#050816] text-white"
      : "bg-slate-100 text-black",

    card: darkMode
      ? "bg-[#0f172a] border-[#1e293b]"
      : "bg-white border-slate-200",

    input: darkMode
      ? "bg-[#091225] border-[#1e293b] text-white"
      : "bg-white border-slate-300 text-black",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",
  };

  // States
  const [medicines, setMedicines] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // Fetch Medicines
  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(db, "medicines"),

        (snapshot) => {

          setMedicines(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      );

    return () => unsubscribe();

  }, []);

  // Search
  const filteredMedicines =
    medicines.filter((m) =>
      m.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // Analytics
  const total =
    medicines.length;

  const lowStock =
    medicines.filter(
      (m) =>
        Number(m.stock || 0) <=
        Number(m.minStock || 5)
    ).length;

  const outStock =
    medicines.filter(
      (m) =>
        Number(m.stock || 0) <= 0
    ).length;

  const available =
    medicines.filter(
      (m) =>
        Number(m.stock || 0) >
        Number(m.minStock || 5)
    ).length;

  return (
    <div className={`min-h-screen p-4 md:p-6 ${ui.bg}`}>

      {/* Header */}
      <div className="
        flex items-center gap-4
        mb-6
      ">

        <button
          onClick={openSidebar}
          className={`
            md:hidden w-12 h-12
            rounded-2xl border
            text-xl
            ${ui.card}
          `}
        >
          ☰
        </button>

        <div>

          <h1 className="text-3xl md:text-5xl font-black">
            Inventory 📦
          </h1>

          <p className={ui.text}>
            Manage medicine inventory
          </p>

        </div>

      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search medicine..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className={`
          w-full h-14 px-5 mb-6
          rounded-2xl border outline-none
          ${ui.input}
        `}
      />

      {/* Analytics */}
      <div className="
        grid sm:grid-cols-2
        xl:grid-cols-4 gap-5
        mb-6
      ">

        <Card
          title="Total Medicines"
          value={total}
          color="text-blue-500"
          ui={ui}
        />

        <Card
          title="Available"
          value={available}
          color="text-green-500"
          ui={ui}
        />

        <Card
          title="Low Stock"
          value={lowStock}
          color="text-yellow-500"
          ui={ui}
        />

        <Card
          title="Out Of Stock"
          value={outStock}
          color="text-red-500"
          ui={ui}
        />

      </div>

      {/* Table */}
      <div
        className={`
          rounded-3xl border overflow-hidden
          ${ui.card}
        `}
      >

        {!filteredMedicines.length ? (

          <div className="
            p-20 text-center
            text-slate-400
          ">
            No medicines available
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="
                  border-b border-[#1e293b]
                  text-slate-400 text-sm
                ">

                  {[
                    "Medicine",
                    "Category",
                    "Stock",
                    "Min Stock",
                    "Expiry",
                    "Status",
                  ].map((head) => (
                    <th
                      key={head}
                      className="p-5 text-left"
                    >
                      {head}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {filteredMedicines.map(
                  (medicine) => {

                    const stock =
                      Number(
                        medicine.stock || 0
                      );

                    const min =
                      Number(
                        medicine.minStock || 5
                      );

                    const low =
                      stock <= min;

                    const out =
                      stock <= 0;

                    return (

                      <tr
                        key={medicine.id}
                        className="
                          border-b border-[#1e293b]
                          hover:bg-slate-500/5
                        "
                      >

                        {/* Name */}
                        <td className="
                          p-5 font-bold
                        ">
                          {medicine.name}
                        </td>

                        {/* Category */}
                        <td className="p-5">

                          <span className="
                            px-4 py-2 rounded-full
                            text-xs font-bold
                            bg-green-500/10
                            text-green-400
                          ">

                            {medicine.category}

                          </span>

                        </td>

                        {/* Stock */}
                        <td
                          className={`
                            p-5 font-bold

                            ${
                              out
                                ? "text-red-500"
                                : low
                                ? "text-yellow-500"
                                : "text-green-500"
                            }
                          `}
                        >
                          {stock}
                        </td>

                        {/* Min */}
                        <td className="p-5">
                          {min}
                        </td>

                        {/* Expiry */}
                        <td className="
                          p-5 text-sm text-slate-300
                        ">
                          {medicine.expiryDate}
                        </td>

                        {/* Status */}
                        <td className="p-5">

                          <span
                            className={`
                              px-4 py-2 rounded-full
                              text-xs font-bold

                              ${
                                out
                                  ? "bg-red-500/10 text-red-400"
                                  : low
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : "bg-green-500/10 text-green-400"
                              }
                            `}
                          >

                            {out
                              ? "Out Of Stock"
                              : low
                              ? "Low Stock"
                              : "Available"}

                          </span>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

/* Card */
function Card({
  title,
  value,
  color,
  ui,
}) {
  return (
    <div
      className={`
        p-6 rounded-3xl border
        ${ui.card}
      `}
    >

      <p className={`
        text-sm mb-4
        ${ui.text}
      `}>
        {title}
      </p>

      <h2 className={`
        text-4xl font-black
        ${color}
      `}>
        {value}
      </h2>

    </div>
  );
}

export default Inventory;