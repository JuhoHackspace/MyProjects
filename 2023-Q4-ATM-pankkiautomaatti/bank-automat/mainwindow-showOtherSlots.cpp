#include "mainwindow.h"
#include "ui_mainwindow.h"

// *************************************************************************************
// *** Muut slotit
// ****** Sisältää:
// ********** showMapView()
// **********
// **********
// **********
// **********
// **********
// **********
// *************************************************************************************

// Automaatin valinta kartalta
void MainWindow::showMapView()
{
    state = MAP_VIEW;

    ui->Title2->setText("Valitse Bankki-automaatti kartalta");
    disableEnableButtons({ui->atm1,ui->atm2,ui->atm3,ui->atm4}, false);
}
