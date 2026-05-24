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

  /* =========================
      THEME
  ========================= */

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

  /* =========================
      SEARCH
  ========================= */

  const [search, setSearch] =
    useState("");

  /* =========================
      FILTER DEBTS
  ========================= */

  const debtSales =
    useMemo(() => {

      return sales.filter(
        (sale) => {

          const debt =
            Number(
              sale.total || 0
            ) -
            Number(
              sale.paid || 0
            );

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

  /* =========================
      TOTAL DEBT
  ========================= */

  const totalDebt =
    debtSales.reduce(

      (sum, sale) =>

        sum +

        (
          Number(
            sale.total || 0
          ) -

          Number(
            sale.paid || 0
          )
        ),

      0
    );

  /* =========================
      MARK PAID
  ========================= */

  const markPaid =
    async (sale) => {

      try {

        const total =
          Number(
            sale.total || 0
          );

        await updateDoc(

          doc(
            db,
            "sales",
            String(
              sale.invoiceNumber
            )
          ),

          {
            paid: total,
            debt: 0,
            status: "Paid",
          }
        );

        setSales(

          sales.map(
            (item) =>

              item.invoiceNumber ===
              sale.invoiceNumber

                ? {
                    ...item,
                    paid: total,
                    debt: 0,
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

    <div className={`
      min-h-screen
      p-3 sm:p-4 md:p-6
      ${ui.bg}
    `}>

      {/* HEADER */}
      <div className="
        flex items-center gap-3
        mb-5 md:mb-7
      ">

        <button
          onClick={openSidebar}
          className={`
            lg:hidden
            w-11 h-11
            rounded-2xl border
            text-xl
            flex items-center
            justify-center
            ${ui.card}
          `}
        >
          ☰
        </button>

        <div>

          <h1 className="
            text-2xl sm:text-3xl
            md:text-5xl
            font-black
          ">
            Debts 💳
          </h1>

          <p className={`
            text-sm md:text-base
            ${ui.text}
          `}>
            Customer debts management
          </p>

        </div>

      </div>

      {/* TOP BAR */}
      <div className="
        flex flex-col
        xl:flex-row
        gap-4
        justify-between
        mb-6
      ">

        {/* SEARCH */}
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
            w-full
            xl:max-w-md
            h-12 md:h-14
            px-4 md:px-5
            rounded-2xl border
            outline-none
            text-sm md:text-base
            ${ui.input}
          `}
        />

        {/* TOTAL CARD */}
        <div className="
          bg-red-600 text-white
          rounded-3xl
          px-6 py-5
          text-center
          w-full xl:w-[260px]
        ">

          <p className="
            text-sm opacity-90
          ">
            Total Debt
          </p>

          <h2 className="
            text-3xl md:text-5xl
            font-black mt-2
            break-all
          ">
            $
            {totalDebt.toFixed(2)}
          </h2>

        </div>

      </div>

      {/* TABLE CONTAINER */}
      <div className={`
        rounded-3xl border
        overflow-hidden
        ${ui.card}
      `}>

        {!debtSales.length ? (

          <div className="
            p-10 md:p-20
            text-center
            text-slate-400
          ">
            No debts found
          </div>

        ) : (

          <div className="
            overflow-x-auto
            w-full
          ">

            <table className="
              w-full
              min-w-[750px]
            ">

              {/* TABLE HEAD */}
              <thead>

                <tr className="
                  border-b border-[#1f2937]
                  text-slate-400
                  text-xs md:text-sm
                  bg-black/5
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
                        p-3 md:p-5
                        text-left
                        whitespace-nowrap
                      "
                    >
                      {item}
                    </th>

                  ))}

                </tr>

              </thead>

              {/* TABLE BODY */}
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
                        key={
                          sale.invoiceNumber
                        }
                        className="
                          border-b border-[#1f2937]
                          hover:bg-slate-500/5
                          transition
                        "
                      >

                        {/* CUSTOMER */}
                        <td className="
                          p-3 md:p-5
                          font-bold
                          whitespace-nowrap
                          text-sm md:text-base
                        ">
                          {sale.customer}
                        </td>

                        {/* INVOICE */}
                        <td className="
                          p-3 md:p-5
                          text-blue-500
                          font-bold
                          whitespace-nowrap
                          text-sm md:text-base
                        ">

                          #
                          {
                            sale.invoiceNumber
                          }

                        </td>

                        {/* TOTAL */}
                        <td className="
                          p-3 md:p-5
                          text-green-500
                          font-bold
                          whitespace-nowrap
                          text-sm md:text-base
                        ">

                          $
                          {total.toFixed(2)}

                        </td>

                        {/* PAID */}
                        <td className="
                          p-3 md:p-5
                          text-cyan-400
                          font-bold
                          whitespace-nowrap
                          text-sm md:text-base
                        ">

                          $
                          {paid.toFixed(2)}

                        </td>

                        {/* DEBT */}
                        <td className="
                          p-3 md:p-5
                          text-red-500
                          font-bold
                          whitespace-nowrap
                          text-sm md:text-base
                        ">

                          $
                          {debt.toFixed(2)}

                        </td>

                        {/* STATUS */}
                        <td className="
                          p-3 md:p-5
                        ">

                          <span className={`
                            px-3 md:px-4
                            py-2
                            rounded-full
                            text-[10px] md:text-xs
                            font-bold
                            whitespace-nowrap

                            ${
                              debt > 0
                                ? "bg-yellow-600 text-white"
                                : "bg-green-600 text-white"
                            }
                          `}>

                            {
                              debt > 0
                                ? "Debt"
                                : "Paid"
                            }

                          </span>

                        </td>

                        {/* ACTION */}
                        <td className="
                          p-3 md:p-5
                        ">

                          <button
                            onClick={() =>
                              markPaid(
                                sale
                              )
                            }
                            className="
                              h-10 md:h-11
                              px-4 md:px-5
                              rounded-xl md:rounded-2xl
                              bg-green-600
                              hover:bg-green-700
                              text-white
                              text-xs md:text-sm
                              font-bold
                              whitespace-nowrap
                              transition
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
        )}

      </div>

    </div>
  );
}

export default Debts;