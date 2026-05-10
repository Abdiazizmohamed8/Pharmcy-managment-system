/* =========================
   USERS
========================= */

export const USERS = [
  {
    id: 1,

    name: "Admin User",

    username: "admin",

    password: "1234",

    role: "Admin",

    active: true,

    image: "",
  },

  {
    id: 2,

    name: "Cashier User",

    username: "cashier",

    password: "1234",

    role: "Cashier",

    active: true,

    image: "",
  },
];

/* =========================
   MEDICINES
========================= */

export const MEDICINES_INIT =
  [
    {
      id: 1,

      name:
        "Sharobo Hargab",

      category:
        "Syrup",

      stock: 14,

      minStock: 4,

      buyPrice: 0.85,

      sellPrice: 1.25,

      expiryDate:
        "2027-02-14",

      supplier:
        "Hormuud Pharma",

      createdAt:
        "2026-05-10",
    },

    {
      id: 2,

      name:
        "Panadol",

      category:
        "Tablet",

      stock: 30,

      minStock: 10,

      buyPrice: 0.5,

      sellPrice: 1,

      expiryDate:
        "2027-10-10",

      supplier:
        "Mustaqbal Pharma",

      createdAt:
        "2026-05-10",
    },

    {
      id: 3,

      name:
        "Madax Xanuun",

      category:
        "Capsule",

      stock: 2,

      minStock: 5,

      buyPrice: 0.75,

      sellPrice: 1.25,

      expiryDate:
        "2026-05-10",

      supplier:
        "Hormuud Pharma",

      createdAt:
        "2026-05-10",
    },
  ];

/* =========================
   CUSTOMERS
========================= */

export const CUSTOMERS_INIT =
  [
    {
      id: 1,

      name:
        "Abdiaziz Mohamed",

      phone:
        "617777777",

      address:
        "Kahda",

      debt: 1,

      joined:
        "2026-05-10",
    },

    {
      id: 2,

      name:
        "Ali Farax",

      phone:
        "615555555",

      address:
        "Hodan",

      debt: 0,

      joined:
        "2026-05-10",
    },
  ];

/* =========================
   SUPPLIERS
========================= */

export const SUPPLIERS_INIT =
  [
    {
      id: 1,

      name:
        "Hormuud Pharma",

      phone:
        "618888888",

      address:
        "Bakaaro",

      company:
        "Hormuud",
    },

    {
      id: 2,

      name:
        "Mustaqbal Pharma",

      phone:
        "619999999",

      address:
        "KM4",

      company:
        "Mustaqbal",
    },
  ];

/* =========================
   SALES
========================= */

export const SALES_INIT =
  [
    {
      id:
        "INV-1001",

      customer:
        "Abdiaziz Mohamed",

      phone:
        "617777777",

      address:
        "Kahda",

      medicines: [
        {
          name:
            "Sharobo Hargab",

          qty: 2,

          buyPrice:
            0.85,

          sellPrice:
            1.25,
        },
      ],

      total: 2.5,

      paid: 1.5,

      debt: 1,

      payment:
        "EVC PLUS",

      status:
        "Partial",

      date:
        "2026-05-10",
    },
  ];

/* =========================
   EXPENSES
========================= */

export const EXPENSES_INIT =
  [
    {
      id: 1,

      title:
        "Electricity",

      amount: 20,

      category:
        "Bills",

      date:
        "2026-05-10",
    },

    {
      id: 2,

      title:
        "Water",

      amount: 10,

      category:
        "Bills",

      date:
        "2026-05-10",
    },
  ];