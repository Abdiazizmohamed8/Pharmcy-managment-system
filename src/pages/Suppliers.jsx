import {
  useState,
} from "react";

function Suppliers({
  suppliers = [],
  setSuppliers,
  toast,
  darkMode = false,
}) {

  /* =========================
     STATES
  ========================= */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    contact: "",
    email: "",
    city: "",
  });

  /* =========================
     FILTER
  ========================= */

  const filteredSuppliers =
    suppliers.filter(
      (supplier) =>
        supplier.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
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
     ADD SUPPLIER
  ========================= */

  const addSupplier =
    () => {

      if (
        form.name.trim() ===
        ""
      ) {

        toast?.(
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

      toast?.(
        "Supplier added",
        "success"
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

  /* =========================
     DELETE
  ========================= */

  const deleteSupplier =
    (id) => {

      const confirmDelete =
        window.confirm(
          "Delete supplier?"
        );

      if (
        !confirmDelete
      )
        return;

      setSuppliers(
        (prev) =>
          prev.filter(
            (supplier) =>
              supplier.id !==
              id
          )
      );

      toast?.(
        "Supplier deleted",
        "success"
      );
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

          gap: "18px",

          marginBottom:
            "30px",
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,

              fontSize:
                "38px",

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            Suppliers 🏭
          </h1>

          <p
            style={{
              marginTop:
                "10px",

              color:
                darkMode
                  ? "#d1d5db"
                  : "#6b7280",

              fontSize:
                "16px",
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

            color: "#ffffff",

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

            maxWidth:
              "360px",

            padding:
              "14px",

            borderRadius:
              "14px",

            border:
              darkMode

                ? "1px solid #374151"

                : "1px solid #d1d5db",

            outline:
              "none",

            fontSize:
              "15px",

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            color:
              darkMode
                ? "#ffffff"
                : "#111827",
          }}
        />
      </div>

      {/* EMPTY */}

      {filteredSuppliers.length ===
      0 ? (

        <div
          style={{
            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            borderRadius:
              "24px",

            padding:
              "70px",

            textAlign:
              "center",

            color:
              darkMode
                ? "#d1d5db"
                : "#9ca3af",

            fontSize:
              "18px",

            border:
              darkMode
                ? "1px solid #1f2937"
                : "1px solid #e5e7eb",
          }}
        >
          No suppliers available
        </div>

      ) : (

        /* TABLE */

        <div
          style={{
            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            borderRadius:
              "24px",

            overflow:
              "hidden",

            border:
              darkMode
                ? "1px solid #1f2937"
                : "1px solid #e5e7eb",

            boxShadow:
              darkMode
                ? "0 4px 20px rgba(0,0,0,0.35)"
                : "0 8px 24px rgba(0,0,0,0.05)",
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
                darkMode
                  ? "#0f172a"
                  : "#f9fafb",

              fontWeight:
                "bold",

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",

              borderBottom:
                darkMode

                  ? "1px solid #1f2937"

                  : "1px solid #f3f4f6",
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
                    darkMode

                      ? "1px solid #1f2937"

                      : "1px solid #f3f4f6",
                }}
              >

                {/* NAME */}

                <div>

                  <h3
                    style={{
                      margin: 0,

                      color:
                        darkMode
                          ? "#ffffff"
                          : "#111827",

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
                      darkMode
                        ? "#d1d5db"
                        : "#6b7280",
                  }}
                >
                  {supplier.contact ||
                    "N/A"}
                </div>

                {/* EMAIL */}

                <div
                  style={{
                    color:
                      darkMode
                        ? "#d1d5db"
                        : "#6b7280",
                  }}
                >
                  {supplier.email ||
                    "N/A"}
                </div>

                {/* CITY */}

                <div
                  style={{
                    color:
                      darkMode
                        ? "#ffffff"
                        : "#111827",
                  }}
                >
                  {supplier.city ||
                    "N/A"}
                </div>

                {/* JOINED */}

                <div
                  style={{
                    color:
                      darkMode
                        ? "#ffffff"
                        : "#111827",
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
                        "#ffffff",

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
              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",

              width: "100%",

              maxWidth:
                "520px",

              borderRadius:
                "24px",

              padding:
                "30px",

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
                  "24px",

                color:
                  darkMode
                    ? "#ffffff"
                    : "#111827",
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

                style={inputStyle(
                  darkMode
                )}
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

                style={inputStyle(
                  darkMode
                )}
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

                style={inputStyle(
                  darkMode
                )}
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

                style={inputStyle(
                  darkMode
                )}
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
                    darkMode
                      ? "#1f2937"
                      : "#f3f4f6",

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

/* =========================
   INPUT STYLE
========================= */

const inputStyle = (
  darkMode
) => ({
  width: "100%",

  padding: "14px",

  borderRadius:
    "12px",

  border:
    darkMode

      ? "1px solid #374151"

      : "1px solid #d1d5db",

  outline: "none",

  fontSize:
    "14px",

  background:
    darkMode
      ? "#0f172a"
      : "#ffffff",

  color:
    darkMode
      ? "#ffffff"
      : "#111827",

  boxSizing:
    "border-box",
});

export default Suppliers;