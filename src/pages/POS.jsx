import {
  useState,
} from "react";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import {
  db,
} from "../firebase";

function POS({
  medicines,
  setMedicines,
  sales,
  setSales,
  customers,
  setCustomers,
  toast,
  dark,
}) {

  /* =========================
     STATES
  ========================= */

  const [search, setSearch] =
    useState("");

  const [cart, setCart] =
    useState([]);

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

  /* =========================
     SEARCH
  ========================= */

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

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (
    medicine
  ) => {

    if (
      medicine.stock <= 0
    ) {

      toast(
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

        toast(
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

    toast(
      `${medicine.name} added`
    );
  };

  /* =========================
     QUANTITY
  ========================= */

  const increaseQty = (
    id
  ) => {

    setCart(
      cart.map((item) => {

        if (
          item.id === id
        ) {

          if (
            item.qty >=
            item.stock
          ) {

            toast(
              "No more stock",
              "error"
            );

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

  const decreaseQty = (
    id
  ) => {

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

  /* =========================
     TOTAL
  ========================= */

  const total =
    cart.reduce(
      (acc, item) =>

        acc +
        item.sellPrice *
          item.qty,

      0
    );

  /* =========================
     COMPLETE SALE
  ========================= */

  const completeSale =
    async () => {

      if (
        cart.length === 0
      ) {

        toast(
          "Cart is empty",
          "error"
        );

        return;
      }

      if (
        !customerName
      ) {

        toast(
          "Customer required",
          "error"
        );

        return;
      }

      const totalAmount =
        Number(total);

    const paid =
  Math.max(
    0,

    Number(
      paidAmount || 0
    )
  );

const debtAmount =
  totalAmount - paid;

/* =========================
   STATUS
========================= */

let status =
  "paid";

if (paid <= 0) {

  status =
    "unpaid";

} else if (
  paid < totalAmount
) {

  status =
    "partial";

} else {

  status =
    "paid";
}

      try {

        setLoading(true);

        /* =========================
           SALE OBJECT
        ========================= */

        const newSale = {
    invoice:
    `INV-${sales.length + 1}`,
          customer:
            customerName
              .trim(),

          phone:
            customerPhone
              .trim(),

          address:
            customerAddress
              .trim(),

          items: cart,

          total:
            totalAmount,

          paid:
            paymentMethod ===
            "Debt"

              ? 0

              : paid ||
                totalAmount,

          debt:
            debtAmount,

          method:
            paymentMethod,

          status,

          date:
            new Date()
              .toISOString(),

          createdAt:
            Date.now(),
        };
        

        /* =========================
           SAVE FIREBASE
        ========================= */

        const saleRef =
          await addDoc(
            collection(
              db,
              "sales"
            ),

            newSale
          );

        /* =========================
           UPDATE STOCK
        ========================= */

        for (
          const item of cart
        ) {

          const newStock =
            item.stock -
            item.qty;

          await updateDoc(
            doc(
              db,
              "medicines",
              item.id
            ),

            {
              stock:
                newStock,
            }
          );
        }

        /* =========================
           SAVE CUSTOMER
        ========================= */

        const customerData =
          {
            name:
              customerName
                .trim(),

            phone:
              customerPhone
                .trim(),

            address:
              customerAddress
                .trim(),

            debt:
              debtAmount,

            updatedAt:
              Date.now(),
          };

        await setDoc(
          doc(
            db,
            "customers",

            customerPhone ||
              customerName
          ),

          customerData,

          {
            merge: true,
          }
        );

        /* =========================
           LOCAL UPDATE
        ========================= */

        setSales([
          {
            id:
              saleRef.id,

            ...newSale,
          },

          ...sales,
        ]);

        const updatedMedicines =
          medicines.map(
            (medicine) => {

              const cartItem =
                cart.find(
                  (item) =>
                    item.id ===
                    medicine.id
                );

              if (
                cartItem
              ) {

                return {
                  ...medicine,

                  stock:
                    medicine.stock -
                    cartItem.qty,
                };
              }

              return medicine;
            }
          );

        setMedicines(
          updatedMedicines
        );

        /* =========================
           SUCCESS
        ========================= */

        toast(
          "Sale completed",
          "success"
        );

        /* =========================
           RESET
        ========================= */

        setCart([]);

        setCustomerName("");

        setCustomerPhone("");

        setCustomerAddress("");

        setPaidAmount("");

        setPaymentMethod(
          "Cash"
        );

      } catch (error) {

        console.log(
          error
        );

        toast(
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
        display: "grid",

        gridTemplateColumns:
          "1.7fr 1fr",

        gap: "20px",

        alignItems:
          "start",

        background:
          dark
            ? "#020617"
            : "#f3f4f6",

        minHeight:
          "100vh",
      }}
    >

      {/* LEFT */}

      <div>

        {/* HEADER */}

        <div
          style={{
            marginBottom:
              "20px",
          }}
        >

          <h1
            style={{
              margin: 0,

              fontSize:
                "32px",

              color:
                dark
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            POS / Sales 🛒
          </h1>

          <p
            style={{
              marginTop:
                "8px",

              color:
                dark
                  ? "#d1d5db"
                  : "#6b7280",
            }}
          >
            Pharmacy sales system
          </p>
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
            width: "100%",

            padding:
              "15px 16px",

            borderRadius:
              "14px",

            border:
              dark

                ? "1px solid #374151"

                : "1px solid #d1d5db",

            background:
              dark

                ? "#111827"

                : "#ffffff",

            color:
              dark

                ? "#ffffff"

                : "#111827",

            fontSize:
              "15px",

            outline:
              "none",

            marginBottom:
              "20px",

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
              "20px",

            background:
              dark
                ? "#111827"
                : "#ffffff",

            border:
              dark
                ? "1px solid #1f2937"
                : "1px solid #e5e7eb",
          }}
        >

          <table
            style={{
              width: "100%",

              minWidth:
                "700px",

              borderCollapse:
                "collapse",
            }}
          >

            <thead
              style={{
                background:
                  dark
                    ? "#0f172a"
                    : "#f9fafb",
              }}
            >

              <tr>

                <th style={th(
                  dark
                )}>
                  Medicine
                </th>

                <th style={th(
                  dark
                )}>
                  Category
                </th>

                <th style={th(
                  dark
                )}>
                  Stock
                </th>

                <th style={th(
                  dark
                )}>
                  Price
                </th>

                <th style={th(
                  dark
                )}>
                  Add
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredMedicines.map(
                (
                  medicine
                ) => (

                  <tr
                    key={
                      medicine.id
                    }

                    style={{
                      borderBottom:
                        dark

                          ? "1px solid #1f2937"

                          : "1px solid #f3f4f6",
                    }}
                  >

                    <td
                      style={td(
                        dark
                      )}
                    >
                      {
                        medicine.name
                      }
                    </td>

                    <td
                      style={td(
                        dark
                      )}
                    >
                      {
                        medicine.category
                      }
                    </td>

                    <td
                      style={{
                        ...td(
                          dark
                        ),

                        color:
                          "#22c55e",

                        fontWeight:
                          "bold",
                      }}
                    >
                      {
                        medicine.stock
                      }
                    </td>

                    <td
                      style={{
                        ...td(
                          dark
                        ),

                        color:
                          "#22c55e",

                        fontWeight:
                          "bold",
                      }}
                    >
                      $
                      {
                        medicine.sellPrice
                      }
                    </td>

                    <td
                      style={td(
                        dark
                      )}
                    >

                      <button
                        onClick={() =>
                          addToCart(
                            medicine
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
                            "10px 14px",

                          borderRadius:
                            "10px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "bold",
                        }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT */}

      <div
        style={{
          background:
            dark
              ? "#111827"
              : "#ffffff",

          borderRadius:
            "20px",

          padding:
            "20px",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",

          position:
            "sticky",

          top: "20px",
        }}
      >

        <h2
          style={{
            marginTop: 0,

            marginBottom:
              "20px",

            color:
              dark
                ? "#ffffff"
                : "#111827",
          }}
        >
          Cart 🛒
        </h2>

        <input
          type="text"

          placeholder="Customer Name"

          value={
            customerName
          }

          onChange={(e) =>
            setCustomerName(
              e.target.value
            )
          }

          style={input(
            dark
          )}
        />

        <input
          type="text"

          placeholder="Phone Number"

          value={
            customerPhone
          }

          onChange={(e) =>
            setCustomerPhone(
              e.target.value
            )
          }

          style={input(
            dark
          )}
        />

        <input
          type="text"

          placeholder="Address"

          value={
            customerAddress
          }

          onChange={(e) =>
            setCustomerAddress(
              e.target.value
            )
          }

          style={input(
            dark
          )}
        />

        <select
          value={
            paymentMethod
          }

          onChange={(e) =>
            setPaymentMethod(
              e.target.value
            )
          }

          style={input(
            dark
          )}
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

          value={
            paidAmount
          }

          onChange={(e) =>
            setPaidAmount(
              e.target.value
            )
          }

          style={input(
            dark
          )}
        />

        {/* CART */}

        <div
          style={{
            marginTop:
              "20px",

            maxHeight:
              "320px",

            overflowY:
              "auto",
          }}
        >

          {cart.length ===
          0 ? (

            <div
              style={{
                textAlign:
                  "center",

                color:
                  dark
                    ? "#d1d5db"
                    : "#6b7280",

                padding:
                  "30px 0",
              }}
            >
              Cart is empty
            </div>

          ) : (

            cart.map(
              (item) => (

                <div
                  key={item.id}

                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    padding:
                      "14px 0",

                    borderBottom:
                      dark

                        ? "1px solid #374151"

                        : "1px solid #f3f4f6",
                  }}
                >

                  <div>

                    <h4
                      style={{
                        margin:
                          "0 0 6px",

                        color:
                          dark
                            ? "#ffffff"
                            : "#111827",
                      }}
                    >
                      {
                        item.name
                      }
                    </h4>

                    <p
                      style={{
                        margin: 0,

                        color:
                          "#16a34a",

                        fontWeight:
                          "bold",
                      }}
                    >
                      $
                      {
                        item.sellPrice
                      }
                    </p>
                  </div>

                  <div
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: "8px",
                    }}
                  >

                    <button
                      onClick={() =>
                        decreaseQty(
                          item.id
                        )
                      }

                      style={
                        qtyBtn
                      }
                    >
                      -
                    </button>

                    <strong
                      style={{
                        color:
                          dark
                            ? "#ffffff"
                            : "#111827",
                      }}
                    >
                      {
                        item.qty
                      }
                    </strong>

                    <button
                      onClick={() =>
                        increaseQty(
                          item.id
                        )
                      }

                      style={
                        qtyBtn
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* TOTAL */}

        <div
          style={{
            marginTop:
              "20px",

            borderTop:
              dark

                ? "1px solid #374151"

                : "1px solid #e5e7eb",

            paddingTop:
              "18px",
          }}
        >

          <h2
            style={{
              color:
                dark
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            Total: $
            {total.toFixed(
              2
            )}
          </h2>

          <button
            onClick={
              completeSale
            }

            disabled={
              loading
            }

            style={{
              width: "100%",

              background:
                "#16a34a",

              color:
                "#ffffff",

              border:
                "none",

              padding:
                "16px",

              borderRadius:
                "14px",

              fontSize:
                "16px",

              fontWeight:
                "bold",

              cursor:
                "pointer",

              marginTop:
                "14px",

              opacity:
                loading
                  ? 0.7
                  : 1,
            }}
          >
            {loading
              ? "Processing..."
              : "Complete Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const th = (
  dark
) => ({
  textAlign: "left",

  padding: "16px",

  color:
    dark
      ? "#ffffff"
      : "#374151",

  background:
    dark
      ? "#111827"
      : "#f9fafb",
});

const td = (
  dark
) => ({
  padding: "16px",

  color:
    dark
      ? "#ffffff"
      : "#111827",
});

const input = (
  dark
) => ({
  width: "100%",

  padding:
    "14px",

  borderRadius:
    "14px",

  border:
    dark

      ? "1px solid #374151"

      : "1px solid #d1d5db",

  marginBottom:
    "14px",

  background:
    dark
      ? "#0f172a"
      : "#ffffff",

  color:
    dark
      ? "#ffffff"
      : "#111827",

  outline: "none",

  boxSizing:
    "border-box",
});

const qtyBtn = {
  width: "30px",

  height: "30px",

  border: "none",

  borderRadius:
    "8px",

  background:
    "#16a34a",

  color:
    "#ffffff",

  fontWeight:
    "bold",

  cursor:
    "pointer",
};

export default POS;