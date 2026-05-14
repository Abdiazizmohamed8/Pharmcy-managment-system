import {
  useState,
} from "react";

/* =========================
      THEME
========================= */

import {
  useTheme,
} from "../context/ThemeContext";

function Suppliers({
  suppliers = [],
  setSuppliers,
  toast,
  openSidebar,
}) {

  const {
    darkMode,
  } = useTheme();

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

      {/* MOBILE HEADER */}

      <div style={styles.mobileTop}>

        <button
          onClick={openSidebar}

          style={{
            ...styles.menuButton,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            color:
              darkMode
                ? "#ffffff"
                : "#111827",

            border:
              darkMode
                ? "1px solid #1f2937"
                : "1px solid #e5e7eb",
          }}
        >
          ☰
        </button>

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

      </div>

      {/* TOP ACTIONS */}

      <div style={styles.topActions}>

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
          }}>

            {/* HEADER */}

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

              <div>Supplier</div>

              <div>Contact</div>

              <div>Email</div>

              <div>City</div>

              <div>Joined</div>

              <div>Action</div>

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
                          "15px",

                        wordBreak:
                          "break-word",
                      }}>
                        {
                          supplier.name
                        }
                      </h3>

                    </div>

                    {/* CONTACT */}

                    <div style={td(darkMode)}>

                      {
                        supplier.contact ||
                        "N/A"
                      }

                    </div>

                    {/* EMAIL */}

                    <div style={td(darkMode)}>

                      {
                        supplier.email ||
                        "N/A"
                      }

                    </div>

                    {/* CITY */}

                    <div style={td(darkMode)}>

                      {
                        supplier.city ||
                        "N/A"
                      }

                    </div>

                    {/* JOINED */}

                    <div style={td(darkMode)}>

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
                        🗑 Delete
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
    width: "100%",
    minHeight: "100vh",
    padding: "14px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  mobileTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  menuButton: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    fontSize:
      "clamp(28px,5vw,36px)",
  },

  subtitle: {
    marginTop: "8px",
    fontSize: "14px",
  },

  topActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "20px",
    alignItems: "center",
  },

  addButton: {
    background:
      "#16a34a",

    color: "#ffffff",

    border: "none",

    padding:
      "12px 18px",

    borderRadius:
      "14px",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize:
      "14px",

    width: "fit-content",

    minWidth:
      "170px",
  },

  searchInput: {
    width: "100%",
    maxWidth: "320px",
    padding: "14px",
    borderRadius: "14px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  emptyCard: {
    borderRadius: "24px",
    padding: "70px 20px",
    textAlign: "center",
    fontSize: "18px",
  },

  tableWrapper: {
    borderRadius: "24px",
    overflow: "hidden",
    width: "100%",
  },

  tableHead: {
    display: "grid",

    gridTemplateColumns:
      "1.5fr 1fr 1.5fr 1fr 1fr .9fr",

    padding: "16px",

    fontWeight: "bold",

    gap: "10px",

    fontSize: "13px",

    wordBreak: "break-word",
  },

  row: {
    display: "grid",

    gridTemplateColumns:
      "1.5fr 1fr 1.5fr 1fr 1fr .9fr",

    padding: "16px",

    alignItems: "center",

    gap: "10px",

    wordBreak: "break-word",
  },

  deleteButton: {
    width: "100%",

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

    fontWeight:
      "bold",

    cursor:
      "pointer",

    fontSize:
      "13px",

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
      "24px",

    boxSizing:
      "border-box",
  },

  modalTitle: {
    marginTop: 0,
    marginBottom: "24px",
  },

  formGrid: {
    display: "grid",
    gap: "16px",
  },

  modalButtons: {
    display: "flex",
    gap: "14px",
    marginTop: "26px",
    flexWrap: "wrap",
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

const td = (darkMode) => ({
  color:
    darkMode
      ? "#d1d5db"
      : "#6b7280",

  wordBreak:
    "break-word",
});

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