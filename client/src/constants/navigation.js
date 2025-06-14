const navigationLinks = [
    { path: "/", label: "Etusivu" },
    { path: "/asiakkaat/", label: "Asiakkaat" },
    {
        path: "/vuokraus",
        label: "Vuokraus",
        dropdown: [
            { path: "/vuokraus/yleiskatsaus", label: "Yleiskatsaus" },
            { path: "/vuokraus/kohteet", label: "Kohteet" },
            { path: "/vuokraus/toimitilat", label: "Toimitilat" },
        ]
    },
    {
        label: "Muut",
        dropdown: [
            { path: "/muu/1", label: "Muuta 1" },
            { path: "/muu/2", label: "Muuta 2" }
        ]
    },
]

export default navigationLinks;