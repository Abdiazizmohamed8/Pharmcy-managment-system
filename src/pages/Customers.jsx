import {
  useState,
  useEffect,
} from "react";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import {
  db,
} from "../firebase";

function Customers({
  darkMode = false,
  toast,
}) {

  /* =========================
     STATES
  ========================= */

  const [
    customers,
    setCustomers,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    phone: "",
    address: "",
  });

  /* =========================
     FIREBASE REALTIME
  ========================= */

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        collection(
          db,
          "customers"
        ),

        (snapshot) => {

          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setCustomers(
            data
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* =========================
     FILTER
  ========================= */

  const filteredCustomers =
    customers.filter(
      (customer) => {

        const text =
          search
            .toLowerCase()
            .trim();

        return (
          customer.name
            ?.toLowerCase()
            .includes(text) ||

          customer.phone
            ?.toLowerCase()
            .includes(text) ||

          customer.address
            ?.toLowerCase()
            .includes(text)
        );
      }
    );

  /* =========================
     TOTAL DEBT
  ========================= */

  const totalDebt =
    customers.reduce(
      (
        acc,
        customer
      ) =>

        acc +
        Number(
          customer.debt || 0
        ),

      0
    );

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange =
    (e) => {

      setForm({
        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  /* =========================
     ADD CUSTOMER
  ========================= */

  const addCustomer =
    async () => {

      if (
        !form.name
      ) {

        toast?.(
          "Customer name required",
          "error"
        );

        return;
      }

      try {

        setLoading(true);

        const newCustomer =
          {
            name:
              form.name,

            phone:
              form.phone,

            address:
              form.address,

            debt: 0,

            joined:
              new Date()
                .toISOString()
                .split("T")[0],

            createdAt:
              Date.now(),
          };

        await addDoc(
          collection(
            db,
            "customers"
          ),

          newCustomer
        );

        toast?.(
          "Customer added",
          "success"
        );

        setForm({
          name: "",
          phone: "",
          address: "",
        });

        setShowModal(
          false
        );

      } catch (error) {

        console.log(
          error
        );

        toast?.(
          "Failed to add customer",
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

  /* =========================
     DELETE CUSTOMER
  ========================= */

  const deleteCustomer =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete customer?"
        );

      if (
        !confirmDelete
      )
        return;

      try {

        await deleteDoc(
          doc(
            db,
            "customers",
            id
          )
        );

        toast?.(
          "Customer deleted",
          "success"
        );

      } catch (error) {

        console.log(
          error
        );

        toast?.(
          "Delete failed",
          "error"
        );
      }
    };

  return (
    <div
      style={{
        minHeight:
          "100vh",

        width: "100%",

        background:
          darkMode
            ? "#020617"
            : "#f3f4f6",

        color:
          darkMode
            ? "#ffffff"
            : "#111827",

        padding:
          "24px",

        boxSizing:
          "border-box",

        transition:
          "0.3s ease",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          flexWrap:
            "wrap",

          gap: "16px",

          marginBottom:
            "24px",
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,

              fontSize:
                "34px",

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            Customers 👥
          </h1>

          <p
            style={{
              marginTop:
                "8px",

              color:
                darkMode
                  ? "#d1d5db"
                  : "#6b7280",
            }}
          >
            Manage pharmacy customers
          </p>
        </div>

        <div
          style={{
            display: "flex",

            gap: "14px",

            flexWrap:
              "wrap",
          }}
        >

          {/* TOTAL DEBT */}

          <div
            style={{
              background:
                "#dc2626",

              color:
                "#ffffff",

              padding:
                "14px 20px",

              borderRadius:
                "16px",

              fontWeight:
                "bold",

              minWidth:
                "160px",

              textAlign:
                "center",
            }}
          >
            Debt: $
            {totalDebt.toFixed(
              2
            )}
          </div>

          {/* ADD BUTTON */}

          <button
            onClick={() =>
              setShowModal(
                true
              )
            }

            style={{
              background:
                "#16a34a",

              color:
                "#ffffff",

              border:
                "none",

              padding:
                "14px 18px",

              borderRadius:
                "14px",

              fontWeight:
                "bold",

              cursor:
                "pointer",
            }}
          >
            + Add Customer
          </button>
        </div>
      </div>

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

        style={{
          width: "100%",

          maxWidth:
            "420px",

          padding:
            "14px",

          borderRadius:
            "14px",

          border:
            darkMode

              ? "1px solid #374151"

              : "1px solid #d1d5db",

          background:
            darkMode

              ? "#111827"

              : "#ffffff",

          color:
            darkMode

              ? "#ffffff"

              : "#111827",

          outline:
            "none",

          marginBottom:
            "22px",

          boxSizing:
            "border-box",
        }}
      />

      {/* TABLE */}

      <div
        style={{
          overflowX:
            "auto",

          borderRadius:
            "22px",

          background:
            darkMode
              ? "#111827"
              : "#ffffff",

          border:
            darkMode
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",

          boxShadow:
            darkMode
              ? "0 4px 20px rgba(0,0,0,0.35)"
              : "0 4px 18px rgba(0,0,0,0.05)",
        }}
      >

        <table
          style={{
            width: "100%",

            minWidth:
              "850px",

            borderCollapse:
              "collapse",
          }}
        >

          <thead
            style={{
              background:
                darkMode
                  ? "#0f172a"
                  : "#f9fafb",
            }}
          >

            <tr>

              {[
                "Customer",
                "Phone",
                "Address",
                "Debt",
                "Joined",
                "Action",
              ].map(
                (
                  item
                ) => (

                  <th
                    key={
                      item
                    }

                    style={th(
                      darkMode
                    )}
                  >
                    {item}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>

            {filteredCustomers.length ===
            0 ? (

              <tr>

                <td
                  colSpan="6"

                  style={{
                    padding:
                      "60px",

                    textAlign:
                      "center",

                    color:
                      darkMode
                        ? "#d1d5db"
                        : "#6b7280",
                  }}
                >
                  No customers found
                </td>
              </tr>

            ) : (

              filteredCustomers.map(
                (
                  customer
                ) => {

                  const hasDebt =
                    Number(
                      customer.debt
                    ) > 0;

                  return (
                    <tr
                      key={
                        customer.id
                      }

                      style={{
                        borderBottom:
                          darkMode

                            ? "1px solid #374151"

                            : "1px solid #f3f4f6",
                      }}
                    >

                      <td
                        style={td(
                          darkMode
                        )}
                      >

                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: "12px",
                          }}
                        >

                          <div
                            style={{
                              width:
                                "44px",

                              height:
                                "44px",

                              borderRadius:
                                "50%",

                              background:
                                "#16a34a",

                              color:
                                "#ffffff",

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              fontWeight:
                                "bold",
                            }}
                          >
                            {customer.name
                              ?.charAt(
                                0
                              )
                              ?.toUpperCase()}
                          </div>

                          <div>

                            <div
                              style={{
                                fontWeight:
                                  "bold",

                                color:
                                  darkMode
                                    ? "#ffffff"
                                    : "#111827",
                              }}
                            >
                              {
                                customer.name
                              }
                            </div>

                            <div
                              style={{
                                fontSize:
                                  "12px",

                                color:
                                  darkMode
                                    ? "#d1d5db"
                                    : "#6b7280",
                              }}
                            >
                              Customer
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        style={td(
                          darkMode
                        )}
                      >
                        {customer.phone ||
                          "N/A"}
                      </td>

                      <td
                        style={td(
                          darkMode
                        )}
                      >
                        {customer.address ||
                          "N/A"}
                      </td>

                      <td
                        style={td(
                          darkMode
                        )}
                      >

                        {hasDebt ? (

                          <span
                            style={{
                              background:
                                darkMode
                                  ? "#7f1d1d"
                                  : "#fee2e2",

                              color:
                                "#dc2626",

                              padding:
                                "8px 12px",

                              borderRadius:
                                "999px",

                              fontWeight:
                                "bold",

                              fontSize:
                                "12px",
                            }}
                          >
                            $
                            {Number(
                              customer.debt
                            ).toFixed(
                              2
                            )}
                          </span>

                        ) : (

                          <span
                            style={{
                              background:
                                darkMode
                                  ? "#14532d"
                                  : "#dcfce7",

                              color:
                                "#16a34a",

                              padding:
                                "8px 12px",

                              borderRadius:
                                "999px",

                              fontWeight:
                                "bold",

                              fontSize:
                                "12px",
                            }}
                          >
                            No Debt
                          </span>
                        )}
                      </td>

                      <td
                        style={td(
                          darkMode
                        )}
                      >
                        {
                          customer.joined
                        }
                      </td>

                      <td
                        style={td(
                          darkMode
                        )}
                      >

                        <button
                          onClick={() =>
                            deleteCustomer(
                              customer.id
                            )
                          }

                          style={{
                            background:
                              "#dc2626",

                            color:
                              "#ffffff",

                            border:
                              "none",

                            padding:
                              "10px 14px",

                            borderRadius:
                              "10px",

                            cursor:
                              "pointer",

                            fontWeight:
                              "bold",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}

      {showModal && (

        <div
          style={{
            position:
              "fixed",

            inset: 0,

            background:
              "rgba(0,0,0,0.6)",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            zIndex: 999,

            padding:
              "20px",
          }}
        >

          <div
            style={{
              width: "100%",

              maxWidth:
                "450px",

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",

              borderRadius:
                "24px",

              padding:
                "24px",

              border:
                darkMode
                  ? "1px solid #1f2937"
                  : "1px solid #e5e7eb",
            }}
          >

            <h2
              style={{
                marginTop: 0,

                marginBottom:
                  "20px",

                color:
                  darkMode
                    ? "#ffffff"
                    : "#111827",
              }}
            >
              Add Customer
            </h2>

            <input
              type="text"

              name="name"

              placeholder="Customer Name"

              value={
                form.name
              }

              onChange={
                handleChange
              }

              style={input(
                darkMode
              )}
            />

            <input
              type="text"

              name="phone"

              placeholder="Phone Number"

              value={
                form.phone
              }

              onChange={
                handleChange
              }

              style={input(
                darkMode
              )}
            />

            <input
              type="text"

              name="address"

              placeholder="Address"

              value={
                form.address
              }

              onChange={
                handleChange
              }

              style={input(
                darkMode
              )}
            />

            <div
              style={{
                display: "flex",

                gap: "12px",

                marginTop:
                  "20px",
              }}
            >

              <button
                onClick={
                  addCustomer
                }

                disabled={
                  loading
                }

                style={{
                  flex: 1,

                  background:
                    "#16a34a",

                  color:
                    "#ffffff",

                  border:
                    "none",

                  padding:
                    "14px",

                  borderRadius:
                    "14px",

                  fontWeight:
                    "bold",

                  cursor:
                    "pointer",

                  opacity:
                    loading
                      ? 0.7
                      : 1,
                }}
              >
                {loading
                  ? "Saving..."
                  : "Save"}
              </button>

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }

                style={{
                  flex: 1,

                  background:
                    darkMode
                      ? "#1f2937"
                      : "#e5e7eb",

                  color:
                    darkMode
                      ? "#ffffff"
                      : "#111827",

                  border:
                    "none",

                  padding:
                    "14px",

                  borderRadius:
                    "14px",

                  fontWeight:
                    "bold",

                  cursor:
                    "pointer",
                }}
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

/* =========================
   STYLES
========================= */

const th = (
  darkMode
) => ({
  textAlign: "left",
  padding: "16px",
  color:
    darkMode
      ? "#ffffff"
      : "#374151",
});

const td = (
  darkMode
) => ({
  padding: "16px",
  fontSize: "14px",
  color:
    darkMode
      ? "#ffffff"
      : "#111827",
});

const input = (
  darkMode
) => ({
  width: "100%",
  padding: "14px",
  borderRadius:
    "14px",

  border:
    darkMode

      ? "1px solid #374151"

      : "1px solid #d1d5db",

  marginBottom:
    "14px",

  background:
    darkMode
      ? "#0f172a"
      : "#ffffff",

  color:
    darkMode
      ? "#ffffff"
      : "#111827",

  outline: "none",

  boxSizing:
    "border-box",
});

export default Customers;