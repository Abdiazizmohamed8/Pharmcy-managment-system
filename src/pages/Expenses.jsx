import {
  useState,
} from "react";

import {
  fmt,
} from "../utils/helpers";

function Expenses({
  expenses,
  setExpenses,
  toast,
  darkMode = false,
}) {

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
      (acc, expense) =>

        acc +
        Number(
          expense.amount || 0
        ),

      0
    );

  /* =========================
     FORM
  ========================= */

  const [form, setForm] =
    useState({
      category: "",
      description: "",
      amount: "",
    });

  /* =========================
     SAVE
  ========================= */

  const handleSave = () => {

    if (
      !form.category ||
      !form.amount
    ) {

      toast(
        "Please fill all fields",
        "error"
      );

      return;
    }

    const newExpense =
      {
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

    toast(
      "Expense added"
    );

    setForm({
      category: "",
      description: "",
      amount: "",
    });

    setShowModal(
      false
    );
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

      toast(
        "Expense deleted",
        "error"
      );
    };

  return (
    <div
      style={{
        width: "100%",

        minHeight:
          "100vh",

        background:
          darkMode
            ? "#020617"
            : "#f3f4f6",

        color:
          darkMode
            ? "#ffffff"
            : "#111827",

        transition:
          "0.3s ease",

        padding:
          "24px",

        boxSizing:
          "border-box",
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

        {/* LEFT */}

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
            Expenses 💸
          </h1>

          <p
            style={{
              marginTop:
                "8px",

              color:
                darkMode
                  ? "#d1d5db"
                  : "#6b7280",

              fontSize:
                "15px",
            }}
          >
            Manage pharmacy
            expenses
          </p>
        </div>

        {/* RIGHT */}

        <div
          style={{
            display: "flex",

            gap: "14px",

            flexWrap:
              "wrap",

            alignItems:
              "center",
          }}
        >

          {/* TOTAL */}

          <div
            style={{
              background:
                "#dc2626",

              color: "#fff",

              padding:
                "16px 20px",

              borderRadius:
                "18px",

              minWidth:
                "180px",

              boxShadow:
                darkMode

                  ? "0 4px 18px rgba(0,0,0,0.35)"

                  : "0 4px 18px rgba(220,38,38,0.2)",
            }}
          >

            <div
              style={{
                fontSize:
                  "13px",

                opacity: 0.9,

                marginBottom:
                  "6px",
              }}
            >
              Total Expenses
            </div>

            <div
              style={{
                fontSize:
                  "26px",

                fontWeight:
                  "bold",
              }}
            >
              {fmt(
                totalExpenses
              )}
            </div>
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
                "16px",

              cursor:
                "pointer",

              fontWeight:
                "bold",

              fontSize:
                "14px",
            }}
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* SEARCH */}

      <div
        style={{
          marginBottom:
            "22px",
        }}
      >

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
            width: "100%",

            maxWidth:
              "420px",

            padding:
              "15px",

            borderRadius:
              "16px",

            border:
              darkMode

                ? "1px solid #374151"

                : "1px solid #d1d5db",

            outline:
              "none",

            fontSize:
              "14px",

            background:
              darkMode
                ? "#111827"
                : "#fff",

            color:
              darkMode
                ? "#ffffff"
                : "#111827",
          }}
        />
      </div>

      {/* EMPTY */}

      {filteredExpenses.length ===
      0 ? (

        <div
          style={{
            background:
              darkMode
                ? "#111827"
                : "#fff",

            borderRadius:
              "24px",

            padding:
              "80px 20px",

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
                : "none",

            boxShadow:
              darkMode

                ? "0 4px 18px rgba(0,0,0,0.35)"

                : "0 4px 18px rgba(0,0,0,0.05)",
          }}
        >
          No expenses found
        </div>

      ) : (

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",

            gap: "18px",
          }}
        >

          {filteredExpenses.map(
            (
              expense
            ) => (

              <div
                key={
                  expense.id
                }

                style={{
                  background:
                    darkMode
                      ? "#111827"
                      : "#fff",

                  borderRadius:
                    "24px",

                  padding:
                    "20px",

                  border:
                    darkMode
                      ? "1px solid #1f2937"
                      : "none",

                  boxShadow:
                    darkMode

                      ? "0 4px 18px rgba(0,0,0,0.35)"

                      : "0 4px 18px rgba(0,0,0,0.05)",

                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap: "18px",
                }}
              >

                {/* TOP */}

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    flexWrap:
                      "wrap",

                    gap: "12px",
                  }}
                >

                  <span
                    style={{
                      background:
                        darkMode
                          ? "#14532d"
                          : "#dcfce7",

                      color:
                        "#16a34a",

                      padding:
                        "8px 14px",

                      borderRadius:
                        "999px",

                      fontSize:
                        "13px",

                      fontWeight:
                        "bold",
                    }}
                  >
                    {
                      expense.category
                    }
                  </span>

                  <div
                    style={{
                      color:
                        darkMode
                          ? "#d1d5db"
                          : "#6b7280",

                      fontSize:
                        "13px",
                    }}
                  >
                    {
                      expense.date
                    }
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div
                  style={{
                    color:
                      darkMode
                        ? "#ffffff"
                        : "#374151",

                    fontSize:
                      "15px",

                    lineHeight:
                      "24px",
                  }}
                >
                  {expense.description ||
                    "No description"}
                </div>

                {/* BOTTOM */}

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    flexWrap:
                      "wrap",

                    gap: "12px",
                  }}
                >

                  {/* AMOUNT */}

                  <div
                    style={{
                      background:
                        darkMode
                          ? "#7f1d1d"
                          : "#fee2e2",

                      color:
                        "#dc2626",

                      padding:
                        "10px 16px",

                      borderRadius:
                        "999px",

                      fontWeight:
                        "bold",

                      fontSize:
                        "14px",
                    }}
                  >
                    {fmt(
                      expense.amount
                    )}
                  </div>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      deleteExpense(
                        expense.id
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
                        "11px 18px",

                      borderRadius:
                        "14px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "bold",

                      fontSize:
                        "13px",
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

            justifyContent:
              "center",

            alignItems:
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
                  : "#fff",

              width: "100%",

              maxWidth:
                "460px",

              borderRadius:
                "24px",

              padding:
                "30px",

              border:
                darkMode
                  ? "1px solid #1f2937"
                  : "none",
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
              Add Expense
            </h2>

            {/* FORM */}

            <div
              style={{
                display: "grid",

                gap: "16px",
              }}
            >

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
                      e.target
                        .value,
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
                      e.target
                        .value,
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
                      e.target
                        .value,
                  })
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
                  "24px",

                flexWrap:
                  "wrap",
              }}
            >

              <button
                onClick={
                  handleSave
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
                }}
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
                  flex: 1,

                  background:
                    darkMode
                      ? "#1f2937"
                      : "#f3f4f6",

                  color:
                    darkMode
                      ? "#ffffff"
                      : "#111827",

                  border: "none",

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
});

export default Expenses;