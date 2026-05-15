import {
  useMemo,
  useState,
} from "react";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import { useTheme } from "../context/ThemeContext";

function Debts({
  sales = [],
  setSales,
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
      ? "bg-[#111827] border-[#374151] text-white"
      : "bg-white border-slate-300 text-black",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",
  };

  // Search
  const [search, setSearch] =
    useState("");

  // Filter Debts
  const debtSales =
    useMemo(() => {

      return sales.filter(
        (sale) => {

          const debt =
            Number(sale.total || 0) -
            Number(sale.paid || 0);

          return (
            debt > 0 &&
            sale.customer
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );
        }
      );

    }, [sales, search]);

  // Total Debt
  const totalDebt =
    debtSales.reduce(
      (sum, sale) =>

        sum +
        (
          Number(sale.total || 0) -
          Number(sale.paid || 0)
        ),

      0
    );

  // Mark Paid
  const markPaid =
    async (sale) => {

      try {

        const total =
          Number(
            sale.total || 0
          );

        // Update Sale
        await updateDoc(

          doc(
            db,
            "sales",
            sale.id
          ),

          {
            paid: total,
            status: "Paid",
          }
        );

        // Update Customer
        await updateDoc(

          doc(
            db,
            "customers",
            sale.phone ||
            sale.customer
          ),

          {
            debt: 0,
            status: "Paid",
          }
        );

        // Local Update
        setSales(

          sales.map((item) =>

            item.id === sale.id

              ? {
                  ...item,
                  paid: total,
                  status: "Paid",
                }

              : item
          )
        );

        toast?.(
          "Debt paid successfully",
          "success"
        );

      } catch (error) {

        console.log(error);

        toast?.(
          "Failed to update debt",
          "error"
        );
      }
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
            Debts 💳
          </h1>

          <p className={ui.text}>
            Customer debts management
          </p>

        </div>

      </div>

      {/* Top */}
      <div className="
        flex flex-col lg:flex-row
        justify-between gap-5
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
          bg-red-600 text-white
          rounded-3xl px-8 py-5
          text-center min-w-[220px]
        ">

          <p className="text-sm">
            Total Debt
          </p>

          <h2 className="
            text-5xl font-black mt-2
          ">
            $
            {totalDebt.toFixed(2)}
          </h2>

        </div>

      </div>

      {/* Table */}
      <div
        className={`
          rounded-3xl border
          overflow-hidden
          ${ui.card}
        `}
      >

        {!debtSales.length ? (

          <div className="
            p-20 text-center
            text-slate-400
          ">
            No debts found
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
                      "Customer",
                      "Invoice",
                      "Total",
                      "Paid",
                      "Debt",
                      "Status",
                      "Action",
                    ].map((item) => (

                      <th
                        key={item}
                        className="
                          p-5 text-left
                        "
                      >
                        {item}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody>

                  {debtSales.map(
                    (sale) => {

                      const total =
                        Number(
                          sale.total || 0
                        );

                      const paid =
                        Number(
                          sale.paid || 0
                        );

                      const debt =
                        total - paid;

                      return (

                        <tr
                          key={sale.id}
                          className="
                            border-b border-[#1f2937]
                            hover:bg-slate-500/5
                          "
                        >

                          <td className="
                            p-5 font-bold
                          ">
                            {sale.customer}
                          </td>

                          <td className="
                            p-5 text-blue-500
                            font-bold
                          ">
                            #
                            {
                              sale.invoice || 1
                            }
                          </td>

                          <td className="
                            p-5 text-green-500
                            font-bold
                          ">
                            $
                            {total.toFixed(2)}
                          </td>

                          <td className="
                            p-5 text-cyan-400
                            font-bold
                          ">
                            $
                            {paid.toFixed(2)}
                          </td>

                          <td className="
                            p-5 text-red-500
                            font-bold
                          ">
                            $
                            {debt.toFixed(2)}
                          </td>

                          <td className="p-5">

                            <span className="
                              px-4 py-2
                              rounded-full
                              bg-yellow-600
                              text-white text-xs
                              font-bold
                            ">
                              Partial
                            </span>

                          </td>

                          <td className="p-5">

                            <button
                              onClick={() =>
                                markPaid(
                                  sale
                                )
                              }
                              className="
                                h-11 px-5
                                rounded-2xl
                                bg-green-600
                                hover:bg-green-700
                                text-white font-bold
                              "
                            >
                              Mark Paid
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            {/* Mobile */}
            <div className="
              lg:hidden
              p-4 space-y-4
            ">

              {debtSales.map(
                (sale) => {

                  const total =
                    Number(
                      sale.total || 0
                    );

                  const paid =
                    Number(
                      sale.paid || 0
                    );

                  const debt =
                    total - paid;

                  return (

                    <div
                      key={sale.id}
                      className="
                        border border-[#1f2937]
                        rounded-2xl p-5
                      "
                    >

                      <div className="
                        flex items-center
                        justify-between
                        mb-4
                      ">

                        <div>

                          <h2 className="
                            font-black text-lg
                          ">
                            {sale.customer}
                          </h2>

                          <p className="
                            text-blue-500
                            text-sm font-bold
                          ">
                            #
                            {
                              sale.invoice || 1
                            }
                          </p>

                        </div>

                        <span className="
                          px-4 py-2
                          rounded-full
                          bg-yellow-600
                          text-white text-xs
                          font-bold
                        ">
                          Partial
                        </span>

                      </div>

                      <div className="
                        grid grid-cols-3
                        gap-4 mb-4
                      ">

                        <Box
                          title="Total"
                          value={total}
                          color="text-green-500"
                          ui={ui}
                        />

                        <Box
                          title="Paid"
                          value={paid}
                          color="text-cyan-400"
                          ui={ui}
                        />

                        <Box
                          title="Debt"
                          value={debt}
                          color="text-red-500"
                          ui={ui}
                        />

                      </div>

                      <button
                        onClick={() =>
                          markPaid(
                            sale
                          )
                        }
                        className="
                          w-full h-12
                          rounded-2xl
                          bg-green-600
                          hover:bg-green-700
                          text-white font-bold
                        "
                      >
                        Mark Paid
                      </button>

                    </div>
                  );
                }
              )}

            </div>

          </>
        )}

      </div>

    </div>
  );
}

/* Mobile Box */
function Box({
  title,
  value,
  color,
  ui,
}) {

  return (

    <div>

      <p className={ui.text}>
        {title}
      </p>

      <h3 className={`
        font-black text-lg
        ${color}
      `}>
        $
        {value.toFixed(2)}
      </h3>

    </div>
  );
}

export default Debts;