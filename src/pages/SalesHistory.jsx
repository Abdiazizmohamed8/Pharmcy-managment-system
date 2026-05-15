import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { useReactToPrint } from "react-to-print";

import { db } from "../firebase";

import { useTheme } from "../context/ThemeContext";

import Invoice from "../components/Invoice";

function SalesHistory({
  toast,
  openSidebar,
}) {
  const { darkMode } =
    useTheme();

  /* =========================
      States
  ========================= */

  const [sales, setSales] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedSale, setSelectedSale] =
    useState(null);

  /* =========================
      Invoice Ref
  ========================= */

  const invoiceRef =
    useRef();

  /* =========================
      Theme UI
  ========================= */

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

  /* =========================
      Load Sales
  ========================= */

  useEffect(() => {
    const q = query(
      collection(
        db,
        "sales"
      ),
      orderBy(
        "date",
        "asc"
      ),
      limit(100)
    );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {
          setSales(
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            )
          );

          setLoading(false);
        }
      );

    return () =>
      unsubscribe();
  }, []);

  /* =========================
      Filter Sales
  ========================= */

  const filteredSales =
    useMemo(() => {
      const text =
        search.toLowerCase();

      return sales.filter(
        (sale) =>
          sale.customer
            ?.toLowerCase()
            .includes(text) ||

          sale.method
            ?.toLowerCase()
            .includes(text) ||

          sale.id
            ?.toLowerCase()
            .includes(text)
      );
    }, [sales, search]);

  /* =========================
      Delete Sale
  ========================= */

  const deleteSale =
    async (id) => {
      if (
        !window.confirm(
          "Delete this sale?"
        )
      )
        return;

      try {
        await deleteDoc(
          doc(
            db,
            "sales",
            id
          )
        );

        setSales((prev) =>
          prev.filter(
            (sale) =>
              sale.id !== id
          )
        );

        toast?.(
          "Sale deleted",
          "success"
        );
      } catch (error) {
        console.log(error);

        toast?.(
          "Delete failed",
          "error"
        );
      }
    };

  /* =========================
      View Invoice
  ========================= */

  const handleView = (
    sale
  ) => {
    setSelectedSale(sale);
  };

  /* =========================
      Print Invoice
  ========================= */

  const handlePrint =
    useReactToPrint({
      content: () =>
        invoiceRef.current,
    });

  /* =========================
      Loading Screen
  ========================= */

  if (loading) {
    return (
      <div
        className={`
          min-h-screen
          flex items-center
          justify-center
          text-2xl font-bold
          ${ui.bg}
        `}
      >
        Loading sales...
      </div>
    );
  }

  return (
    <div
      className={`
        min-h-screen
        p-4 md:p-6
        ${ui.bg}
      `}
    >
      {/* Header */}
      <div
        className="
        flex items-center gap-4
        mb-6
      "
      >
        {/* Mobile Sidebar */}
        <button
          onClick={
            openSidebar
          }
          className={`
            md:hidden
            w-12 h-12
            rounded-2xl
            border text-xl
            ${ui.card}
          `}
        >
          ☰
        </button>

        <div>
          <h1
            className="
            text-3xl md:text-5xl
            font-black
          "
          >
            Sales History 📋
          </h1>

          <p className={ui.text}>
            Latest pharmacy sales
          </p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search sales..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className={`
          w-full h-14
          px-5 mb-6
          rounded-2xl border
          outline-none
          ${ui.input}
        `}
      />

      {/* Table */}
      <div
        className={`
          rounded-3xl border
          overflow-hidden
          overflow-x-auto
          ${ui.card}
        `}
      >
        {!filteredSales.length ? (
          <div
            className="
            p-20 text-center
            text-slate-400
          "
          >
            No sales found
          </div>
        ) : (
          <table className="w-full min-w-[1000px]">
            {/* Table Header */}
            <thead>
              <tr
                className="
                border-b border-[#1e293b]
                text-slate-400 text-sm
              "
              >
                {[
                  "Invoice",
                  "Customer",
                  "Total",
                  "Paid",
                  "Debt",
                  "Payment",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="
                    p-4 text-left
                  "
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredSales.map(
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
                      border-b border-[#1e293b]
                      hover:bg-slate-500/5
                    "
                    >
                      {/* Invoice */}
                      <td
                        className="
                        p-4 font-bold
                        text-blue-500
                      "
                      >
                        #
                        {
                          sale.invoiceNumber
                        }
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <h2 className="font-bold">
                          {
                            sale.customer
                          }
                        </h2>

                        <p
                          className="
                          text-xs
                          text-slate-400
                          mt-1
                        "
                        >
                          {sale.date?.slice(
                            0,
                            10
                          )}
                        </p>
                      </td>

                      {/* Total */}
                      <td
                        className="
                        p-4 font-bold
                        text-green-500
                      "
                      >
                        $
                        {total.toFixed(
                          2
                        )}
                      </td>

                      {/* Paid */}
                      <td
                        className="
                        p-4 font-bold
                        text-blue-500
                      "
                      >
                        $
                        {paid.toFixed(
                          2
                        )}
                      </td>

                      {/* Debt */}
                      <td
                        className="
                        p-4 font-bold
                        text-red-500
                      "
                      >
                        $
                        {debt.toFixed(
                          2
                        )}
                      </td>

                      {/* Payment */}
                      <td className="p-4">
                        <span
                          className="
                          px-4 py-2
                          rounded-full
                          bg-red-700
                          text-white
                          text-xs font-bold
                        "
                        >
                          {
                            sale.method
                          }
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`
                            px-4 py-2
                            rounded-full
                            text-xs font-bold
                            text-white
                            ${
                              debt > 0
                                ? "bg-yellow-600"
                                : "bg-green-700"
                            }
                          `}
                        >
                          {debt > 0
                            ? "Partial"
                            : "Paid"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div
                          className="
                          flex items-center
                          gap-2 flex-wrap
                        "
                        >
                          {/* View */}
                          <button
                            onClick={() =>
                              handleView(
                                sale
                              )
                            }
                            className="
                              h-10 px-4
                              rounded-xl
                              bg-blue-600
                              hover:bg-blue-700
                              text-white
                              text-sm font-bold
                            "
                          >
                            View
                          </button>

                          {/* Print */}
                          <button
                            onClick={() => {
                              setSelectedSale(
                                sale
                              );

                              setTimeout(
                                () => {
                                  handlePrint();
                                },
                                300
                              );
                            }}
                            className="
                              h-10 px-4
                              rounded-xl
                              bg-green-600
                              hover:bg-green-700
                              text-white
                              text-sm font-bold
                            "
                          >
                            Print
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              deleteSale(
                                sale.id
                              )
                            }
                            className="
                              h-10 px-4
                              rounded-xl
                              bg-red-600
                              hover:bg-red-700
                              text-white
                              text-sm font-bold
                            "
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedSale && (
        <div
          className="
          fixed inset-0
          z-[999]
          bg-black/70
          overflow-y-auto
          p-4
        "
        >
          <div
            className="
            max-w-6xl mx-auto
            bg-white
            rounded-3xl
            overflow-hidden
          "
          >
            {/* Top Buttons */}
            <div
              className="
              flex items-center
              justify-end
              gap-3 p-4
              border-b
            "
            >
              <button
                onClick={
                  handlePrint
                }
                className="
                  h-11 px-5
                  rounded-xl
                  bg-green-600
                  hover:bg-green-700
                  text-white font-bold
                "
              >
                Print Invoice
              </button>

              <button
                onClick={() =>
                  setSelectedSale(
                    null
                  )
                }
                className="
                  h-11 px-5
                  rounded-xl
                  bg-red-600
                  hover:bg-red-700
                  text-white font-bold
                "
              >
                Close
              </button>
            </div>

            {/* Invoice */}
            <Invoice
              ref={invoiceRef}
              cart={
                selectedSale.cart ||
                []
              }
              customerName={
                selectedSale.customer
              }
              customerPhone={
                selectedSale.phone
              }
              total={Number(
                selectedSale.total ||
                  0
              )}
              subtotal={Number(
                selectedSale.subtotal ||
                  0
              )}
              taxAmount={Number(
                selectedSale.taxAmount ||
                  0
              )}
              discount={Number(
                selectedSale.discount ||
                  0
              )}
              paid={Number(
                selectedSale.paid ||
                  0
              )}
              debt={
                Number(
                  selectedSale.total ||
                    0
                ) -
                Number(
                  selectedSale.paid ||
                    0
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesHistory;