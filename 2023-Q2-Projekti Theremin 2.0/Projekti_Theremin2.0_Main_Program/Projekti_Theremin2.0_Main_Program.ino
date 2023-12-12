//Projekti Theremin 2.0 valmis ohjelma. Toteutettu C++ kielellä. Tekijät: Juho Hietala, Tauno Jokinen, Oliver Jäälehto ja Janne Paaso

#include "Ping.h"
#include "Vakiot.h"
#include "pitches.h"
#include "scales.h"

//Funktioiden prototyypit
void initializeTimer(); //Timerin alustusta varten
void initializeSiniTables(); //Luodaan ääninäytetaulukko
void setRegisterValue(int); //Funktio OCR1n rekisterin arvon muuttamiseksi taajuuden mukaiseksi
void nextDACvalue(); //Funktio jossa DA-muuntimeen syötetään seuraava arvo
void update_col_index(uint8_t); //Sarake indeksin päivitys etäisyys 1 avulla
void update_row_index(uint8_t); //Rivi indeksin päivitys etäisyys 2 avulla
void activateSound(); //Äänen aktivoiminen
void stopSound(); //Äänen pysäytys
void button1PressedInterrupt(); //Keskeytys funktio napille yksi
void button2PressedInterrupt(); //Keskeytys funktio napille kaksi
void printScales(); //Valitun skaalan printtaaminen serial monitorille

//Globaalit muuttujat paino nappeja varten
volatile unsigned long lastTimeButton1Pressed = millis(); //Muuttuja edellistä napin painallus aikaa varten (debouncen eliminoimiseksi)
unsigned long debounceDelay1 = 1000; //Debounce viive millisekunteina
volatile unsigned long lastTimeButton2Pressed = millis();
unsigned long debounceDelay2 = 1000;

//Globaalit muuttujat antureita ja äänentoistoa varten
uint8_t sensor_to_read = 1; //Kumpaa anturia luetaan
bool sound_playing = false; //Lippu joka nostetaan, kun ääni soi
volatile uint8_t index = 0; //Indeksimuuttuja ääninäytetaulukon lukemiseen
int frequency=-1; //Soitettavan äänen taajuus
uint8_t out_of_range_counter_1 = 0; //Muuttuja, jolla lasketaan jaksoja, kun etäisyys 1 ei ole etäisyysvälillä min-max
uint8_t out_of_range_counter_2 = 0; //Sama muuttuja etäisyydelle 2

//Hystereesis raja-arvo taulukot
uint8_t col_min[7]={10,17,27,37,47,57,67}; //Sarake indeksin alaraja-arvot
uint8_t col_max[7]={23,33,43,53,63,73,80}; //Sarake indeksin yläraja-arvot
uint8_t row_min[3]={10,30,50}; //Rivi indeksin alaraja-arvot
uint8_t row_max[3]={39,59,80}; //Rivi indeksin yläraja-arvot

//Globaalit muuttujat nuottitaulukon lukemista varten
int scale_type=0;   // Skaalatyyppi valitsin. Indeksit 0-1. Major-Minor. Taulukon 1. ulottuvuus 
int scale_note=0;   // Skaalat A-G. Indexit 0-6. Skaaloja varten. Taulukon 2. ulottuvuus.
int row_index = -1; // Oktaavin valitsin. Indeksit 0-2. Rivin lukemiseksi nuottitaulukosta. Taulukon 3. ulottuvuus
int col_index = -1; // Nuotin valitsin. Indeksit 0-6. Sarakkeen lukemiseksi nuottitaulukosta. Taulukon 4. ulottuvuus.

//Ääninäytetaulukko ja taulukon koon valinta
const uint8_t samples_per_period = 10; //Näytteiden määrä jaksoa kohden
const uint8_t samples_in_array = 40; //Näytteiden määrä koko taulukossa
unsigned char sini_taulukko[3][samples_in_array]; //Ääninäyte taulukko, sisältää kolme eri aaltomuotoa

sonarPing sonar_1(echo_pin_1,trig_pin_1); //Luodaan olio anturia yksi varten
sonarPing sonar_2(echo_pin_2,trig_pin_2); //Ja anturia kaksi varten

//Keskeytyspalvelija
ISR(TIMER1_COMPA_vect) {
    nextDACvalue(); //Jokaisella compare match keskeytyksellä kutsutaan funktiota, jolla seuraava näyte syötetään da-muuntimelle
}

//Setup funktio. Tässä tehdään tarvittavat alustukset
void setup() {
    Serial.begin(9600); //Avataan sarjayhteys
    initializeTimer(); //Alustetaan Timer 1
    initializeSiniTables(); //Luodaan ääninäytetaulukko
    DDRC |= 0xff; //Asetetaan portti C kirjoitusmoodiin
    pinMode(BUTTON1_PIN, INPUT_PULLUP); //Asetetaan painonappi pinnit input pullup moodiin
    pinMode(BUTTON2_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(BUTTON1_PIN), button1PressedInterrupt, FALLING); //Asetetaan ulkoinen keskeytys painonappi pinneihin 2 ja 3
    attachInterrupt(digitalPinToInterrupt(BUTTON2_PIN), button2PressedInterrupt, FALLING);
}

//Pää luuppi
void loop() {
   //Luetaan etäisyys joko anturista 1 tai 2, vuorotellen
   if(sensor_to_read == 1) { //Kysytään luetaanko anturia yksi
      uint8_t distance_1 = sonar_1.Ping_cm(); //Kutsutaan sonar_1 olion funktiota, josta saadaan paluuarvona etäisyys 1 senttimetreinä
      update_col_index(distance_1); // Päivitetään sarake indeksi etäisyys 1. mukaan
      sensor_to_read = 2; //Vaihdetaan kumpaa anturia luetaan
      //Serial.println(distance_1);
   }
   else {
      uint8_t distance_2= sonar_2.Ping_cm(); //Kutsutaan sonar_2 olion funktiota, josta saadaan paluuarvona etäisyys 2 senttimetreinä
      update_row_index(distance_2); //Päivitetään sarake indeksi etäisyys 2. mukaan
      sensor_to_read = 1; //Vaihdetaan kumpaa anturia luetaan
      //Serial.println(distance_2);
   }
   
   //Mennään ohjelman logiikkaan
   if(row_index!=-1&&col_index!=-1) { //Tarkistetaan, ovatko sekä sarake että rivi-indeksi eri kuin -1, eli ovatko molemmat etäisyydet oikealla alueella
      int new_frequency = scales[scale_type][scale_note][row_index][col_index]; //Haetaan uusi taajuus nuottitaulukosta skaalatyyppi,skaalanuotti,sarake ja rivi-indeksin avulla
      if(new_frequency!=frequency) { //Tarkistetaan onko uusi taajuus eri kuin tämänhetkinen taajuus
         setRegisterValue(new_frequency); //Kutsutaan funktiota, jolla rekisteriarvot ja keskeytystahti säädetään uuden taajuuden mukaiseksi
         frequency = new_frequency; //Päivitetään uusi taajuus nykyiseksi
      }
      if(!sound_playing) { //Tarkistetaan soiko ääni tällä hetkellä
         activateSound(); //Jos ääni ei soi, aktivoidaan ääni
         sound_playing = true; //Nostetaan lippu
      }
   }
   else { //Jos jompikumpi, sarake tai rivi-indeksi on -1, on jompikumpi käsi liikutettu pois etäisyysalueelta. Silloin mennään else haaraan
      if(sound_playing) { //Täällä pysäytetään ääni, mutta ensin tarkistetaan soiko se alunperinkään
        stopSound(); //Pysäyetään ääni
        sound_playing = false; //Lasketaan lippu
      }  
   }
   delayMicroseconds(10000); //Odotetaan täällä sama 10ms, kuin pulseIn funktiolle säädetty odotusaika, jotta pulssit eivät sekoitu keskenään
}


//Funktioiden määrittelyt:

//---------------------------------------------------------------------
void initializeTimer() {
    noInterrupts();

    TCCR1A = 0; //Alustetaan nämä kaksi keskeistä kontrollirekisteriä
    TCCR1B = 0; // ensin nollaksi

    TCCR1B |= (1 << WGM12); // Tämä bitti päälle ja timer on CTC moodissa
    TCCR1B |= (1 << CS10);  //Näillä kolmella bitillä B-rekisterissä
    TCCR1B &= ~(1 << CS11); //Asetetaan kellon esijakaksi 1
    TCCR1B &= ~(1 << CS12); 
    
    interrupts(); //Sallitaan keskeytykset alustuksen päätyttyä
  
}
//---------------------------------------------------------------------
void activateSound()  {
    TIMSK1 |= (1 << OCIE1A); //Aktivoidaan ääni päästämällä keskeytykset prosessorille, eli muutetaan output compare interrupt enable bitti ykköseksi TIMSK1 reskiteristä
}
//---------------------------------------------------------------------
void stopSound() {
    TIMSK1 &= ~(1 << OCIE1A); //Pysäytetään ääni muuttamalla output compare interrupt enable bitti nollaksi TIMSK1 rekisteristä
}
//---------------------------------------------------------------------
void setRegisterValue(int new_frequency) {
   noInterrupts(); //Kielletään keskeytykset säädön ajaksi
   int ocr1a_count = (int)(16000000/(samples_per_period*new_frequency)); //10 näytettä per jakso. 16 000 000 (tikiä/sekunti) / sample_rate => saadaan keskeytystahti 
   OCR1A = ocr1a_count; //Asetetaan laskettu arvo OCR1A rekisteriin
   interrupts(); //Sallitaan jälleen keskeytykset
}
//---------------------------------------------------------------------
void initializeSiniTables() { //Luodaan sinifunktioiden avulla taulukko, jossa 10 näytettä per jakso.
    
      for(int i = 0; i < samples_in_array; i++)
      {
        double sini_perustaajuus = sin(2*PI*i/samples_per_period); //Luodaan loopissa neljä jaksoa perus siniaaltoa
        double sini_toinen_taajuus = sin(2.5*PI*i/samples_per_period);//2 piin kerrannainen 2.5 pii, kolmisointua varten
        double sini_kolmas_taajuus = sin(3*PI*i/samples_per_period); //2.5 piin kerrannainen 3 pii, kolmisointua varten

        double sini = (sini_perustaajuus+sini_toinen_taajuus+sini_kolmas_taajuus)/3; //Lasketaan taajuuksien summa
        sini_taulukko[0][i]=(unsigned char)(127+(125*sini_perustaajuus)); //Luodaan 127 eli 2.5v ympärille ääni aalto perustaajuudella
        sini_taulukko[1][i]=(unsigned char)(127+((sini_perustaajuus+sini_toinen_taajuus)/2*125)); //Sama ensimmäisen ja toisen taajuden summana
        sini_taulukko[2][i]=(unsigned char)(127+(sini*125)); //Sama kaikkien taajuuksien summana
      }
}
//---------------------------------------------------------------------
void nextDACvalue() {
    if(index==samples_in_array) {
       index = 0;
    }
    PORTC = sini_taulukko[0][index]; //Kirjoitetaan porttiin C taulukon arvo kohdassa index
    index++;
}
//---------------------------------------------------------------------
void update_col_index(uint8_t distance) {
   if(distance>=min_dist&&distance<=max_dist) { //Tarkistetaan ollaanko oikealla etäisyysvälillä
        if(col_index==-1) { //Jos sarake indeksi on -1, silloin käsi liikutetaan ensimmäistä kertaa etäisyysvälille, ja valitaan joku indeksi etäisyyden mukaan
           if(distance>=10&&distance<=19) {col_index=0;}
           else if(distance>=20&&distance<=29) {col_index=1;}
           else if(distance>=30&&distance<=39) {col_index=2;}
           else if(distance>=40&&distance<=49) {col_index=3;}
           else if(distance>=50&&distance<=59) {col_index=4;}
           else if(distance>=60&&distance<=69) {col_index=5;}
           else if(distance>=70&&distance<=80) {col_index=6;}
        }
        else { //Jos jokin indeksi on jo valittu, hyödynnetään hystereesis periaatetta, ja mennään else haaraan
           if(distance<col_min[col_index]) { //Jos etäisyys alittaa alaraja-arvon, lasketaan indeksiä
              col_index--;
           }
           else if(distance>col_max[col_index]) {//Jos yläraja-arvo ylitetään, nostetaan indeksiä
              col_index++;
           }
        } 
        out_of_range_counter_1 = 0; //Nollataan kierros counteri aina kun ollaan oikealla etäisyysvälillä
    }
    else if(out_of_range_counter_1<out_of_range_limit) { //Jos ei olla etäisyysvälillä min-max, kysytään onko tämä tila ollut voimassa riittävän monta kierrosta
        out_of_range_counter_1++; //Kasvatetaan kierros counteria, jos counter < out_of_range_limit
    }
    else {  //Jos ei olla etäisyysvälillä, ja tilanne on jatkunut out_of_range_limit määrän kierroksia, mennään else haaraan
        out_of_range_counter_1 = 0; //Nollataan kierros counteri
        col_index = -1; //Asetetaan sarake indeksiksi -1, joka kertoo että ollaan out of range
    }
}
//---------------------------------------------------------------------
void update_row_index(uint8_t distance) { //Tässä funktiossa on eri arvot, mutta toiminnallisuus on sama kuin update_col_index funktiossa
    if(distance>=min_dist&&distance<=max_dist) { //Tarkistetaan ollaanko oikealla etäisyysvälillä...
        if(row_index==-1) {
            if(distance>=10&&distance<=33) {row_index = 0;}
            else if(distance>=34&&distance<=56) {row_index = 1;}
            else if(distance>=57&&distance<=80) {row_index = 2;}
        }
        else {
            if(distance<row_min[row_index]) {
                row_index--;
            }
            else if(distance>row_max[row_index]) {
                row_index++;
            }
        }   
        out_of_range_counter_2 = 0;
    }
    else if(out_of_range_counter_2<out_of_range_limit) {
        out_of_range_counter_2++;
    }
    else {
        out_of_range_counter_2 = 0;
        row_index = -1;
    }
} 
//---------------------------------------------------------------------
//Tämä funktio aktivoidaan ulkoisella keskeytyksellä pinnistä 2
void button1PressedInterrupt(){
  unsigned long timeNow = millis(); //Tallennetaan tämän hetkinen aika
  if (timeNow - lastTimeButton1Pressed > debounceDelay1) { //Tarkistetaan onko edellisestä napin painalluksest kulunut riittävästi aikaa
    lastTimeButton1Pressed = timeNow; //Päivitetään napin painallus aika
    if(scale_note<6) { //Scale_note kiertää 0-6 välillä. Tarkistetaan onko indeksi vähemmän kuin 6
       scale_note++; //Kasvatetaan indeksiä yhdellä
     }
     else { //Jos ollaan indeksissä 6:
       scale_note=0; //Nollataan indeksi
     }
     printScales(); //Printataan nykyinen valittu skaala
  }
}
//------------------------------------------------------//Otetaan tämänhetkinen aika---------------
//Tämä funktio aktivoidaan ulkoisella keskeytyksellä pinnistä 3
void button2PressedInterrupt(){
  unsigned long timeNow = millis(); //Tallennetaan tämänhetkinen aika
  if (timeNow - lastTimeButton2Pressed > debounceDelay2) {//Tarkistetaan onko edellisestä napin painalluksesta kulunut riittävästi aikaa
    lastTimeButton2Pressed = timeNow; //Päivitetään napin painallus aika
    if(scale_type<1) { //Skaalatyyppi indeksi juoksee 0 ja 1 välillä
       scale_type++;
     }
     else {
       scale_type=0;
     }
     printScales(); //Printataan nykyinen valittu skaala
  }
}
//---------------------------------------------------------------------
void printScales() {
  if(scale_note==0){
    Serial.print("A ");
  }
  else if(scale_note==1){
    Serial.print("B ");
  }
  else if(scale_note==2){
    Serial.print("C ");
  }
  else if(scale_note==3){
    Serial.print("D ");
  }
  else if(scale_note==4){
    Serial.print("E ");
  }
  else if(scale_note==5){
    Serial.print("F ");
  }
  else{
    Serial.print("G ");
  }

  if(scale_type==0){
    Serial.print("Major ");
  }
  else{
    Serial.print("Minor ");
  }

  Serial.println(" Scale Selected.");
}