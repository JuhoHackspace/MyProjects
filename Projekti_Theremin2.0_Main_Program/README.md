# Group_1 - Projekti Theremin 2.0

**Tästä repositiosta löytyy OAMK tietotekniikan opiskelijoiden:**
- Ryhmä 1 - Kevät 2023 - Projekti Theremin 2.0 -projektin tiedostot

**Tekijät:**
- Juho Hietala
- Janne Paaso
- Oliver Jäälehto
- Tauno Jokinen	

**Projektin tarkoitus ja tavoitteet*

Projekti Theremin 2.0 on Oulun ammattikorkeakoulun ensimmäisen vuoden ICT alan insinööriopiskelijoiden ryhmäprojekti. Projekti toteutettiin toisella periodilla Tietotekniikan sovellusprojektina.

Projektin tarkoitus oli opetella soveltamaan ensimmäisellä periodilla opittuja taitoja ohjelmoinnista, digitaalitekniikasta sekä elektroniikasta.

**Projektin idea ja toteutus**

Projekti Theremin 2.0:n idea on rakentaa Arduino mikro-ohjain alustaa sekä oheiskomponentteja käyttäen Theremin soitinta muistuttava kokonaisuus digitaalisena versiona.

Projektissa Arduinoon kytkettiin kaksi HCSR-04 ultraääni etäisyysanturia, ryhmän itsensä rakentama DA-muunnin, kaiutin sekä kaksi painonappia. Projekti ohjelmointiin Arduino IDE kehitysympäristöllä C++ kieltä käyttäen.

Ohjelmassa luetaan molempia etäisyysantureita ohjelman loop funktiossa vuorotellen. Etäisyydet muutetaan indeksi arvoiksi, jolla puolestaan luetaan moniulotteista nuottitaulukkoa. Valitun nuotin taajuus saadaan aikaan käyttäen prosessorin keskeytyksiä ja säätämällä keskeytysten tahti taajuutta vastaavaksi. Keskeytyspalvelijan avulla DA-muuntimelle syötetään 8 bittisiä arvoja erillisesta sini-aalto taulukosta. Täten ulostuleva ääni on lähes puhdasta siniaaltoa.

Toisen anturin tarkoitus on lukea nuottitaulukon riviä, joka vastaa soitettavaa oktaavia. Toisen puolestaan nuottitaulukon saraketta, joka vastaa soitettavaa nuottia. Täten käsiä heiluttelemalla voidaan siirtyä oktaavien sekä nuottien välillä, antaen soittajan käyttöön isomman nuottiskaalan. Ohjelmassa on myös valittavissa painonappien avulla käytettäväksi seitsemän eri nuottiskaalaa A-F. Nämä skaalat ovat taulukon ensimmäinen ulottuvuus.

Ohjelmassa on huomioitu myös antureiden epätarkkuus. Epätarkkuutta ja nuottien "heittelehtimistä" on pyritty minimoimaan käyttäen hystereesis periaatetta. Tämä sovellettiin erillisten etäisyyden raja-arvotaulukoiden avulla.

**Projektin lopputulos**

Ryhmä sai aikaan Theremin soittimen digitaalisen version. Ohjelma toimii odotetulla tavalla, ja käyttäjällä on valittavissa useita eri nuottiskaaloja. Projektissa ryhmä perehtyi mikro-ohjaimen ohjelmointiin, signaalinkäsittelyyn sekä elektroniikkaan. Projektin tavoitteet toteutuivat ja ryhmä sai projektista kiitettävän arvosanan.