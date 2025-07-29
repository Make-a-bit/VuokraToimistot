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
        path: "/verot", label: "Verokannat"
    },
]

export default navigationLinks;