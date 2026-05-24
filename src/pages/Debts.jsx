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

        // FIRESTORE UPDATE
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

        // LOCAL UPDATE
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
      p-4 md:p-6
      ${ui.bg}
    `}>

      {/* HEADER */}
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

      {/* TOP */}
      <div className="
        flex flex-col lg:flex-row
        justify-between gap-5
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
            w-full lg:max-w-md
            h-14 px-5
            rounded-2xl border
            outline-none
            ${ui.input}
          `}
        />

        {/* TOTAL */}
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

      {/* TABLE / MOBILE */}
      <div className={`
        rounded-3xl border
        overflow-hidden
        ${ui.card}
      `}>

        {!debtSales.length ? (

          <div className="
            p-20 text-center
            text-slate-400
          ">
            No debts found
          </div>

        ) : (

          <>

            {/* =========================
                DESKTOP TABLE
            ========================= */}

            <div className="
              hidden lg:block
            ">

              <table className="
                w-full
              ">

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
                          key={
                            sale.invoiceNumber
                          }
                          className="
                            border-b border-[#1f2937]
                            hover:bg-slate-500/5
                          "
                        >

                          {/* CUSTOMER */}
                          <td className="
                            p-5 font-bold
                          ">
                            {sale.customer}
                          </td>

                          {/* INVOICE */}
                          <td className="
                            p-5 text-blue-500
                            font-bold
                          ">
                            #
                            {
                              sale.invoiceNumber
                            }
                          </td>

                          {/* TOTAL */}
                          <td className="
                            p-5 text-green-500
                            font-bold
                          ">
                            $
                            {total.toFixed(2)}
                          </td>

                          {/* PAID */}
                          <td className="
                            p-5 text-cyan-400
                            font-bold
                          ">
                            $
                            {paid.toFixed(2)}
                          </td>

                          {/* DEBT */}
                          <td className="
                            p-5 text-red-500
                            font-bold
                          ">
                            $
                            {debt.toFixed(2)}
                          </td>

                          {/* STATUS */}
                          <td className="
                            p-5
                          ">

                            <span className={`
                              px-4 py-2
                              rounded-full
                              text-xs font-bold

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
                            p-5
                          ">

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

            {/* =========================
                MOBILE CARDS
            ========================= */}

            <div className="
              lg:hidden
              p-4
              space-y-4
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
                      key={
                        sale.invoiceNumber
                      }
                      className={`
                        rounded-2xl
                        border
                        p-4
                        ${ui.card}
                      `}
                    >

                      <div className="
                        flex items-center
                        justify-between
                        mb-3
                      ">

                        <h2 className="
                          font-bold text-lg
                        ">
                          {sale.customer}
                        </h2>

                        <span className={`
                          px-3 py-1
                          rounded-full
                          text-xs font-bold

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

                      </div>

                      <div className="
                        space-y-2 text-sm
                      ">

                        <p>
                          Invoice:
                          <span className="
                            ml-2 font-bold
                            text-blue-500
                          ">
                            #
                            {
                              sale.invoiceNumber
                            }
                          </span>
                        </p>

                        <p className="
                          text-green-500
                          font-bold
                        ">
                          Total:
                          ${total.toFixed(2)}
                        </p>

                        <p className="
                          text-cyan-400
                          font-bold
                        ">
                          Paid:
                          ${paid.toFixed(2)}
                        </p>

                        <p className="
                          text-red-500
                          font-bold
                        ">
                          Debt:
                          ${debt.toFixed(2)}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          markPaid(sale)
                        }
                        className="
                          mt-4
                          w-full h-11
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

export default Debts;