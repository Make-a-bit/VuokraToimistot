const navigationLinks = [
    { path: "/", label: "Etusivu" },
    { path: "/asiakkaat/", label: "Asiakkaat" },
    {
        label: "Vuokrakohteet",
        dropdownParent: true,
        dropdown: [
            { path: "/tilahallinta/kohteet", label: "Kohteet" },
            { path: "/tilahallinta/vuokratilat", label: "Vuokratilat" },
            { path: "/tilahallinta/laitteet", label: "Vuokralaitteet" },
            { path: "/tilahallinta/palvelut", label: "Lisäpalvelut" },
        ]
    },
    {
        path: "/varaushallinta", label: "Varaushallinta"
    },
    {
        path: "/laskutus", label: "Laskutus"
    },
    {
        label: "Muut",
        dropdownParent: true,
        dropdown: [
            { path: "/muu/1", label: "Muuta 1" },
            { path: "/muu/2", label: "Muuta 2" }
        ]
    },
]

export default navigationLinks;