import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

import {
  useReactToPrint,
} from "react-to-print";

import Invoice
from "../components/Invoice";

function POS({
  sales = [],
  setSales,
  toast,
  openSidebar,
}) {

  const { darkMode } =
    useTheme();

  /* =========================================
        REFS
  ========================================= */

  const invoiceRef =
    useRef(null);

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

  const [
    cart,
    setCart,
  ] = useState([]);

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    customerPhone,
    setCustomerPhone,
  ] = useState("");

  const [
    customerAddress,
    setCustomerAddress,
  ] = useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("Cash");

  const [
    paidAmount,
    setPaidAmount,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    discountType,
    setDiscountType,
  ] = useState("percent");

  const [
    discountValue,
    setDiscountValue,
  ] = useState("");

  const [
    tax,
    setTax,
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
        PRINT INVOICE
  ========================================= */

  const handlePrintInvoice =
    useReactToPrint({

      contentRef:
        invoiceRef,
    });

  /* =========================================
        SEARCH
  ========================================= */

  const filteredMedicines =
    medicines.filter(
      (medicine) => {

        const text =
          search
            .toLowerCase()
            .trim();

        return (

          medicine.name
            ?.toLowerCase()
            .includes(text) ||

          medicine.category
            ?.toLowerCase()
            .includes(text)
        );
      }
    );

  /* =========================================
        ADD TO CART
  ========================================= */

  const addToCart =
    (medicine) => {

      if (
        medicine.stock <= 0
      ) {

        toast?.(
          "Out of stock",
          "error"
        );

        return;
      }

      const exists =
        cart.find(
          (item) =>
            item.id ===
            medicine.id
        );

      if (exists) {

        if (
          exists.qty >=
          medicine.stock
        ) {

          toast?.(
            "Stock limit reached",
            "error"
          );

          return;
        }

        setCart(
          cart.map((item) =>

            item.id ===
            medicine.id

              ? {
                  ...item,
                  qty:
                    item.qty + 1,
                }

              : item
          )
        );

      } else {

        setCart([
          ...cart,

          {
            ...medicine,
            qty: 1,
          },
        ]);
      }

      toast?.(
        `${medicine.name} added`
      );
    };

  /* =========================================
        QUANTITY
  ========================================= */

  const increaseQty =
    (id) => {

      setCart(
        cart.map((item) => {

          if (
            item.id === id
          ) {

            if (
              item.qty >=
              item.stock
            ) {

              return item;
            }

            return {
              ...item,
              qty:
                item.qty + 1,
            };
          }

          return item;
        })
      );
    };

  const decreaseQty =
    (id) => {

      setCart(

        cart
          .map((item) =>

            item.id === id

              ? {
                  ...item,
                  qty:
                    item.qty - 1,
                }

              : item
          )

          .filter(
            (item) =>
              item.qty > 0
          )
      );
    };

  /* =========================================
        TOTALS
  ========================================= */

  const subtotal =
    cart.reduce(
      (acc, item) =>

        acc +
        item.sellPrice *
          item.qty,

      0
    );

  const discount =
    discountType === "percent"

      ? subtotal *
        (
          Number(
            discountValue || 0
          ) / 100
        )

      : Number(
          discountValue || 0
        );

  const taxAmount =
    subtotal *
    (
      Number(tax || 0) / 100
    );

  const total =
    subtotal -
    discount +
    taxAmount;

  const paid =
    Number(
      paidAmount || 0
    );

  const debt =
    total - paid;

  const saleStatus =

    debt <= 0

      ? "Paid"

      : paid > 0

      ? "Partial"

      : "Unpaid";

  /* =========================================
        COMPLETE SALE
  ========================================= */

  const completeSale =
    async () => {

      if (
        cart.length === 0
      ) {

        toast?.(
          "Cart empty",
          "error"
        );

        return;
      }

      if (
        !customerName
      ) {

        toast?.(
          "Customer required",
          "error"
        );

        return;
      }
      // Generate invoice number
const snapshot = await getDocs(
  collection(db, "sales")
);

const invoiceId =
  snapshot.size + 1;

      try {

        setLoading(true);

        const saleData = {

          customer:
            customerName,

          phone:
            customerPhone,

          address:
            customerAddress,

          items: cart,

          subtotal,

          discount,

          taxAmount,

          total,

          paid,

          debt,

          method:
            paymentMethod,

          status:
            saleStatus,

          createdAt:
            Date.now(),

          date:
            new Date()
              .toISOString(),
        };

       await setDoc(

  doc(
    db,
    "sales",
    String(invoiceId)
  ),

  saleData
);

        for (
          const item of cart
        ) {

          await updateDoc(

            doc(
              db,
              "medicines",
              item.id
            ),

            {
              stock:
                item.stock -
                item.qty,

              sold:
                Number(
                  item.sold || 0
                ) + item.qty,
            }
          );
        }

        await setDoc(

          doc(
            db,
            "customers",

            customerPhone ||
            customerName
          ),

          {

            name:
              customerName,

            phone:
              customerPhone,

            address:
              customerAddress,

            debt,

            status:
              debt > 0
                ? "Debt"
                : "Paid",

            updatedAt:
              Date.now(),
          },

          {
            merge: true,
          }
        );

   setSales?.([
  {
    id: invoiceId,
    ...saleData,
  },

  ...sales,
]);

        toast?.(
          "Sale completed",
          "success"
        );

        setCart([]);

        setCustomerName("");

        setCustomerPhone("");

        setCustomerAddress("");

        setPaidAmount("");

        setDiscountValue("");

        setTax("");

        setPaymentMethod(
          "Cash"
        );

      } catch (error) {

        console.log(error);

        toast?.(
          "Sale failed",
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      style={{
        ...styles.container,

        background:
          darkMode
            ? "#020617"
            : "#f8fafc",
      }}
    >

      {/* LEFT */}

      <div>

        {/* HEADER */}

        <div style={styles.mobileTop}>

          <button
            onClick={
              openSidebar
            }

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
              POS 🛒
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
              Pharmacy sales system
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

          style={input(darkMode)}
        />

        {/* MEDICINES */}

        <div style={styles.medicineGrid}>

          {
            filteredMedicines.map(
              (medicine) => (

                <div
                  key={medicine.id}

                  style={{
                    ...styles.card,

                    background:
                      darkMode
                        ? "#111827"
                        : "#ffffff",
                  }}
                >

                  <div>

                    <h3>
                      {medicine.name}
                    </h3>

                    <p style={styles.gray}>
                      {
                        medicine.category
                      }
                    </p>

                    <p style={styles.stock}>
                      Stock:
                      {" "}
                      {
                        medicine.stock
                      }
                    </p>

                    <h2 style={styles.price}>
                      $
                      {
                        medicine.sellPrice
                      }
                    </h2>

                  </div>

                  <button
                    onClick={() =>
                      addToCart(
                        medicine
                      )
                    }

                    style={
                      styles.addButton
                    }
                  >
                    Add Cart
                  </button>

                </div>
              )
            )
          }

        </div>

      </div>

      {/* RIGHT */}

      <div
        style={{
          ...styles.cartSection,

          background:
            darkMode
              ? "#111827"
              : "#ffffff",
        }}
      >

        <h2>
          Cart 🛒
        </h2>

        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) =>
            setCustomerName(
              e.target.value
            )
          }
          style={input(darkMode)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={customerPhone}
          onChange={(e) =>
            setCustomerPhone(
              e.target.value
            )
          }
          style={input(darkMode)}
        />

        <input
          type="text"
          placeholder="Address"
          value={customerAddress}
          onChange={(e) =>
            setCustomerAddress(
              e.target.value
            )
          }
          style={input(darkMode)}
        />

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(
              e.target.value
            )
          }
          style={input(darkMode)}
        >

          <option>
            Cash
          </option>

          <option>
            EVC PLUS
          </option>

          <option>
            E-DAHAB
          </option>

          <option>
            Debt
          </option>

        </select>

        <input
          type="number"
          placeholder="Paid Amount"
          value={paidAmount}
          onChange={(e) =>
            setPaidAmount(
              e.target.value
            )
          }
          style={input(darkMode)}
        />

        {/* DISCOUNT */}

        <select
          value={discountType}
          onChange={(e) =>
            setDiscountType(
              e.target.value
            )
          }
          style={input(darkMode)}
        >

          <option value="percent">
            Percentage %
          </option>

          <option value="fixed">
            Fixed Amount
          </option>

        </select>

        <input
          type="number"
          placeholder="Discount"
          value={discountValue}
          onChange={(e) =>
            setDiscountValue(
              e.target.value
            )
          }
          style={input(darkMode)}
        />

        <input
          type="number"
          placeholder="Tax / VAT %"
          value={tax}
          onChange={(e) =>
            setTax(
              e.target.value
            )
          }
          style={input(darkMode)}
        />

        {/* CART ITEMS */}

        <div style={styles.cartItems}>

          {
            cart.length === 0

              ? (
                <div style={styles.empty}>
                  Cart empty
                </div>
              )

              : (

                cart.map(
                  (item) => (

                    <div
                      key={item.id}

                      style={
                        styles.cartItem
                      }
                    >

                      <div>

                        <h4>
                          {item.name}
                        </h4>

                        <p style={styles.price}>
                          $
                          {
                            item.sellPrice
                          }
                        </p>

                      </div>

                      <div style={styles.qtyWrapper}>

                        <button
                          onClick={() =>
                            decreaseQty(
                              item.id
                            )
                          }
                          style={qtyBtn}
                        >
                          -
                        </button>

                        <strong>
                          {item.qty}
                        </strong>

                        <button
                          onClick={() =>
                            increaseQty(
                              item.id
                            )
                          }
                          style={qtyBtn}
                        >
                          +
                        </button>

                      </div>

                    </div>
                  )
                )
              )
          }

        </div>

        {/* TOTALS */}

        <div style={styles.totalBox}>

          <p style={styles.gray}>
            Subtotal:
            $
            {
              subtotal.toFixed(2)
            }
          </p>

          <p style={styles.gray}>
            Discount:
            -$
            {
              discount.toFixed(2)
            }
          </p>

          <p style={styles.gray}>
            Tax:
            +$
            {
              taxAmount.toFixed(2)
            }
          </p>

          <h2>
            Total:
            $
            {
              total.toFixed(2)
            }
          </h2>

          <p style={styles.gray}>
            Paid:
            $
            {
              paid.toFixed(2)
            }
          </p>

          <p
            style={{
              color:
                debt > 0
                  ? "#dc2626"
                  : "#16a34a",

              fontWeight:
                "bold",
            }}
          >
            Debt:
            $
            {
              debt.toFixed(2)
            }
          </p>

          <button
            onClick={
              handlePrintInvoice
            }

            style={
              styles.invoiceButton
            }
          >
            Print Invoice
          </button>

          <button
            onClick={
              completeSale
            }

            disabled={
              loading
            }

            style={{
              ...styles.completeButton,

              opacity:
                loading
                  ? 0.7
                  : 1,
            }}
          >

            {
              loading
                ? "Processing..."
                : "Complete Sale"
            }

          </button>

        </div>

      </div>

      {/* HIDDEN INVOICE */}

      <div
        style={{
          position:
            "absolute",

          left: "-9999px",

          top: 0,
        }}
      >

        <Invoice
          ref={invoiceRef}

          cart={cart}

          customerName={
            customerName
          }

          customerPhone={
            customerPhone
          }

          total={total}

          subtotal={
            subtotal
          }

          taxAmount={
            taxAmount
          }

          discount={
            discount
          }

          paid={paid}

          debt={debt}
        />

      </div>

    </div>
  );
}

const styles = {

  container: {
    width: "100%",
    minHeight: "100vh",
    padding: "14px",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",

    gap: "20px",

    overflowX: "hidden",

    boxSizing: "border-box",
  },

  mobileTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  menuButton: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
  },

  title: {
    margin: 0,
    fontSize:
      "clamp(28px,5vw,34px)",
  },

  subtitle: {
    marginTop: "8px",
    fontSize: "14px",
  },

  medicineGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: "16px",
  },

  card: {
    padding: "18px",
    borderRadius: "20px",

    display: "flex",
    flexDirection: "column",

    justifyContent:
      "space-between",

    gap: "18px",
  },

  addButton: {
    width: "100%",
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  cartSection: {
    borderRadius: "20px",
    padding: "18px",
  },

  cartItems: {
    marginTop: "18px",
  },

  cartItem: {
    display: "flex",
    justifyContent:
      "space-between",

    alignItems: "center",

    padding: "14px 0",
  },

  qtyWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  totalBox: {
    marginTop: "20px",
  },

  completeButton: {
    width: "100%",
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "15px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },

  invoiceButton: {
    width: "100%",
    background: "#0ea5e9",
    color: "#ffffff",
    border: "none",
    padding: "14px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },

  gray: {
    color: "#94a3b8",
  },

  stock: {
    color: "#22c55e",
    fontWeight: "bold",
  },

  price: {
    color: "#22c55e",
  },

  empty: {
    textAlign: "center",
    padding: "30px 0",
    color: "#94a3b8",
  },
};

const input =
  (darkMode) => ({

    width: "100%",

    padding: "14px",

    borderRadius: "14px",

    border:
      darkMode
        ? "1px solid #374151"
        : "1px solid #d1d5db",

    background:
      darkMode
        ? "#0f172a"
        : "#ffffff",

    color:
      darkMode
        ? "#ffffff"
        : "#111827",

    outline: "none",

    boxSizing: "border-box",

    fontSize: "14px",

    marginBottom: "14px",
  });

const qtyBtn = {

  width: "32px",

  height: "32px",

  border: "none",

  borderRadius: "8px",

  background: "#16a34a",

  color: "#ffffff",

  cursor: "pointer",

  fontWeight: "bold",
};

export default POS;