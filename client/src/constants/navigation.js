const navigationLinks = [
    { path: "/", label: "Etusivu" },
    { path: "/asiakkaat/", label: "Asiakkaat" },
    {
        path: "/yleiskatsaus",
        label: "Tilojen hallinta",
        dropdown: [
            { path: "/tilahallinta/", label: "Tilahallinta" },
            { path: "/tilahallinta/kohteet", label: "Kohteet" },
            { path: "/tilahallinta/vuokratilat", label: "Vuokratilat" },
            { path: "/tilahallinta/palvelut", label: "Kohteiden palvelut" },
            { path: "/tilahallinta/laitteet", label: "Kohteiden laitteet" },
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