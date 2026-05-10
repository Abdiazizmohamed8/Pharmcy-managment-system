import { useState } from "react";

function Suppliers({
  suppliers,
  setSuppliers,
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
      contact: "",
      email: "",
      city: "",
    });

  /* FILTER */
  const filteredSuppliers =
    suppliers.filter(
      (supplier) =>
        supplier.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
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

  /* ADD SUPPLIER */
  const addSupplier =
    () => {

      if (
        form.name.trim() ===
        ""
      ) {
        toast(
          "Supplier name required",
          "error"
        );

        return;
      }

      const newSupplier =
        {
          id:
            Date.now(),

          name:
            form.name,

          contact:
            form.contact,

          email:
            form.email,

          city:
            form.city,

          joined:
            new Date()
              .toISOString()
              .split(
                "T"
              )[0],
        };

      setSuppliers(
        (prev) => [
          newSupplier,
          ...prev,
        ]
      );

      toast(
        "Supplier added"
      );

      setForm({
        name: "",
        contact: "",
        email: "",
        city: "",
      });

      setShowModal(
        false
      );
    };

  /* DELETE */
  const deleteSupplier =
    (id) => {

      setSuppliers(
        (prev) =>
          prev.filter(
            (supplier) =>
              supplier.id !==
              id
          )
      );

      toast(
        "Supplier deleted"
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
            Suppliers 🏭
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            Manage pharmacy suppliers
          </p>
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
              "14px 24px",

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
          + Add Supplier
        </button>
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
          placeholder="Search supplier..."
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
      {filteredSuppliers.length ===
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
          No suppliers available
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
              Supplier Name
            </div>

            <div>
              Contact
            </div>

            <div>
              Email
            </div>

            <div>
              City
            </div>

            <div>
              Joined
            </div>

            <div>
              Action
            </div>
          </div>

          {/* ROWS */}
          {filteredSuppliers.map(
            (
              supplier
            ) => (

              <div
                key={
                  supplier.id
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
                      supplier.name
                    }
                  </h3>
                </div>

                {/* CONTACT */}
                <div
                  style={{
                    color:
                      "#6b7280",
                  }}
                >
                  {supplier.contact ||
                    "N/A"}
                </div>

                {/* EMAIL */}
                <div
                  style={{
                    color:
                      "#6b7280",
                  }}
                >
                  {supplier.email ||
                    "N/A"}
                </div>

                {/* CITY */}
                <div
                  style={{
                    color:
                      "#111827",
                  }}
                >
                  {supplier.city ||
                    "N/A"}
                </div>

                {/* JOINED */}
                <div
                  style={{
                    color:
                      "#111827",
                  }}
                >
                  {
                    supplier.joined
                  }
                </div>

                {/* ACTION */}
                <div>
                  <button
                    onClick={() =>
                      deleteSupplier(
                        supplier.id
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
            )
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
              Add Supplier
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
                placeholder="Supplier name"
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
                name="contact"
                placeholder="Contact number"
                value={
                  form.contact
                }
                onChange={
                  handleChange
                }
                style={
                  inputStyle
                }
              />

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={
                  form.email
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
                name="city"
                placeholder="City"
                value={
                  form.city
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
                  addSupplier
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
                Save Supplier
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

export default Suppliers;