import { useState } from "react";

import { fmt } from "../utils/helpers";

import { useTheme } from "../context/ThemeContext";

function Expenses({
  expenses = [],
  setExpenses,
  toast,
  openSidebar,
}) {

  const { darkMode } =
    useTheme();

  // Theme
  const ui = {
    bg: darkMode
      ? "bg-[#020617] text-white"
      : "bg-slate-100 text-black",

    card: darkMode
      ? "bg-[#111827] border-[#1f2937]"
      : "bg-white border-slate-200",

    input: darkMode
      ? "bg-[#0f172a] border-[#374151] text-white"
      : "bg-white border-slate-300 text-black",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",
  };

  // States
  const [show, setShow] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [form, setForm] =
    useState({
      category: "",
      description: "",
      amount: "",
    });

  // Filter
  const data =
    expenses.filter(
      (e) =>

        e.category
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        e.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  // Total
  const total =
    expenses.reduce(
      (a, b) =>
        a +
        Number(
          b.amount || 0
        ),
      0
    );

  // Save
  const save = () => {

    if (
      !form.category ||
      !form.amount
    ) {

      toast?.(
        "Fill all fields",
        "error"
      );

      return;
    }

    setExpenses(
      (p) => [
        {
          id: Date.now(),

          ...form,

          amount:
            Number(
              form.amount
            ),

          date:
            new Date()
              .toISOString()
              .split("T")[0],
        },
        ...p,
      ]
    );

    toast?.(
      "Expense added",
      "success"
    );

    setForm({
      category: "",
      description: "",
      amount: "",
    });

    setShow(false);
  };

  // Delete
  const remove = (id) => {

    setExpenses(
      expenses.filter(
        (e) =>
          e.id !== id
      )
    );

    toast?.(
      "Expense deleted",
      "error"
    );
  };

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
            md:hidden
            w-12 h-12
            rounded-2xl border
            text-xl
            ${ui.card}
          `}
        >
          ☰
        </button>

        <div>

          <h1 className="
            text-3xl md:text-5xl
            font-black
          ">
            Expenses 💸
          </h1>

          <p className={ui.text}>
            Manage pharmacy expenses
          </p>

        </div>

      </div>

      {/* Top */}
      <div className="
        flex flex-col lg:flex-row
        justify-between gap-5
        mb-6
      ">

        <input
          type="text"
          placeholder="Search expense..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className={`
            w-full lg:max-w-md
            h-14 px-5 rounded-2xl
            border outline-none
            ${ui.input}
          `}
        />

        <div className="
          flex flex-wrap gap-4
          items-center
        ">

          {/* Total */}
          <div className="
            bg-red-600 text-white
            rounded-3xl px-8 py-5
            min-w-[220px]
          ">

            <p className="text-sm">
              Total Expenses
            </p>

            <h2 className="
              text-5xl font-black mt-2
            ">
              {fmt(total)}
            </h2>

          </div>

          {/* Add */}
          <button
            onClick={() =>
              setShow(true)
            }
            className="
              h-14 px-8 rounded-2xl
              bg-green-600 hover:bg-green-700
              text-white font-bold
            "
          >
            + Add Expense
          </button>

        </div>

      </div>

      {/* Table */}
      <div className={`
        rounded-3xl border
        overflow-hidden
        ${ui.card}
      `}>

        {!data.length ? (

          <div className="
            p-20 text-center
            text-slate-400
          ">
            No expenses found
          </div>

        ) : (

          <>
            {/* Desktop */}
            <div className="hidden lg:block">

              <table className="w-full">

                <thead>

                  <tr className="
                    border-b border-[#1f2937]
                    text-slate-400 text-sm
                  ">

                    {[
                      "Category",
                      "Description",
                      "Amount",
                      "Date",
                      "Action",
                    ].map((i) => (

                      <th
                        key={i}
                        className="
                          p-5 text-left
                        "
                      >
                        {i}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody>

                  {data.map((e) => (

                    <tr
                      key={e.id}
                      className="
                        border-b border-[#1f2937]
                      "
                    >

                      <td className="p-5">

                        <span className="
                          px-4 py-2 rounded-full
                          bg-green-900
                          text-green-400
                          text-sm font-bold
                        ">
                          {e.category}
                        </span>

                      </td>

                      <td className="p-5">
                        {
                          e.description ||
                          "No description"
                        }
                      </td>

                      <td className="p-5">

                        <span className="
                          px-4 py-2 rounded-full
                          bg-red-900
                          text-red-400
                          text-sm font-bold
                        ">
                          {fmt(e.amount)}
                        </span>

                      </td>

                      <td className="p-5">
                        {e.date}
                      </td>

                      <td className="p-5">

                        <button
                          onClick={() =>
                            remove(e.id)
                          }
                          className="
                            h-10 px-4 rounded-xl
                            bg-red-600
                            text-white text-sm
                            font-bold
                          "
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {/* Mobile */}
            <div className="
              lg:hidden
              p-4 space-y-4
            ">

              {data.map((e) => (

                <div
                  key={e.id}
                  className="
                    border border-[#1f2937]
                    rounded-2xl p-5
                  "
                >

                  <div className="
                    flex justify-between
                    mb-4
                  ">

                    <span className="
                      px-4 py-2 rounded-full
                      bg-green-900
                      text-green-400
                      text-xs font-bold
                    ">
                      {e.category}
                    </span>

                    <span className="
                      px-4 py-2 rounded-full
                      bg-red-900
                      text-red-400
                      text-xs font-bold
                    ">
                      {fmt(e.amount)}
                    </span>

                  </div>

                  <p className="mb-3">
                    {
                      e.description ||
                      "No description"
                    }
                  </p>

                  <div className="
                    flex justify-between
                    items-center
                  ">

                    <p className={ui.text}>
                      {e.date}
                    </p>

                    <button
                      onClick={() =>
                        remove(e.id)
                      }
                      className="
                        h-10 px-4 rounded-xl
                        bg-red-600
                        text-white text-sm
                        font-bold
                      "
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          </>
        )}

      </div>

      {/* Modal */}
      {show && (

        <div className="
          fixed inset-0 z-50
          bg-black/60
          flex items-center
          justify-center
          p-4
        ">

          <div className={`
            w-full max-w-md
            rounded-3xl border
            p-6 space-y-4
            ${ui.card}
          `}>

            <h2 className="
              text-2xl font-black
            ">
              Add Expense
            </h2>

            {[
              ["category", "Category"],
              ["description", "Description"],
              ["amount", "Amount"],
            ].map(([key, text]) => (

              <input
                key={key}
                type={
                  key === "amount"
                    ? "number"
                    : "text"
                }
                placeholder={text}
                value={form[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]:
                      e.target.value,
                  })
                }
                className={`
                  w-full h-14 px-5
                  rounded-2xl border
                  outline-none
                  ${ui.input}
                `}
              />

            ))}

            <div className="
              flex gap-4 pt-2
            ">

              <button
                onClick={save}
                className="
                  flex-1 h-14 rounded-2xl
                  bg-green-600
                  text-white font-bold
                "
              >
                Save
              </button>

              <button
                onClick={() =>
                  setShow(false)
                }
                className="
                  flex-1 h-14 rounded-2xl
                  bg-slate-700
                  text-white font-bold
                "
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Expenses;