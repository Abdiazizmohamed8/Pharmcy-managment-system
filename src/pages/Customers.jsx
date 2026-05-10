import { useState } from "react";

import { fmt } from "../utils/helpers";

function Customers({
  customers,
  setCustomers,
  toast,
}) {

  const [search,
    setSearch] =
    useState("");

  const [showModal,
    setShowModal] =
    useState(false);

  const [form,
    setForm] =
    useState({
      name: "",
      phone: "",
      address: "",
    });

  /* FILTER */
  const filteredCustomers =
    customers.filter(
      (customer) =>
        customer.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* TOTAL DEBT */
  const totalDebt =
    customers.reduce(
      (acc, customer) =>
        acc +
        Number(
          customer.debt ||
            0
        ),
      0
    );

  /* HANDLE CHANGE */
  const handleChange = (
    e
  ) => {

    setForm({
      ...form,

      [e.target.name]:
        e.target.value,
    });
  };

  /* ADD CUSTOMER */
  const addCustomer =
    () => {

      if (
        form.name.trim() ===
        ""
      ) {
        toast(
          "Customer name required",
          "error"
        );

        return;
      }

      const newCustomer =
        {
          id:
            Date.now(),

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
              .split(
                "T"
              )[0],
        };

      setCustomers(
        (prev) => [
          newCustomer,
          ...prev,
        ]
      );

      toast(
        "Customer added"
      );

      setForm({
        name: "",
        phone: "",
        address: "",
      });

      setShowModal(
        false
      );
    };

  /* DELETE */
  const deleteCustomer =
    (id) => {

      setCustomers(
        (prev) =>
          prev.filter(
            (customer) =>
              customer.id !==
              id
          )
      );

      toast(
        "Customer deleted"
      );
    };

  return (
    <div>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom:
            "30px",
        }}
      >

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              color: "#111827",
            }}
          >
            Customers 👥
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            Manage pharmacy customers
          </p>
        </div>

        {/* RIGHT */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems:
              "center",
          }}
        >

          {/* TOTAL DEBT */}
          <div
            style={{
              background:
                "#dc2626",

              color: "#fff",

              padding:
                "16px 24px",

              borderRadius:
                "18px",

              fontWeight:
                "bold",

              fontSize:
                "17px",
            }}
          >
            Debt:
            {" "}
            {fmt(
              totalDebt
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={() =>
              setShowModal(
                true
              )
            }
            style={{
              background:
                "#16a34a",

              color: "#fff",

              border: "none",

              padding:
                "14px 22px",

              borderRadius:
                "14px",

              fontWeight:
                "bold",

              cursor:
                "pointer",

              fontSize:
                "15px",
            }}
          >
            + Add Customer
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div
        style={{
          marginBottom:
            "24px",
        }}
      >
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
            maxWidth: "360px",
            padding:
              "14px",
            borderRadius:
              "14px",
            border:
              "1px solid #d1d5db",
            outline:
              "none",
            fontSize:
              "15px",
          }}
        />
      </div>

      {/* EMPTY */}
      {filteredCustomers.length ===
      0 ? (

        <div
          style={{
            background:
              "#fff",

            borderRadius:
              "24px",

            padding:
              "70px",

            textAlign:
              "center",

            color:
              "#9ca3af",

            fontSize:
              "18px",
          }}
        >
          No customers available
        </div>

      ) : (

        /* TABLE */
        <div
          style={{
            background:
              "#fff",

            borderRadius:
              "24px",

            overflow:
              "hidden",

            boxShadow:
              "0 8px 24px rgba(0,0,0,0.05)",
          }}
        >

          {/* HEAD */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "2fr 1fr 2fr 1fr 1fr 1fr",

              padding:
                "20px",

              background:
                "#f9fafb",

              fontWeight:
                "bold",

              color:
                "#111827",

              borderBottom:
                "1px solid #f3f4f6",
            }}
          >
            <div>
              Customer Name
            </div>

            <div>
              Phone
            </div>

            <div>
              Address
            </div>

            <div>
              Debt
            </div>

            <div>
              Joined
            </div>

            <div>
              Action
            </div>
          </div>

          {/* ROWS */}
          {filteredCustomers.map(
            (
              customer
            ) => {

              const hasDebt =
                Number(
                  customer.debt
                ) > 0;

              return (
                <div
                  key={
                    customer.id
                  }
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "2fr 1fr 2fr 1fr 1fr 1fr",

                    padding:
                      "20px",

                    alignItems:
                      "center",

                    borderBottom:
                      "1px solid #f3f4f6",
                  }}
                >

                  {/* NAME */}
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color:
                          "#111827",
                        fontSize:
                          "18px",
                      }}
                    >
                      {
                        customer.name
                      }
                    </h3>
                  </div>

                  {/* PHONE */}
                  <div
                    style={{
                      color:
                        "#6b7280",
                    }}
                  >
                    {customer.phone ||
                      "N/A"}
                  </div>

                  {/* ADDRESS */}
                  <div
                    style={{
                      color:
                        "#6b7280",
                    }}
                  >
                    {customer.address ||
                      "N/A"}
                  </div>

                  {/* DEBT */}
                  <div>

                    {hasDebt ? (

                      <span
                        style={{
                          background:
                            "#fee2e2",

                          color:
                            "#dc2626",

                          padding:
                            "8px 14px",

                          borderRadius:
                            "20px",

                          fontSize:
                            "13px",

                          fontWeight:
                            "bold",
                        }}
                      >
                        {fmt(
                          customer.debt
                        )}
                      </span>

                    ) : (

                      <span
                        style={{
                          background:
                            "#dcfce7",

                          color:
                            "#16a34a",

                          padding:
                            "8px 14px",

                          borderRadius:
                            "20px",

                          fontSize:
                            "13px",

                          fontWeight:
                            "bold",
                        }}
                      >
                        No Debt
                      </span>
                    )}
                  </div>

                  {/* JOINED */}
                  <div
                    style={{
                      color:
                        "#111827",
                    }}
                  >
                    {
                      customer.joined
                    }
                  </div>

                  {/* ACTION */}
                  <div>
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
                          "#fff",

                        border:
                          "none",

                        padding:
                          "10px 16px",

                        borderRadius:
                          "12px",

                        fontWeight:
                          "bold",

                        cursor:
                          "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && (

        <div
          style={{
            position:
              "fixed",

            inset: 0,

            background:
              "rgba(0,0,0,0.5)",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            zIndex: 999,
          }}
        >

          <div
            style={{
              background:
                "#fff",

              width: "100%",

              maxWidth:
                "520px",

              borderRadius:
                "24px",

              padding:
                "30px",
            }}
          >

            <h2
              style={{
                marginTop: 0,
                marginBottom:
                  "24px",
              }}
            >
              Add Customer
            </h2>

            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >

              <input
                type="text"
                name="name"
                placeholder="Customer name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                style={
                  inputStyle
                }
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone number"
                value={
                  form.phone
                }
                onChange={
                  handleChange
                }
                style={
                  inputStyle
                }
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
                style={
                  inputStyle
                }
              />
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                marginTop:
                  "26px",
              }}
            >

              <button
                onClick={
                  addCustomer
                }
                style={{
                  flex: 1,

                  background:
                    "#16a34a",

                  color: "#fff",

                  border: "none",

                  padding:
                    "14px",

                  borderRadius:
                    "14px",

                  fontWeight:
                    "bold",

                  cursor:
                    "pointer",

                  fontSize:
                    "15px",
                }}
              >
                Save Customer
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
                    "#f3f4f6",

                  color:
                    "#111827",

                  border: "none",

                  padding:
                    "14px",

                  borderRadius:
                    "14px",

                  fontWeight:
                    "bold",

                  cursor:
                    "pointer",

                  fontSize:
                    "15px",
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

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border:
    "1px solid #d1d5db",
  outline: "none",
  fontSize: "14px",
};

export default Customers;