#include "Ping.h"
#include <Arduino.h>

sonarPing::sonarPing(int echo, int trig) {
   echo_pin = echo;
   trig_pin = trig;
   pinMode(echo_pin, INPUT);
   pinMode(trig_pin, OUTPUT);
}
int sonarPing::Ping_cm() {
    unsigned long duration,distance_cm;
    digitalWrite(trig_pin, LOW); //Annetaan lyhyt matala pulssi, jotta saadaan puhdas korkea pulssi
    delayMicroseconds(2);
    digitalWrite(trig_pin, HIGH); //Annetaan 10 mikrosekunnin mittainen korkea pulssi
    delayMicroseconds(10);
    digitalWrite(trig_pin, LOW);
  
    duration = pulseIn(echo_pin, HIGH, 10000); //Luetaan aika, joka pulssilla kestää palata anturiin.
    distance_cm = (0.0343*duration)/2; //Muutetaan aika etäisyydeksi tällä kaavalla: Äänen nopeus ilmassa = 0.0343cm/mikrosekunti

    return (uint8_t)distance_cm; //Palautetaan arvo kutsuvaan ohjelmaan
}

   