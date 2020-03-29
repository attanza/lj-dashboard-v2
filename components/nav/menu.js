export const adminItems = [
  { title: "Dashboard", icon: "dashboard", to: "/" },
  {
    title: "Role Permission",
    icon: "pan_tool",
    to: "/roles",
    hasChild: true,
    children: [
      { title: "Role", icon: "format_line_spacing", to: "/roles" },
      {
        title: "Permission",
        icon: "format_list_bulleted",
        to: "/permissions"
      }
    ]
  },
  {
    title: "User",
    icon: "account_circle",
    to: "/users",
    hasChild: true,
    children: [
      { title: "User", icon: "perm_identity", to: "/users" },
      { title: "Supervisor", icon: "perm_identity", to: "/supervisors" }
    ]
  },
  {
    title: "Kampus",
    icon: "account_balance",
    to: "/universities",
    hasChild: true,
    children: [
      {
        title: "Perguruan Tinggi",
        icon: "account_balance",
        to: "/universities"
      },
      {
        title: "Nama Studi",
        icon: "description",
        to: "/study-names"
      },
      {
        title: "Program Studi",
        icon: "library_books",
        to: "/study-programs"
      }
    ]
  },
  {
    title: "Marketing",
    icon: "supervised_user_circle",
    to: "/marketings",
    hasChild: true,
    children: [
      {
        title: "List",
        icon: "supervised_user_circle",
        to: "/marketings"
      },
      {
        title: "Aksi",
        icon: "list",
        to: "/marketing-actions"
      },
      {
        title: "Target",
        icon: "launch",
        to: "/targets"
      },
      {
        title: "Jadwal",
        icon: "date_range",
        to: "/schedulles"
      },
      {
        title: "Laporan",
        icon: "find_in_page",
        to: "/marketing-reports"
      }
    ]
  },
  {
    title: "Down Payment",
    icon: "money",
    to: "/down-payments"
  },
  {
    title: "Produk",
    icon: "markunread_mailbox",
    to: "/products",
    hasChild: true,
    children: [
      {
        title: "Produk",
        icon: "markunread_mailbox",
        to: "/products"
      },
      {
        title: "Order Produk",
        icon: "inbox",
        to: "/online-product-orders"
      }
    ]
  },
  {
    title: "Referral",
    icon: "euro_symbol",
    to: "/referrals"
  },
  {
    title: "Kontak",
    icon: "contact_phone",
    to: "/contacts"
  }
]

export const supervisorItems = [
  { title: "Dashboard", icon: "dashboard", to: "/" },
  {
    title: "Kampus",
    icon: "account_balance",
    to: "/universities",
    hasChild: true,
    children: [
      {
        title: "Perguruan Tinggi",
        icon: "account_balance",
        to: "/universities"
      },
      {
        title: "Nama Studi",
        icon: "description",
        to: "/study-names"
      },
      {
        title: "Program Studi",
        icon: "library_books",
        to: "/study-programs"
      }
    ]
  },
  {
    title: "Marketing",
    icon: "supervised_user_circle",
    to: "/marketings",
    hasChild: true,
    children: [
      {
        title: "List",
        icon: "supervised_user_circle",
        to: "/marketings"
      },
      {
        title: "Aksi",
        icon: "list",
        to: "/marketing-actions"
      },
      {
        title: "Target",
        icon: "launch",
        to: "/targets"
      },
      {
        title: "Jadwal",
        icon: "date_range",
        to: "/schedulles"
      },
      {
        title: "Laporan",
        icon: "find_in_page",
        to: "/marketing-reports"
      }
    ]
  },
  {
    title: "Down Payment",
    icon: "money",
    to: "/down-payments"
  },
  {
    title: "Kontak",
    icon: "contact_phone",
    to: "/contacts"
  },
  {
    title: "Lampiran",
    icon: "attach_file",
    to: "/attachments"
  }
]
