# VuokraToimistot APP

## Kuvaus

VuokraToimistot oli alun perin kouluprojekti vuonna 2024, joka toteutettiin ryhmätyönä viiden hengen ryhmässä. Tehtävässä kuvitteellinen toimistotiloja vuokraava yhtiö oli laajentamassa toimintaansa yhdeltä paikkakunnalta useaan kaupunkiin. Yhtiö tarjoaa asiakkaille eri kokoisia, kalustettuja, paikkakunnittain vaihtelevia toimistotiloja vuokralle 1–8 hengelle. Tilojen vuokra-ajat vaihtelevat yhdestä päivästä useisiin kuukausiin. Tilojen lisäksi vuokralle tarjotaan myös laitteita ja palveluja. Asiakkaita voivat olla yksittäiset työntekijät, yritykset sekä yhteisöt.

Toimintaa varten yritys tarvitsi keskitetyn varaus- ja asiakashallintajärjestelmän, jonka tavoitteena on mahdollistaa reaaliaikainen toimipisteiden varaustilanteen seuranta ja raportointi. Alkuperäinen toteutus tehtiin WPF-sovelluksena käyttäen vesiputousmallia ja MariaDB-tietokantaa. Osana jatkokehitysehdotuksia esille tuotiin ajatus web-sovelluksen rakentamisesta ja pilvipalveluun siirtymisestä. Nykyinen sovellus on tämän kehityssuunnan ensimmäinen toteutus.

Vein projektia itsenäisesti eteenpäin harrastepohjalta kesällä 2026. Sovelluksen kehitys oli paikoin haastavaa, erityisesti käyttöliittymän osalta, ja joidenkin toimintojen kanssa tuli painittua pitkään. Suunnittelun puutteet aiheuttivat lisätyötä kehitysvaiheessa, mikä johti useiden asioiden tekemiseen useampaan kertaan. Projektin aikana opettelin myös Reactin ja Reduxin käyttöä. Lopputuloksena syntyi MVP-versio, jossa API, tietokanta ja käyttöliittymä toimivat yhdessä. Sovellus on julkaistu Microsoft Azuressa seuraavilla resursseilla:

- App Service
- Static Web App
- SQL database

Alkuperäisessä vaatimusmäärittelyssä sovellukseen vaadittiin selkeä raportointi sekä laskutusmahdollisuudet (paperi/sähköposti). Kaikkea en kuitenkaan ehtinyt toteuttamaan valmiiksi, sillä elokuun alkaessa muut projektit veivät ajan. Seuraavat kehityskohteet ovat edelleen työn alla:

- Raportointi
- Laskutusmahdollisuus
- Logitus taustajärjestelmään
- Kielituki ja muita vähemmän tärkeitä viilauksia

## Arkkitehtuuri

**Backend:**

- .NET 9 (ASP.NET Core)
- RESTful API
- JWT-pohjainen autentikointi
- SQL Server tietokantayhteys

**Frontend:**

- React (Single Page Application)
- Redux & React-Redux
- MUI (Material UI)
- Dayjs

**Projektinhallinta ja versionhallinta:**

- Projektinhallinta: Azure DevOps
- Versionhallinta: Git
