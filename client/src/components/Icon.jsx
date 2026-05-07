const icons = {
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M18 6 6 18M6 6l12 12",
  search: "m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
  bag: "M3 4h2l2.2 10.5a2 2 0 0 0 2 1.5H17a2 2 0 0 0 1.9-1.4L21 8H6.2M9 20h.01M17 20h.01",
  user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
  logout: "M10 17l5-5-5-5M15 12H3M21 3v18",
  admin: "M12 3l8 4v5c0 5-3.4 8.7-8 9-4.6-.3-8-4-8-9V7l8-4Z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3",
  edit: "M12 20h9M16.5 3.5l4 4L8 20H4v-4L16.5 3.5Z",
  package: "M21 16V8l-9-5-9 5v8l9 5 9-5ZM3.3 8 12 13l8.7-5M12 22v-9",
  users: "M17 21a5 5 0 0 0-10 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21a4 4 0 0 0-3-3.8M19 4.5a3 3 0 0 1 0 5.8",
  tag: "M20 13 11 22 2 13V4h9l9 9ZM7.5 8.5h.01",
  receipt: "M7 3h10v18l-2-1-2 1-2-1-2 1-2-1-2 1V3ZM9 8h6M9 12h6M9 16h4",
  arrow: "M5 12h14M13 5l7 7-7 7",
  home: "M3 11 12 3l9 8v10h-6v-6H9v6H3V11Z",
  dashboard: "M4 4h7v7H4V4ZM13 4h7v4h-7V4ZM13 10h7v10h-7V10ZM4 13h7v7H4v-7Z",
  check: "M20 6 9 17l-5-5",
  upload: "M12 16V4M7 9l5-5 5 5M5 20h14",
  image: "M4 5h16v14H4V5ZM8 13l2.5-2.5L14 14l2-2 3 3M8 9h.01",
  chevronDown: "m6 9 6 6 6-6",
  chevronUp: "m18 15-6-6-6 6",
  ban: "M4.93 4.93 19.07 19.07M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  unlock: "M7 11V8a5 5 0 0 1 9.6-2M5 11h14v10H5V11ZM12 15v2",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z",
  truck: "M3 7h11v10H3V7ZM14 11h4l3 3v3h-7v-6ZM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  card: "M3 6h18v12H3V6ZM3 10h18M7 15h4",
};

const Icon = ({ name, className = "h-5 w-5", strokeWidth = 1.8 }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
  >
    <path d={icons[name]} />
  </svg>
);

export default Icon;
