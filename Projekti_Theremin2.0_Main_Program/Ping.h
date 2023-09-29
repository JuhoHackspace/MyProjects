#ifndef PING_H
#define PING_H
  class sonarPing { //Määritellään luokka ultraääniantureita varten
     public:
     sonarPing(int echo, int trig); //Luokka rakentaja. Pinnit otetaan parametreiksi
     int Ping_cm(); //Luokkafunktio etäisyyden mittaamiseksi
     private:
     int echo_pin; //Näihin tallennetaan luokan sisällä pinnien numerot
     int trig_pin;
  };
#endif