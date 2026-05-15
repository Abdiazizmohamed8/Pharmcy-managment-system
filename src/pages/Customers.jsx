import {
  useMemo,
  useState,
} from "react";

import {
  doc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

function Customers({
  customers = [],
  setCustomers,
  openSidebar,
  toast,
}) {

  const { darkMode } =
    useTheme();

  // Theme
  const ui = {
    bg: darkMode
      ? "bg-[#050816] text-white"
      : "bg-slate-100",

    card: darkMode
      ? "bg-[#0f172a] border-[#1e293b]"
      : "bg-white border-slate-200",

    input: darkMode
      ? "bg-[#091225] border-[#1e293b]"
      : "bg-white border-slate-300",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",
  };

  // Search
  const [search, setSearch] =
    useState("");

  // Filter
  const filtered =
    useMemo(() =>

      customers.filter(
        (c) =>

          c.name
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            )
      ),

    [customers, search]
    );

  // Delete
  const remove =
    async (id) => {

      try {

        await deleteDoc(
          doc(
            db,
            "customers",
            id
          )
        );

        setCustomers(

          customers.filter(
            (c) => c.id !== id
          )
        );

        toast?.(
          "Customer deleted",
          "success"
        );

      } catch {

        toast?.(
          "Delete failed",
          "error"
        );
      }
    };

  return (

    <div className={`
      min-h-screen
      p-4 md:p-6
      ${ui.bg}
    `}>

      {/* Header */}
      <div className="
        flex items-center gap-4
        mb-6
      ">

        <button
          onClick={openSidebar}
          className={`
            md:hidden
            w-11 h-11
            rounded-2xl border
            ${ui.card}
          `}
        >
          ☰
        </button>

        <div>

          <h1 className="
            text-3xl font-black
          ">
            Customers 👥
          </h1>

          <p className={ui.text}>
            Customer management
          </p>

        </div>

      </div>

      {/* Top */}
      <div className="
        flex flex-col lg:flex-row
        justify-between gap-4
        mb-6
      ">

        {/* Search */}
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className={`
            w-full lg:max-w-md
            h-14 px-5
            rounded-2xl border
            outline-none
            ${ui.input}
          `}
        />

        {/* Total */}
        <div className="
          min-w-[180px]
          rounded-3xl
          bg-blue-600
          text-white
          p-5 text-center
        ">

          <p className="
            text-sm
          ">
            Customers
          </p>

          <h2 className="
            text-4xl font-black
          ">
            {customers.length}
          </h2>

        </div>

      </div>

      {/* Table */}
      <div className={`
        rounded-3xl border
        overflow-hidden
        ${ui.card}
      `}>

        {!filtered.length ? (

          <div className="
            p-20 text-center
            text-slate-400
          ">
            No customers found
          </div>

        ) : (

          <div className="
            overflow-x-auto
          ">

            <table className="
              w-full min-w-[900px]
            ">

              <thead>

                <tr className="
                  border-b border-[#1e293b]
                  text-left text-sm
                  text-slate-400
                ">

                  {[
                    "Customer",
                    "Phone",
                    "Address",
                    "Debt",
                    "Status",
                    "Action",
                  ].map((h) => (

                    <th
                      key={h}
                      className="p-5"
                    >
                      {h}
                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {filtered.map(
                  (c) => {

                    const debt =
                      Number(
                        c.debt || 0
                      );

                    const hasDebt =
                      debt > 0;

                    return (

                      <tr
                        key={c.id}
                        className="
                          border-b border-[#1e293b]
                        "
                      >

                        {/* Customer */}
                        <td className="p-5">

                          <div className="
                            flex items-center gap-3
                          ">

                            <div className="
                              w-12 h-12
                              rounded-full
                              bg-green-600
                              flex items-center
                              justify-center
                              text-base font-semibold
                              text-white
                            ">

                              {c.name?.charAt(0)}

                            </div>

                            <div>

                              <h2 className="
                                text-[17px]
                                font-semibold
                              ">
                                {c.name}
                              </h2>

                              <p className="
                                text-sm text-slate-400
                              ">
                                {c.date || "2026-05-15"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Phone */}
                        <td className="p-5">
                          {c.phone || "-"}
                        </td>

                        {/* Address */}
                        <td className="p-5">
                          {c.address || "-"}
                        </td>

                        {/* Debt */}
                        <td className="p-5">

                          <span className={`
                            px-4 py-2
                            rounded-full
                            text-sm font-semibold

                            ${
                              hasDebt

                                ? "bg-red-500/10 text-red-400"

                                : "bg-green-500/10 text-green-400"
                            }
                          `}>

                            $
                            {debt.toFixed(2)}

                          </span>

                        </td>

                        {/* Status */}
                        <td className="p-5">

                          <span className={`
                            px-4 py-2
                            rounded-full
                            text-sm font-semibold

                            ${
                              hasDebt

                                ? "bg-red-500/10 text-red-400"

                                : "bg-green-500/10 text-green-400"
                            }
                          `}>

                            {hasDebt
                              ? "Debt"
                              : "No Debt"}

                          </span>

                        </td>

                        {/* Action */}
                        <td className="p-5">

                          <button
                            onClick={() =>
                              remove(c.id)
                            }
                            className="
                              h-11 px-5
                              rounded-2xl
                              bg-red-600
                              hover:bg-red-700
                              text-white
                              text-sm font-semibold
                            "
                          >
                            Delete
                          </button>

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

export default Customers;