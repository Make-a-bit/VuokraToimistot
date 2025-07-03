const navigationLinks = [
    { path: "/", label: "Etusivu" },
    { path: "/asiakkaat/", label: "Asiakkaat" },
    {
        label: "Tilahallinta",
        dropdownParent: true,
        dropdown: [
            { path: "/tilahallinta/kohteet", label: "Kohteet" },
            { path: "/tilahallinta/vuokratilat", label: "Vuokratilat" },
            { path: "/tilahallinta/laitteet", label: "Kohteiden laitteet" },
            { path: "/tilahallinta/palvelut", label: "Kohteiden palvelut" },
        ]
    },
    {
        label: "Varaushallinta",
        dropdownParent: true,
        dropdown: [
            { path: "/varaushallinta/varaus", label: "Uusi varaus" },
            { path: "/varaushallinta/varaukset", label: "Varaukset" },
        ]
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