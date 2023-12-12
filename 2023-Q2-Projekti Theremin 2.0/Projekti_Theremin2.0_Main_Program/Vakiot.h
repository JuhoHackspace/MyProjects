#ifndef VAKIOT_H
#define VAKIOT_H
#define BAUDINOPEUS 9600

//Globaalit vakiot

//Määritellään pinnit vakioiksi
const int echo_pin_1 = 12; //Ensimmäisen sonarin pinnit
const int trig_pin_1 = 11;
const int echo_pin_2 = 10; //Toisen sonarin pinnit
const int trig_pin_2 = 9;
const int BUTTON1_PIN = 2; 
const int BUTTON2_PIN = 3;

//Määritellään vakiot etäisyysmuunnoksia varten
const uint8_t max_dist = 80; //Maximi etäisyys kädelle
const uint8_t min_dist = 10; //Minimi etäisyys kädelle
const uint8_t out_of_range_limit = 30; //Montako jaksoa käden tulee olla pois etäisyysväliltä, että ääni pysähtyy

#endif