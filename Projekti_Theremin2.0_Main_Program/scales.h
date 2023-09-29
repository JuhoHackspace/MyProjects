#include "pitches.h"

int scales[2][7][3][7]={
  {   // Major Scales:
    {
      // A Major Scale: A – B – C♯ – D – E – F♯ – G♯
      {NOTE_CS3, NOTE_D3, NOTE_E3, NOTE_FS3, NOTE_GS3, NOTE_A3, NOTE_B3},
      {NOTE_B4, NOTE_A4, NOTE_GS4, NOTE_FS4, NOTE_E4, NOTE_D4, NOTE_CS4},
      {NOTE_CS5, NOTE_D5, NOTE_E5, NOTE_FS5, NOTE_GS5, NOTE_A5, NOTE_B5}
    },
    {
      // B Major Scale: B – C♯ – D♯ – E – F♯ – G♯ – A♯
      {NOTE_CS3, NOTE_DS3, NOTE_E3, NOTE_FS3, NOTE_GS3, NOTE_AS3, NOTE_B3},
      {NOTE_B4, NOTE_AS4, NOTE_GS4, NOTE_FS4, NOTE_E4, NOTE_DS4, NOTE_CS4},
      {NOTE_CS5, NOTE_DS5, NOTE_E5, NOTE_FS5, NOTE_GS5, NOTE_AS5, NOTE_B5}
    },
    {
      // C Major Scale: C – D – E – F – G – A – B 
      {NOTE_C3, NOTE_D3, NOTE_E3, NOTE_F3, NOTE_G3, NOTE_A3, NOTE_B3},
      {NOTE_B4, NOTE_A4, NOTE_G4, NOTE_F4, NOTE_E4, NOTE_D4, NOTE_C4},  
      {NOTE_C5, NOTE_D5, NOTE_E5, NOTE_F5, NOTE_G5, NOTE_A5, NOTE_B5}
    },
    {
      // D Major Scale: D – E – F♯ – G – A – B – C♯
      {NOTE_CS3, NOTE_D3, NOTE_E3, NOTE_FS3, NOTE_G3, NOTE_A3, NOTE_B3},
      {NOTE_B4, NOTE_A4, NOTE_G4, NOTE_FS4, NOTE_E4, NOTE_D4, NOTE_CS4},
      {NOTE_CS5, NOTE_D5, NOTE_E5, NOTE_FS5, NOTE_G5, NOTE_A5, NOTE_B5}
    },
    {
      // E Major Scale: E – F♯ – G♯ – A – B – C♯ – D♯ 
      {NOTE_CS3, NOTE_DS3, NOTE_E3, NOTE_FS3, NOTE_GS3, NOTE_A3, NOTE_B3},
      {NOTE_B4, NOTE_A4, NOTE_GS4, NOTE_FS4, NOTE_E4, NOTE_DS4, NOTE_CS4},
      {NOTE_CS5, NOTE_DS5, NOTE_E5, NOTE_FS5, NOTE_GS5, NOTE_A5, NOTE_B5}
    },
    {
      // F Major Scale: F – G – A – B♭ – C – D – E 
      {NOTE_C3, NOTE_D3, NOTE_E3, NOTE_F3, NOTE_G3, NOTE_A3, NOTE_AS3},
      {NOTE_AS4, NOTE_A4, NOTE_G4, NOTE_F4, NOTE_E4, NOTE_D4, NOTE_C4},
      {NOTE_C5, NOTE_D5, NOTE_E5, NOTE_F5, NOTE_G5, NOTE_A5, NOTE_AS5}
    },
    {
      // G Major Scale: G – A – B – C – D – E – F♯ 
      {NOTE_C3, NOTE_D3, NOTE_E3, NOTE_FS3, NOTE_G3, NOTE_A3, NOTE_B3},
      {NOTE_B4, NOTE_A4, NOTE_G4, NOTE_FS4, NOTE_E4, NOTE_D4, NOTE_C4},
      {NOTE_C5, NOTE_D5, NOTE_E5, NOTE_FS5, NOTE_G5, NOTE_A5, NOTE_B5}
    }
  },


  {   //Minor scales
    {
      // A Minor Scale: A – B – C – D – E – F – G 
      {NOTE_C3, NOTE_D3, NOTE_E3, NOTE_F3, NOTE_G3, NOTE_A3, NOTE_B3},
      {NOTE_B4, NOTE_A4, NOTE_G4, NOTE_F4, NOTE_E4, NOTE_D4, NOTE_C4},  
      {NOTE_C5, NOTE_D5, NOTE_E5, NOTE_F5, NOTE_G5, NOTE_A5, NOTE_B5}
    },
    {
      // B Minor Scale: B – C♯ – D – E – F♯ – G – A
      {NOTE_CS3, NOTE_D3, NOTE_E3, NOTE_FS3, NOTE_G3, NOTE_A3, NOTE_B3},
      {NOTE_B4, NOTE_A4, NOTE_G4, NOTE_FS4, NOTE_E4, NOTE_D4, NOTE_CS4},
      {NOTE_CS5, NOTE_D5, NOTE_E5, NOTE_FS5, NOTE_G5, NOTE_A5, NOTE_B5}
    },
    {
      // C Minor Scale: C – D – E♭ – F – G – A♭ – B♭
      {NOTE_C3, NOTE_D3, NOTE_DS3, NOTE_F3, NOTE_G3, NOTE_GS3, NOTE_AS3},
      {NOTE_AS4, NOTE_GS4, NOTE_G4, NOTE_F4, NOTE_DS4, NOTE_D4, NOTE_C4},
      {NOTE_C5, NOTE_D5, NOTE_DS5, NOTE_F5, NOTE_G5, NOTE_GS5, NOTE_AS5}
    },
    {
      // D Minor Scale: D – E – F – G – A – B♭ – C 
      {NOTE_C3, NOTE_D3, NOTE_E3, NOTE_F3, NOTE_G3, NOTE_A3, NOTE_AS3},
      {NOTE_AS4, NOTE_A4, NOTE_G4, NOTE_F4, NOTE_E4, NOTE_D4, NOTE_C4},
      {NOTE_C5, NOTE_D5, NOTE_E5, NOTE_F5, NOTE_G5, NOTE_A5, NOTE_AS5}
    },
    {
      // E Minor Scale: E – F♯ – G – A – B – C – D 
      {NOTE_C3, NOTE_D3, NOTE_E3, NOTE_FS3, NOTE_G3, NOTE_A3, NOTE_B3},
      {NOTE_B4, NOTE_A4, NOTE_G4, NOTE_FS4, NOTE_E4, NOTE_D4, NOTE_C4},
      {NOTE_C5, NOTE_D5, NOTE_E5, NOTE_FS5, NOTE_G5, NOTE_A5, NOTE_B5}
    },
    {
      // F Minor Scale: F – G – A♭ – B♭ – C – D♭ – E♭
      {NOTE_C3, NOTE_CS3, NOTE_DS3, NOTE_F3, NOTE_G3, NOTE_GS3, NOTE_AS3},
      {NOTE_AS4, NOTE_GS4, NOTE_G4, NOTE_F4, NOTE_DS4, NOTE_CS4, NOTE_C4},
      {NOTE_C5, NOTE_CS5, NOTE_DS5, NOTE_F5, NOTE_G5, NOTE_GS5, NOTE_AS5}
    },
    {
      // G Minor Scale: G – A – B♭ – C – D – E♭ – F
      {NOTE_C3, NOTE_D3, NOTE_DS3, NOTE_F3, NOTE_G3, NOTE_A3, NOTE_AS3},
      {NOTE_AS4, NOTE_A4, NOTE_G4, NOTE_F4, NOTE_DS4, NOTE_D4, NOTE_C4},
      {NOTE_C5, NOTE_D5, NOTE_DS5, NOTE_F5, NOTE_G5, NOTE_A5, NOTE_AS5}
    }
  }
};