import {
  useMemo,
  useState,
} from "react";

import {
  doc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

function Customers({
  customers = [],
  sales = [],
  setCustomers,
  openSidebar,
  toast,
}) {

  const { darkMode } =
    useTheme();

  /* =========================
      THEME
  ========================= */

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

  /* =========================
      STATES
  ========================= */

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState(null);

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      address: "",
    });

  /* =========================
      FILTER CUSTOMERS
  ========================= */

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

  /* =========================
      ADD CUSTOMER
  ========================= */

  const addCustomer =
    async () => {

      if (!form.name) {

        toast?.(
          "Customer name required",
          "warning"
        );

        return;
      }

      try {

        const newCustomer = {
          ...form,

          date:
            new Date()
              .toISOString()
              .slice(0, 10),
        };

        const docRef =
          await addDoc(

            collection(
              db,
              "customers"
            ),

            newCustomer
          );

        setCustomers([
          ...customers,

          {
            id: docRef.id,
            ...newCustomer,
          },
        ]);

        setForm({
          name: "",
          phone: "",
          address: "",
        });

        setShowModal(false);

        toast?.(
          "Customer added",
          "success"
        );

      } catch {

        toast?.(
          "Add failed",
          "error"
        );
      }
    };

  /* =========================
      DELETE CUSTOMER
  ========================= */

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
            (c) =>
              c.id !== id
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

      {/* HEADER */}
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

      {/* TOP */}
      <div className="
        flex flex-col lg:flex-row
        justify-between gap-4
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

        <div className="
          flex flex-wrap gap-4
        ">

          {/* ADD */}
          <button
            onClick={() =>
              setShowModal(true)
            }
            className="
              h-14 px-6
              rounded-2xl
              bg-green-600
              hover:bg-green-700
              text-white font-bold
            "
          >
            Add Customer
          </button>

          {/* TOTAL */}
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

      </div>

      {/* TABLE */}
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
              w-full min-w-[1000px]
            ">

              {/* HEADER */}
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

              {/* BODY */}
              <tbody>

                {filtered.map(
                  (c) => {

                    // CUSTOMER SALES
                    const customerSales =
                      sales.filter(
                        (sale) =>

                          sale.customer ===
                          c.name
                      );

                    // TOTAL DEBT
                    const debt =
                      customerSales.reduce(

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

                    return (

                      <tr
                        key={c.id}
                        className="
                          border-b border-[#1e293b]
                          hover:bg-slate-500/5
                        "
                      >

                        {/* CUSTOMER */}
                        <td className="
                          p-5
                        ">

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

                              {
                                c.name?.charAt(0)
                              }

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
                                {c.date || "-"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PHONE */}
                        <td className="
                          p-5
                        ">
                          {c.phone || "-"}
                        </td>

                        {/* ADDRESS */}
                        <td className="
                          p-5
                        ">
                          {c.address || "-"}
                        </td>

                        {/* DEBT */}
                        <td className="
                          p-5
                        ">

                          <span className={`
                            px-4 py-2
                            rounded-full
                            text-sm font-semibold

                            ${
                              debt > 0

                                ? "bg-red-500/10 text-red-400"

                                : "bg-green-500/10 text-green-400"
                            }
                          `}>

                            $
                            {debt.toFixed(2)}

                          </span>

                        </td>

                        {/* STATUS */}
                        <td className="
                          p-5
                        ">

                          <span className={`
                            px-4 py-2
                            rounded-full
                            text-sm font-semibold

                            ${
                              debt > 0

                                ? "bg-yellow-500/10 text-yellow-400"

                                : "bg-green-500/10 text-green-400"
                            }
                          `}>

                            {
                              debt > 0
                                ? "Partial"
                                : "Paid"
                            }

                          </span>

                        </td>

                        {/* ACTION */}
                        <td className="
                          p-5
                        ">

                          <div className="
                            flex gap-2
                          ">

                            <button
                              onClick={() =>
                                setSelectedCustomer(c)
                              }
                              className="
                                h-11 px-5
                                rounded-2xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                text-sm font-semibold
                              "
                            >
                              View
                            </button>

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

                          </div>

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

      {/* ADD MODAL */}
      {showModal && (

        <div className="
          fixed inset-0
          bg-black/60
          z-[999]
          flex items-center
          justify-center
          p-4
        ">

          <div className={`
            w-full max-w-lg
            rounded-3xl
            p-6 border
            ${ui.card}
          `}>

            <h2 className="
              text-2xl font-black
              mb-5
            ">
              Add Customer
            </h2>

            <div className="
              space-y-4
            ">

              <input
                type="text"
                placeholder="Customer name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
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

              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone:
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

              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address:
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

            </div>

            {/* ACTIONS */}
            <div className="
              flex justify-end
              gap-3 mt-6
            ">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  h-12 px-5
                  rounded-2xl
                  bg-slate-500
                  text-white font-bold
                "
              >
                Cancel
              </button>

              <button
                onClick={addCustomer}
                className="
                  h-12 px-5
                  rounded-2xl
                  bg-green-600
                  hover:bg-green-700
                  text-white font-bold
                "
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Customers;