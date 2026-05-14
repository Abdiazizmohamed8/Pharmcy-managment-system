import {
  useState,
} from "react";

import {
  fmt,
} from "../utils/helpers";

import {
  useTheme,
} from "../context/ThemeContext";

function Expenses({
  expenses = [],
  setExpenses,
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
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    form,
    setForm,
  ] = useState({
    category: "",
    description: "",
    amount: "",
  });

  /* =========================
        FILTER
  ========================= */

  const filteredExpenses =
    expenses.filter(
      (expense) =>

        expense.category
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        expense.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* =========================
        TOTAL
  ========================= */

  const totalExpenses =
    expenses.reduce(
      (
        acc,
        expense
      ) =>

        acc +
        Number(
          expense.amount || 0
        ),

      0
    );

  /* =========================
        SAVE
  ========================= */

  const handleSave = () => {

    if (
      !form.category ||
      !form.amount
    ) {

      toast?.(
        "Please fill all fields",
        "error"
      );

      return;
    }

    const newExpense = {

      id:
        Date.now(),

      category:
        form.category,

      description:
        form.description,

      amount:
        Number(
          form.amount
        ),

      date:
        new Date()
          .toISOString()
          .split("T")[0],
    };

    setExpenses(
      (prev) => [
        newExpense,
        ...prev,
      ]
    );

    toast?.(
      "Expense added",
      "success"
    );

    setForm({
      category: "",
      description: "",
      amount: "",
    });

    setShowModal(false);
  };

  /* =========================
        DELETE
  ========================= */

  const deleteExpense =
    (id) => {

      setExpenses(
        (prev) =>

          prev.filter(
            (expense) =>
              expense.id !== id
          )
      );

      toast?.(
        "Expense deleted",
        "error"
      );
    };

  return (

    <div style={{
      ...styles.container,

      background:
        darkMode
          ? "#020617"
          : "#ffffff",

      color:
        darkMode
          ? "#ffffff"
          : "#111827",
    }}>

      {/* HEADER */}

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
            Expenses 💸
          </h1>

          <p style={{
            ...styles.subtitle,

            color:
              darkMode
                ? "#d1d5db"
                : "#6b7280",
          }}>
            Manage pharmacy expenses
          </p>

        </div>

      </div>

      {/* TOP */}

      <div style={styles.topActions}>

        {/* SEARCH */}

        <input
          type="text"

          placeholder="Search expense..."

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

        {/* RIGHT */}

        <div style={styles.headerRight}>

          {/* TOTAL */}

          <div style={styles.totalCard}>

            <div style={styles.totalLabel}>
              Total Expenses
            </div>

            <div style={styles.totalAmount}>
              {fmt(totalExpenses)}
            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={() =>
              setShowModal(true)
            }

            style={styles.addButton}
          >
            + Add Expense
          </button>

        </div>

      </div>

      {/* TABLE */}

      {filteredExpenses.length === 0 ? (

        <div style={{
          ...styles.emptyBox,

          background:
            darkMode
              ? "#111827"
              : "#ffffff",

          color:
            darkMode
              ? "#d1d5db"
              : "#9ca3af",

          border:
            darkMode
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}>
          No expenses found
        </div>

      ) : (

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
            ...styles.tableHeader,

            background:
              darkMode
                ? "#0f172a"
                : "#f8fafc",

            color:
              darkMode
                ? "#ffffff"
                : "#111827",
          }}>

            <div>Category</div>

            <div>Description</div>

            <div>Amount</div>

            <div>Date</div>

            <div>Action</div>

          </div>

          {/* BODY */}

          {filteredExpenses.map(
            (
              expense
            ) => (

              <div
                key={expense.id}

                style={{
                  ...styles.tableRow,

                  borderTop:
                    darkMode
                      ? "1px solid #1f2937"
                      : "1px solid #e5e7eb",

                  color:
                    darkMode
                      ? "#ffffff"
                      : "#111827",
                }}
              >

                {/* CATEGORY */}

                <div>

                  <span style={{
                    ...styles.categoryBadge,

                    background:
                      darkMode
                        ? "#14532d"
                        : "#dcfce7",
                  }}>

                    {expense.category}

                  </span>

                </div>

                {/* DESCRIPTION */}

                <div style={styles.descriptionText}>

                  {
                    expense.description ||
                    "No description"
                  }

                </div>

                {/* AMOUNT */}

                <div>

                  <span style={{
                    ...styles.amountBadge,

                    background:
                      darkMode
                        ? "#7f1d1d"
                        : "#fee2e2",
                  }}>

                    {fmt(expense.amount)}

                  </span>

                </div>

                {/* DATE */}

                <div style={styles.dateText}>
                  {expense.date}
                </div>

                {/* DELETE */}

                <div>

                  <button
                    onClick={() =>
                      deleteExpense(
                        expense.id
                      )
                    }

                    style={styles.deleteButton}
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
              Add Expense
            </h2>

            {/* FORM */}

            <div style={styles.formGrid}>

              <input
                type="text"

                placeholder="Category"

                value={
                  form.category
                }

                onChange={(e) =>
                  setForm({
                    ...form,

                    category:
                      e.target.value,
                  })
                }

                style={inputStyle(
                  darkMode
                )}
              />

              <input
                type="text"

                placeholder="Description"

                value={
                  form.description
                }

                onChange={(e) =>
                  setForm({
                    ...form,

                    description:
                      e.target.value,
                  })
                }

                style={inputStyle(
                  darkMode
                )}
              />

              <input
                type="number"

                placeholder="Amount"

                value={
                  form.amount
                }

                onChange={(e) =>
                  setForm({
                    ...form,

                    amount:
                      e.target.value,
                  })
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
                  handleSave
                }

                style={styles.saveButton}
              >
                Save Expense
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
    transition:
      "0.3s ease",
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
      "clamp(28px,5vw,34px)",
  },

  subtitle: {
    marginTop: "8px",
    fontSize: "15px",
  },

  topActions: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "22px",
  },

  headerRight: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent:
      "flex-end",
  },

  totalCard: {
    background: "#dc2626",
    color: "#ffffff",
    padding: "14px 18px",
    borderRadius: "16px",
    minWidth: "170px",
    width: "fit-content",
    boxSizing: "border-box",
  },

  totalLabel: {
    fontSize: "13px",
    opacity: 0.9,
    marginBottom: "6px",
  },

  totalAmount: {
    fontSize:
      "clamp(22px,5vw,26px)",
    fontWeight: "bold",
  },

  addButton: {
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "14px 22px",
    borderRadius: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  searchInput: {
    width: "100%",
    maxWidth: "420px",
    padding: "15px",
    borderRadius: "16px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  emptyBox: {
    borderRadius: "24px",
    padding: "80px 20px",
    textAlign: "center",
    fontSize: "18px",
  },

  tableWrapper: {
    width: "100%",
    borderRadius: "24px",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",

    gridTemplateColumns:
      "1fr 2fr .8fr .8fr .8fr",

    gap: "10px",

    padding: "16px",

    fontWeight: "700",

    fontSize: "12px",

    alignItems: "center",
  },

  tableRow: {
    display: "grid",

    gridTemplateColumns:
      "1fr 2fr .8fr .8fr .8fr",

    gap: "10px",

    padding: "16px",

    alignItems: "center",

    fontSize: "12px",
  },

  descriptionText: {
    lineHeight: "20px",
    wordBreak: "break-word",
  },

  dateText: {
    whiteSpace: "nowrap",
  },

  categoryBadge: {
    color: "#16a34a",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "bold",
    display: "inline-block",
  },

  amountBadge: {
    color: "#dc2626",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: "bold",
    fontSize: "14px",
    display: "inline-block",
  },

  deleteButton: {
    background: "#dc2626",

    color: "#ffffff",

    border: "none",

    padding: "10px 16px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "13px",

    whiteSpace: "nowrap",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent:
      "center",
    alignItems:
      "center",
    zIndex: 999,
    padding: "20px",
  },

  modal: {
    width: "100%",
    maxWidth: "460px",
    borderRadius: "24px",
    padding: "30px",
    boxSizing: "border-box",
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
    marginTop: "24px",
    flexWrap: "wrap",
  },

  saveButton: {
    flex: 1,
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "14px",
    borderRadius: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "140px",
  },

  cancelButton: {
    flex: 1,
    border: "none",
    padding: "14px",
    borderRadius: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "140px",
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
  borderRadius: "14px",
  border:
    darkMode
      ? "1px solid #374151"
      : "1px solid #d1d5db",
  outline: "none",
  fontSize: "14px",
  background:
    darkMode
      ? "#0f172a"
      : "#ffffff",
  color:
    darkMode
      ? "#ffffff"
      : "#111827",
  boxSizing: "border-box",
});

export default Expenses;