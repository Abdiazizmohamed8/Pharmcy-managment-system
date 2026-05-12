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

    <div style={{
      ...styles.container,

      background:
        darkMode
          ? "#020617"
          : "#f3f4f6",

      color:
        darkMode
          ? "#ffffff"
          : "#111827",
    }}>

      {/* HEADER */}

      <div style={styles.header}>

        {/* LEFT */}

        <div>

          <h1 style={{
            ...styles.title,

            color:
              darkMode
                ? "#ffffff"
                : "#111827",
          }}>
            Suppliers 🏭
          </h1>

          <p style={{
            ...styles.subtitle,

            color:
              darkMode
                ? "#d1d5db"
                : "#6b7280",
          }}>
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

          style={
            styles.addButton
          }
        >
          + Add Supplier
        </button>

      </div>

      {/* SEARCH */}

      <div style={styles.searchWrapper}>

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
            ...styles.searchInput,

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
          }}
        />

      </div>

      {/* EMPTY */}

      {
        filteredSuppliers.length ===
        0 ? (

          <div style={{
            ...styles.emptyCard,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            border:
              darkMode
                ? "1px solid #1f2937"
                : "1px solid #e5e7eb",

            color:
              darkMode
                ? "#d1d5db"
                : "#9ca3af",
          }}>
            No suppliers available
          </div>

        ) : (

          /* TABLE */

          <div style={{
            ...styles.tableWrapper,

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
                : "0 8px 24px rgba(0,0,0,0.05)",
          }}>

            {/* HEAD */}

            <div style={{
              ...styles.tableHead,

              background:
                darkMode
                  ? "#0f172a"
                  : "#f9fafb",

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",

              borderBottom:
                darkMode

                  ? "1px solid #1f2937"

                  : "1px solid #f3f4f6",
            }}>

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

            {
              filteredSuppliers.map(
                (
                  supplier
                ) => (

                  <div
                    key={
                      supplier.id
                    }

                    style={{
                      ...styles.row,

                      borderBottom:
                        darkMode

                          ? "1px solid #1f2937"

                          : "1px solid #f3f4f6",
                    }}
                  >

                    {/* NAME */}

                    <div>

                      <h3 style={{
                        margin: 0,

                        color:
                          darkMode
                            ? "#ffffff"
                            : "#111827",

                        fontSize:
                          "18px",

                        wordBreak:
                          "break-word",
                      }}>
                        {
                          supplier.name
                        }
                      </h3>

                    </div>

                    {/* CONTACT */}

                    <div style={{
                      color:
                        darkMode
                          ? "#d1d5db"
                          : "#6b7280",

                      wordBreak:
                        "break-word",
                    }}>

                      {
                        supplier.contact ||
                        "N/A"
                      }

                    </div>

                    {/* EMAIL */}

                    <div style={{
                      color:
                        darkMode
                          ? "#d1d5db"
                          : "#6b7280",

                      wordBreak:
                        "break-word",
                    }}>

                      {
                        supplier.email ||
                        "N/A"
                      }

                    </div>

                    {/* CITY */}

                    <div style={{
                      color:
                        darkMode
                          ? "#ffffff"
                          : "#111827",

                      wordBreak:
                        "break-word",
                    }}>

                      {
                        supplier.city ||
                        "N/A"
                      }

                    </div>

                    {/* JOINED */}

                    <div style={{
                      color:
                        darkMode
                          ? "#ffffff"
                          : "#111827",

                      whiteSpace:
                        "nowrap",
                    }}>

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

                        style={
                          styles.deleteButton
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                )
              )
            }

          </div>
        )
      }

      {/* MODAL */}

      {showModal && (

        <div style={styles.modalOverlay}>

          <div style={{
            ...styles.modal,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            border:
              darkMode
                ? "1px solid #1f2937"
                : "1px solid #e5e7eb",
          }}>

            <h2 style={{
              ...styles.modalTitle,

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}>
              Add Supplier
            </h2>

            <div style={styles.formGrid}>

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

            <div style={styles.modalButtons}>

              <button
                onClick={
                  addSupplier
                }

                style={
                  styles.saveButton
                }
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
                  ...styles.cancelButton,

                  background:
                    darkMode
                      ? "#1f2937"
                      : "#f3f4f6",

                  color:
                    darkMode
                      ? "#ffffff"
                      : "#111827",
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

const styles = {

  container: {
    minHeight:
      "100vh",

    width: "100%",

    padding:
      "24px",

    boxSizing:
      "border-box",

    transition:
      "0.3s ease",
  },

  header: {
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
  },

  title: {
    margin: 0,

    fontSize:
      "clamp(30px,6vw,38px)",

    wordBreak:
      "break-word",
  },

  subtitle: {
    marginTop:
      "10px",

    fontSize:
      "16px",
  },

  addButton: {
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

    width: "100%",

    maxWidth:
      "220px",
  },

  searchWrapper: {
    marginBottom:
      "24px",
  },

  searchInput: {
    width: "100%",

    maxWidth:
      "360px",

    padding:
      "14px",

    borderRadius:
      "14px",

    outline:
      "none",

    fontSize:
      "15px",

    boxSizing:
      "border-box",
  },

  emptyCard: {
    borderRadius:
      "24px",

    padding:
      "70px 20px",

    textAlign:
      "center",

    fontSize:
      "18px",
  },

  tableWrapper: {
    borderRadius:
      "24px",

    overflowX:
      "auto",
  },

  tableHead: {
    display: "grid",

    gridTemplateColumns:
      "repeat(6,minmax(160px,1fr))",

    padding:
      "20px",

    fontWeight:
      "bold",

    minWidth:
      "1000px",

    gap: "20px",
  },

  row: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(6,minmax(160px,1fr))",

    padding:
      "20px",

    alignItems:
      "center",

    minWidth:
      "1000px",

    gap: "20px",
  },

  deleteButton: {
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

    whiteSpace:
      "nowrap",
  },

  modalOverlay: {
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
  },

  modal: {
    width: "100%",

    maxWidth:
      "520px",

    borderRadius:
      "24px",

    padding:
      "30px",

    boxSizing:
      "border-box",
  },

  modalTitle: {
    marginTop: 0,

    marginBottom:
      "24px",
  },

  formGrid: {
    display: "grid",

    gap: "16px",
  },

  modalButtons: {
    display: "flex",

    gap: "14px",

    marginTop:
      "26px",

    flexWrap:
      "wrap",
  },

  saveButton: {
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

    minWidth:
      "140px",
  },

  cancelButton: {
    flex: 1,

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

    minWidth:
      "140px",
  },
};

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