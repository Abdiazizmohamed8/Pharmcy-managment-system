import {
  useState,
  useEffect,
  useMemo,
} from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

function Inventory({
  openSidebar,
}) {

  const { darkMode } = useTheme();

  /* =========================================
        STATES
  ========================================= */

  const [
    medicines,
    setMedicines,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  /* =========================================
        FIRESTORE
  ========================================= */

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "medicines"
        ),

        (snapshot) => {

          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setMedicines(data);
        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* =========================================
        FILTERED MEDICINES
  ========================================= */

  const filteredMedicines =
    medicines.filter(
      (medicine) =>

        medicine.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* =========================================
        INVENTORY ANALYTICS
  ========================================= */

  const mostSoldMedicine = useMemo(() => {

    const grouped = {};

    medicines.forEach((medicine) => {

      grouped[medicine.name] =
        Number(medicine.sold || 0);

    });

    const sorted =
      Object.entries(grouped).sort(
        (a, b) => b[1] - a[1]
      );

    return sorted[0];

  }, [medicines]);

  const leastSoldMedicine = useMemo(() => {

    const grouped = {};

    medicines.forEach((medicine) => {

      grouped[medicine.name] =
        Number(medicine.sold || 0);

    });

    const sorted =
      Object.entries(grouped).sort(
        (a, b) => a[1] - b[1]
      );

    return sorted[0];

  }, [medicines]);

  const fastMovingStock = useMemo(() => {

    return medicines
      .filter(
        (medicine) =>
          Number(medicine.sold || 0) >= 50
      )
      .sort(
        (a, b) =>
          Number(b.sold || 0) -
          Number(a.sold || 0)
      )
      .slice(0, 5);

  }, [medicines]);

  const deadStock = useMemo(() => {

    return medicines.filter(
      (medicine) =>
        Number(medicine.sold || 0) === 0
    );

  }, [medicines]);

  return (

    <div
      style={{
        ...styles.container,

        background:
          darkMode
            ? "#020617"
            : "#f3f4f6",

        color:
          darkMode
            ? "#ffffff"
            : "#111827",
      }}
    >

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

          <h1
            style={{
              ...styles.title,

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            Inventory 📦
          </h1>

          <p
            style={{
              ...styles.subtitle,

              color:
                darkMode
                  ? "#94a3b8"
                  : "#6b7280",
            }}
          >
            Manage medicine inventory
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <input
        type="text"

        placeholder="Search medicine..."

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
              ? "1px solid #334155"
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

      {/* ANALYTICS */}

      <div style={styles.analyticsGrid}>

        <div
          style={{
            ...styles.analyticsCard,
            background:
              darkMode
                ? "#111827"
                : "#ffffff",
          }}
        >
          <p style={styles.analyticsTitle}>
            Most Sold Medicine
          </p>

          <h2 style={styles.analyticsValue}>
            {mostSoldMedicine?.[0] || "N/A"}
          </h2>

          <span style={styles.analyticsSmall}>
            {mostSoldMedicine?.[1] || 0} sold
          </span>
        </div>

        <div
          style={{
            ...styles.analyticsCard,
            background:
              darkMode
                ? "#111827"
                : "#ffffff",
          }}
        >
          <p style={styles.analyticsTitle}>
            Least Sold Medicine
          </p>

          <h2 style={styles.analyticsValue}>
            {leastSoldMedicine?.[0] || "N/A"}
          </h2>

          <span style={styles.analyticsSmall}>
            {leastSoldMedicine?.[1] || 0} sold
          </span>
        </div>

        <div
          style={{
            ...styles.analyticsCard,
            background:
              darkMode
                ? "#111827"
                : "#ffffff",
          }}
        >
          <p style={styles.analyticsTitle}>
            Fast Moving Stock
          </p>

          <h2 style={styles.analyticsValue}>
            {fastMovingStock.length}
          </h2>

          <span style={styles.analyticsSmall}>
            High demand medicines
          </span>
        </div>

        <div
          style={{
            ...styles.analyticsCard,
            background:
              darkMode
                ? "#111827"
                : "#ffffff",
          }}
        >
          <p style={styles.analyticsTitle}>
            Dead Stock
          </p>

          <h2
            style={{
              ...styles.analyticsValue,
              color: "#dc2626",
            }}
          >
            {deadStock.length}
          </h2>

          <span style={styles.analyticsSmall}>
            Not selling medicines
          </span>
        </div>

      </div>

      {/* TABLE */}

      {filteredMedicines.length === 0 ? (

        <div
          style={{
            ...styles.emptyBox,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",
          }}
        >
          No medicines available
        </div>

      ) : (

        <div
          style={{
            ...styles.tableWrapper,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            border:
              darkMode
                ? "1px solid #1f2937"
                : "1px solid #e5e7eb",
          }}
        >

          {/* HEADER */}

          <div
            style={{
              ...styles.tableHeader,

              background:
                darkMode
                  ? "#0f172a"
                  : "#f9fafb",
            }}
          >

            <div>Medicine</div>
            <div>Category</div>
            <div>Stock</div>
            <div>Sold</div>
            <div>Expiry</div>
            <div>Status</div>

          </div>

          {/* ROWS */}

          {filteredMedicines.map(
            (medicine) => {

              const lowStock =
                Number(medicine.stock) <=
                Number(medicine.minStock || 5);

              const outOfStock =
                Number(medicine.stock) <= 0;

              return (

                <div
                  key={medicine.id}

                  style={{
                    ...styles.row,

                    borderTop:
                      darkMode
                        ? "1px solid #1f2937"
                        : "1px solid #e5e7eb",
                  }}
                >

                  <div
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {medicine.name}
                  </div>

                  <div>

                    <span
                      style={{
                        ...styles.categoryBadge,

                        background:
                          darkMode
                            ? "#14532d"
                            : "#dcfce7",

                        color:
                          darkMode
                            ? "#bbf7d0"
                            : "#16a34a",
                      }}
                    >
                      {medicine.category}
                    </span>

                  </div>

                  <div
                    style={{
                      color:
                        outOfStock
                          ? "#dc2626"
                          : lowStock
                          ? "#f59e0b"
                          : "#16a34a",

                      fontWeight: "bold",
                    }}
                  >
                    {medicine.stock}
                  </div>

                  <div>
                    {medicine.sold || 0}
                  </div>

                  <div>
                    {medicine.expiryDate || "N/A"}
                  </div>

                  <div>

                    <span
                      style={{
                        padding: "8px 14px",

                        borderRadius: "999px",

                        fontSize: "12px",

                        fontWeight: "bold",

                        background:
                          outOfStock
                            ? "#7f1d1d"
                            : lowStock
                            ? "#78350f"
                            : "#14532d",

                        color:
                          outOfStock
                            ? "#fecaca"
                            : lowStock
                            ? "#fde68a"
                            : "#bbf7d0",
                      }}
                    >

                      {
                        outOfStock
                          ? "Out"
                          : lowStock
                          ? "Low"
                          : "Good"
                      }

                    </span>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}

/* =========================================
      STYLES
========================================= */

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

  searchInput: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    outline: "none",
    fontSize: "14px",
    marginBottom: "20px",
    boxSizing: "border-box",
  },

  analyticsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: "16px",

    marginBottom: "24px",
  },

  analyticsCard: {
    padding: "20px",

    borderRadius: "20px",

    boxShadow:
      "0 4px 12px rgba(0,0,0,0.05)",
  },

  analyticsTitle: {
    fontSize: "14px",

    marginBottom: "12px",

    color: "#64748b",

    fontWeight: "600",
  },

  analyticsValue: {
    margin: 0,

    fontSize: "28px",

    fontWeight: "bold",
  },

  analyticsSmall: {
    display: "block",

    marginTop: "10px",

    fontSize: "13px",

    color: "#94a3b8",
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
    overflowX: "auto",
  },

  tableHeader: {
    display: "grid",

    gridTemplateColumns:
      "1.5fr 1fr .8fr .8fr 1fr .8fr",

    padding: "16px",

    fontWeight: "bold",

    gap: "10px",

    minWidth: "750px",

    fontSize: "13px",
  },

  row: {
    display: "grid",

    gridTemplateColumns:
      "1.5fr 1fr .8fr .8fr 1fr .8fr",

    alignItems: "center",

    padding: "16px",

    gap: "10px",

    minWidth: "750px",

    fontSize: "14px",
  },

  categoryBadge: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
  },
};

export default Inventory;