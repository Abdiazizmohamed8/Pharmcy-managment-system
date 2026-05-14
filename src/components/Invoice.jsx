import React,
{
  forwardRef,
} from "react";

const Invoice = forwardRef(

  (
    {
      cart,
      customerName,
      customerPhone,
      total,
      subtotal,
      taxAmount,
      discount,
      paid,
      debt,
    },

    ref
  ) => {

    return (

      <div
        ref={ref}

        style={{
          width: "100%",

          maxWidth: "900px",

          margin: "0 auto",

          background: "#ffffff",

          color: "#000",

          fontFamily:
            "Arial",

          border:
            "1px solid #ddd",
        }}
      >

        {/* HEADER */}

        <table
          style={{
            width: "100%",

            borderCollapse:
              "collapse",

            background:
              "#155e75",

            color: "#ffffff",
          }}
        >

          <tbody>

            <tr>

              <td
                style={{
                  padding:
                    "40px",

                  width: "60%",
                }}
              >

                <h1
                  style={{
                    margin: 0,

                    fontSize:
                      "60px",

                    fontWeight:
                      "300",

                    letterSpacing:
                      "2px",
                  }}
                >
                  INVOICE
                </h1>

              </td>

              <td
                style={{
                  padding:
                    "40px",

                  textAlign:
                    "right",

                  fontSize:
                    "14px",

                  lineHeight:
                    "26px",
                }}
              >

                <strong>
                  ANFAC
                  PHARMACY
                </strong>

                <br />

                Mogadishu
                Somalia

                <br />

                +252615189953

                <br />

                anfac@gmail.com

              </td>

            </tr>

          </tbody>

        </table>

        {/* CLIENT + INVOICE INFO */}

        <table
          style={{
            width: "100%",

            borderCollapse:
              "collapse",

            marginTop: "40px",
          }}
        >

          <tbody>

            <tr>

              {/* LEFT */}

              <td
                style={{
                  width: "50%",

                  padding:
                    "0 40px",

                  verticalAlign:
                    "top",
                }}
              >

                <table
                  style={{
                    width: "100%",
                  }}
                >

                  <tbody>

                    <tr>

                      <td
                        style={
                          infoLabel
                        }
                      >
                        Invoice No.
                      </td>

                      <td>
                        #
                        {
                          Math.floor(
                            Math.random() *
                            100000
                          )
                        }
                      </td>

                    </tr>

                    <tr>

                      <td
                        style={
                          infoLabel
                        }
                      >
                        Date
                      </td>

                      <td>
                        {
                          new Date()
                            .toLocaleDateString()
                        }
                      </td>

                    </tr>

                    <tr>

                      <td
                        style={
                          infoLabel
                        }
                      >
                        Status
                      </td>

                      <td>
                        {
                          debt > 0
                            ? "Debt"
                            : "Paid"
                        }
                      </td>

                    </tr>

                  </tbody>

                </table>

              </td>

              {/* RIGHT */}

              <td
                style={{
                  width: "50%",

                  padding:
                    "0 40px",

                  verticalAlign:
                    "top",

                  textAlign:
                    "right",
                }}
              >

                <h3
                  style={{
                    marginBottom:
                      "14px",

                    fontSize:
                      "24px",
                  }}
                >
                  Bill To
                </h3>

                <table
                  style={{
                    width: "100%",
                  }}
                >

                  <tbody>

                    <tr>

                      <td
                        style={{
                          fontWeight:
                            "bold",

                          paddingBottom:
                            "10px",
                        }}
                      >
                        Customer Name:
                      </td>

                    </tr>

                    <tr>

                      <td
                        style={{
                          paddingBottom:
                            "14px",

                          fontSize:
                            "20px",

                          color:
                            "#155e75",

                          fontWeight:
                            "bold",
                        }}
                      >
                        {
                          customerName ||
                          "Customer Name"
                        }
                      </td>

                    </tr>

                    <tr>

                      <td
                        style={{
                          fontWeight:
                            "bold",

                          paddingBottom:
                            "10px",
                        }}
                      >
                        Phone:
                      </td>

                    </tr>

                    <tr>

                      <td>
                        {
                          customerPhone ||
                          "No Phone"
                        }
                      </td>

                    </tr>

                  </tbody>

                </table>

              </td>

            </tr>

          </tbody>

        </table>

        {/* ITEMS */}

        <div
          style={{
            padding:
              "40px",
          }}
        >

          <table
            style={{
              width: "100%",

              borderCollapse:
                "collapse",
            }}
          >

            <thead>

              <tr
                style={{
                  borderTop:
                    "2px solid #555",

                  borderBottom:
                    "2px solid #555",

                  background:
                    "#f8fafc",
                }}
              >

                <th
                  style={
                    tableHead
                  }
                >
                  Item
                </th>

                <th
                  style={
                    tableHead
                  }
                >
                  Medicine
                </th>

                <th
                  style={
                    tableHead
                  }
                >
                  Qty
                </th>

                <th
                  style={
                    tableHead
                  }
                >
                  Rate
                </th>

                <th
                  style={
                    tableHead
                  }
                >
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              {
                cart.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={index}

                      style={{
                        borderBottom:
                          "1px solid #ddd",
                      }}
                    >

                      <td
                        style={
                          tableCell
                        }
                      >
                        {
                          index + 1
                        }
                      </td>

                      <td
                        style={
                          tableCell
                        }
                      >
                        {item.name}
                      </td>

                      <td
                        style={
                          tableCell
                        }
                      >
                        {item.qty}
                      </td>

                      <td
                        style={
                          tableCell
                        }
                      >
                        $
                        {
                          item.sellPrice
                        }
                      </td>

                      <td
                        style={
                          tableCell
                        }
                      >
                        $
                        {
                          (
                            item.sellPrice *
                            item.qty
                          ).toFixed(
                            2
                          )
                        }
                      </td>

                    </tr>
                  )
                )
              }

              {/* EMPTY ROWS */}

              {
                Array.from({
                  length:
                    Math.max(
                      0,
                      5 -
                      cart.length
                    ),
                }).map(
                  (
                    _,
                    index
                  ) => (

                    <tr
                      key={
                        "empty-" +
                        index
                      }

                      style={{
                        height:
                          "50px",

                        borderBottom:
                          "1px solid #ddd",
                      }}
                    >

                      <td
                        style={
                          tableCell
                        }
                      ></td>

                      <td
                        style={
                          tableCell
                        }
                      ></td>

                      <td
                        style={
                          tableCell
                        }
                      ></td>

                      <td
                        style={
                          tableCell
                        }
                      ></td>

                      <td
                        style={
                          tableCell
                        }
                      ></td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

          {/* TOTALS */}

          <table
            style={{
              width: "320px",

              marginLeft:
                "auto",

              marginTop: "30px",

              borderCollapse:
                "collapse",
            }}
          >

            <tbody>

              <tr>

                <td
                  style={
                    totalLabel
                  }
                >
                  Subtotal
                </td>

                <td
                  style={
                    totalValue
                  }
                >
                  $
                  {
                    subtotal.toFixed(
                      2
                    )
                  }
                </td>

              </tr>

              <tr>

                <td
                  style={
                    totalLabel
                  }
                >
                  Discount
                </td>

                <td
                  style={
                    totalValue
                  }
                >
                  $
                  {
                    discount.toFixed(
                      2
                    )
                  }
                </td>

              </tr>

              <tr>

                <td
                  style={
                    totalLabel
                  }
                >
                  Tax
                </td>

                <td
                  style={
                    totalValue
                  }
                >
                  $
                  {
                    taxAmount.toFixed(
                      2
                    )
                  }
                </td>

              </tr>

              <tr>

                <td
                  style={
                    totalLabel
                  }
                >
                  Paid
                </td>

                <td
                  style={
                    totalValue
                  }
                >
                  $
                  {
                    paid.toFixed(
                      2
                    )
                  }
                </td>

              </tr>

              <tr
                style={{
                  borderTop:
                    "2px solid #555",
                }}
              >

                <td
                  style={{
                    ...totalLabel,

                    fontWeight:
                      "bold",

                    fontSize:
                      "18px",
                  }}
                >
                  Total
                </td>

                <td
                  style={{
                    ...totalValue,

                    background:
                      "#e0f2fe",

                    fontWeight:
                      "bold",

                    fontSize:
                      "18px",
                  }}
                >
                  $
                  {
                    total.toFixed(
                      2
                    )
                  }
                </td>

              </tr>

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <table
          style={{
            width: "100%",

            background:
              "#155e75",

            color: "#ffffff",

            marginTop: "40px",
          }}
        >

          <tbody>

            <tr>

              <td
                style={{
                  textAlign:
                    "center",

                  padding:
                    "20px",

                  fontWeight:
                    "bold",
                }}
              >

                Thank you
                for your
                business!

              </td>

            </tr>

          </tbody>

        </table>

      </div>
    );
  }
);

const infoLabel = {

  fontWeight: "bold",

  paddingBottom:
    "14px",

  width: "140px",
};

const tableHead = {

  padding: "14px",

  textAlign: "left",

  fontSize: "15px",
};

const tableCell = {

  padding: "14px",

  fontSize: "14px",
};

const totalLabel = {

  padding: "12px",

  fontWeight: "bold",
};

const totalValue = {

  padding: "12px",

  textAlign: "right",
};

export default Invoice;