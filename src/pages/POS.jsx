import { useState } from "react";

function POS({
  medicines,
  setMedicines,
  sales,
  setSales,
  customers,
  setCustomers,
  toast,
}) {

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

  /* SEARCH */
  const filteredMedicines =
    medicines.filter(
      (medicine) =>
        medicine.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* ADD TO CART */
  const addToCart = (
    medicine
  ) => {

    const exists =
      cart.find(
        (item) =>
          item.id ===
          medicine.id
      );

    if (exists) {

      setCart(
        cart.map((item) =>

          item.id ===
          medicine.id

            ? {
                ...item,
                qty:
                  item.qty +
                  1,
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
  };

  /* QTY */
  const increaseQty = (
    id
  ) => {

    setCart(
      cart.map((item) =>

        item.id === id

          ? {
              ...item,
              qty:
                item.qty +
                1,
            }

          : item
      )
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
                  item.qty -
                  1,
              }

            : item
        )
        .filter(
          (item) =>
            item.qty > 0
        )
    );
  };

  /* TOTAL */
  const total =
    cart.reduce(
      (acc, item) =>

        acc +
        item.sellPrice *
          item.qty,

      0
    );

  /* COMPLETE SALE */
  const completeSale =
    () => {

      if (
        cart.length === 0
      ) {

        toast(
          "Cart is empty"
        );

        return;
      }

      if (
        !customerName
      ) {

        toast(
          "Enter customer name"
        );

        return;
      }

      const paid =
        Number(
          paidAmount
        ) || 0;

      let status =
        "Paid";

      let debtAmount =
        0;

      /* FULL DEBT */
      if (
        paymentMethod ===
        "Debt"
      ) {

        status =
          "Unpaid";

        debtAmount =
          total;
      }

      /* PARTIAL */
      else if (
        paid < total
      ) {

        status =
          "Partial";

        debtAmount =
          total - paid;
      }

      /* SALE */
      const newSale = {
        id:
          "INV-" +
          Date.now(),

        customer:
          customerName,

        phone:
          customerPhone,

        address:
          customerAddress,

        items: cart,

        total,

        paid,

        debt:
          debtAmount,

        method:
          paymentMethod,

        status,

        date:
          new Date()
            .toISOString()
            .split(
              "T"
            )[0],
      };

      /* SAVE SALES */
      setSales([
        newSale,
        ...sales,
      ]);

      /* UPDATE STOCK */
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

      /* CUSTOMER */
      const existingCustomer =
        customers.find(
          (customer) =>

            customer.name ===
            customerName
        );

      if (
        existingCustomer
      ) {

        const updatedCustomers =
          customers.map(
            (
              customer
            ) => {

              if (
                customer.name ===
                customerName
              ) {

                return {
                  ...customer,

                  phone:
                    customerPhone,

                  address:
                    customerAddress,

                  debt:
                    Number(
                      customer.debt ||
                        0
                    ) +
                    debtAmount,
                };
              }

              return customer;
            }
          );

        setCustomers(
          updatedCustomers
        );

      } else {

        const newCustomer =
          {
            id:
              Date.now(),

            name:
              customerName,

            phone:
              customerPhone,

            address:
              customerAddress,

            debt:
              debtAmount,

            joined:
              new Date()
                .toISOString()
                .split(
                  "T"
                )[0],
          };

        setCustomers([
          ...customers,
          newCustomer,
        ]);
      }

      /* SUCCESS MESSAGE */
      if (
        status ===
        "Partial"
      ) {

        toast(
          `Paid $${paid.toFixed(
            2
          )} | Remaining Debt $${debtAmount.toFixed(
            2
          )}`
        );

      } else if (
        status ===
        "Unpaid"
      ) {

        toast(
          `Debt added $${debtAmount.toFixed(
            2
          )}`
        );

      } else {

        toast(
          "Sale completed"
        );
      }

      /* RESET */
      setCart([]);

      setCustomerName(
        ""
      );

      setCustomerPhone(
        ""
      );

      setCustomerAddress(
        ""
      );

      setPaidAmount("");

      setPaymentMethod(
        "Cash"
      );
    };

  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "2fr 1fr",

        gap: "24px",
      }}
    >

      {/* LEFT */}
      <div>

        <h1
          style={{
            fontSize: "48px",
            marginBottom:
              "10px",
          }}
        >
          POS / Sales 🛒
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom:
              "24px",
          }}
        >
          Pharmacy sales system
        </p>

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
            padding: "18px",
            borderRadius:
              "16px",
            border:
              "1px solid #d1d5db",
            marginBottom:
              "28px",
            fontSize:
              "16px",
          }}
        />

        {/* MEDICINES */}
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fill,minmax(260px,1fr))",

            gap: "20px",
          }}
        >

          {filteredMedicines.map(
            (medicine) => (

              <div
                key={
                  medicine.id
                }
                onClick={() =>
                  addToCart(
                    medicine
                  )
                }
                style={{
                  background:
                    "#fff",

                  borderRadius:
                    "24px",

                  padding:
                    "22px",

                  cursor:
                    "pointer",

                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.05)",
                }}
              >

                <div
                  style={{
                    width: "70px",
                    height:
                      "70px",

                    borderRadius:
                      "20px",

                    background:
                      "#dcfce7",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    fontSize:
                      "38px",

                    marginBottom:
                      "20px",
                  }}
                >
                  💊
                </div>

                <p
                  style={{
                    color:
                      "#9ca3af",

                    fontWeight:
                      "bold",

                    marginBottom:
                      "8px",
                  }}
                >
                  MEDICINE NAME
                </p>

                <h2>
                  {
                    medicine.name
                  }
                </h2>

                <p
                  style={{
                    color:
                      "#9ca3af",

                    fontWeight:
                      "bold",

                    marginTop:
                      "20px",

                    marginBottom:
                      "8px",
                  }}
                >
                  CATEGORY
                </p>

                <div
                  style={{
                    display:
                      "inline-block",

                    background:
                      "#dcfce7",

                    color:
                      "#16a34a",

                    padding:
                      "8px 14px",

                    borderRadius:
                      "999px",

                    fontWeight:
                      "bold",
                  }}
                >
                  {
                    medicine.category
                  }
                </div>

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    marginTop:
                      "24px",
                  }}
                >

                  <div>
                    <p
                      style={{
                        color:
                          "#9ca3af",

                        fontWeight:
                          "bold",
                      }}
                    >
                      STOCK
                    </p>

                    <h2
                      style={{
                        color:
                          "#16a34a",
                      }}
                    >
                      {
                        medicine.stock
                      }
                    </h2>
                  </div>

                  <div>
                    <p
                      style={{
                        color:
                          "#9ca3af",

                        fontWeight:
                          "bold",
                      }}
                    >
                      SELL PRICE
                    </p>

                    <h2
                      style={{
                        color:
                          "#16a34a",
                      }}
                    >
                      $
                      {
                        medicine.sellPrice
                      }
                    </h2>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          background:
            "#fff",

          borderRadius:
            "28px",

          padding:
            "28px",

          height:
            "fit-content",

          boxShadow:
            "0 8px 24px rgba(0,0,0,0.05)",
        }}
      >

        <h2
          style={{
            marginTop: 0,
            marginBottom:
              "24px",
          }}
        >
          Cart 🛒
        </h2>

        {/* CUSTOMER */}
        <label style={label}>
          Customer Name
        </label>

        <input
          type="text"
          value={
            customerName
          }
          onChange={(e) =>
            setCustomerName(
              e.target.value
            )
          }
          placeholder="Enter customer name"
          style={input}
        />

        <label style={label}>
          Phone Number
        </label>

        <input
          type="text"
          value={
            customerPhone
          }
          onChange={(e) =>
            setCustomerPhone(
              e.target.value
            )
          }
          placeholder="Enter phone"
          style={input}
        />

        <label style={label}>
          Address
        </label>

        <input
          type="text"
          value={
            customerAddress
          }
          onChange={(e) =>
            setCustomerAddress(
              e.target.value
            )
          }
          placeholder="Enter address"
          style={input}
        />

        {/* PAYMENT */}
        <label style={label}>
          Payment Method
        </label>

        <select
          value={
            paymentMethod
          }
          onChange={(e) =>
            setPaymentMethod(
              e.target.value
            )
          }
          style={input}
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

        {/* PAID */}
        <label style={label}>
          Paid Amount
        </label>

        <input
          type="number"
          value={
            paidAmount
          }
          onChange={(e) =>
            setPaidAmount(
              e.target.value
            )
          }
          placeholder="Enter paid amount"
          style={input}
        />

        {/* CART */}
        <div
          style={{
            marginTop:
              "20px",
          }}
        >

          {cart.length ===
          0 ? (

            <div
              style={{
                textAlign:
                  "center",

                color:
                  "#9ca3af",

                padding:
                  "40px 0",
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

                    borderBottom:
                      "1px solid #f3f4f6",

                    padding:
                      "16px 0",
                  }}
                >

                  <div>

                    <h3
                      style={{
                        margin:
                          "0 0 6px",
                      }}
                    >
                      {
                        item.name
                      }
                    </h3>

                    <p
                      style={{
                        color:
                          "#16a34a",

                        fontWeight:
                          "bold",
                        margin: 0,
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

                      gap: "10px",
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

                    <strong>
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
              "24px",

            borderTop:
              "1px solid #e5e7eb",

            paddingTop:
              "20px",
          }}
        >

          <h2>
            Total: $
            {total.toFixed(
              2
            )}
          </h2>

          {/* PARTIAL INFO */}
          {paidAmount &&
            Number(
              paidAmount
            ) < total &&
            paymentMethod !==
              "Debt" && (

              <div
                style={{
                  marginTop:
                    "10px",

                  background:
                    "#fef3c7",

                  padding:
                    "14px",

                  borderRadius:
                    "12px",

                  color:
                    "#92400e",

                  fontWeight:
                    "bold",
                }}
              >
                Paid:
                {" "}
                $
                {Number(
                  paidAmount
                ).toFixed(
                  2
                )}

                <br />

                Remaining Debt:
                {" "}
                $
                {(
                  total -
                  Number(
                    paidAmount
                  )
                ).toFixed(
                  2
                )}
              </div>
            )}

          <button
            onClick={
              completeSale
            }
            style={{
              width: "100%",

              background:
                "#16a34a",

              color: "#fff",

              border: "none",

              padding:
                "18px",

              borderRadius:
                "16px",

              fontSize:
                "20px",

              fontWeight:
                "bold",

              cursor:
                "pointer",

              marginTop:
                "20px",
            }}
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}

/* STYLES */
const input = {
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  border:
    "1px solid #d1d5db",
  marginBottom: "18px",
  fontSize: "16px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
};

const qtyBtn = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontSize: "22px",
  cursor: "pointer",
};

export default POS;