#include "mainwindow.h"
#include "ui_mainwindow.h"

// *************************************************************************************
// *** Kirjautumisen slotit
// ****** Sisältää:
// ********** showLogin()
// ********** selectDebitCredit()
// ********** showInputPin(QString cardType)
// ********** showCardLocked()
// ********** showCardFailure()
// ********** showLoginFailure()
// *************************************************************************************


// Alkutila, jossa on kirjautumiskehoite
void MainWindow::showLogin()
{
    state = SELECT_CARD;
    showAnimatedGifBeforeLogin();
    token = "";
    ID = "";
    accountID = "";
    cardType = "";
    clearScreen();
    ui->Title->setText("Kirjaudu sisään");
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
}

// Valitse Debit tai Credit (ennen pinin kyselyä, jos yhdistelmäkortti)
void MainWindow::selectDebitCredit()
{
    this->cardType = "credit/debit";
    state = CARD_COMBINATION;
    clearScreen();
    disableEnableButtons({ui->pushButton4,ui->pushButton8}, false);
    timer->start(10000);
    ui->Title->setText(QString("Valitse tili"));
    ui->PushText4->setText(QString("Debit"));
    ui->PushText8->setText(QString("Credit"));
}

// Pin kortin syöttö tila, kun kortti on tunnistettu
void MainWindow::showInputPin(QString cardType)
{
    qDebug() << cardType << " selected";
    state = CARD_OK;
    this->cardType = cardType;
    clearScreen();
    timer->start(10000);
    ui->Title->setText(QString("Kortti tunnistettu"));
    ui->SecondTitle->setText(QString("Syötä pin"));
}

//Näyttää kortti lukittu -tilan
void MainWindow::showCardLocked()
{
    clearScreen();
    state = CARD_LOCKED;
    ui->Title->setText(QString("Kortti lukittu"));
    ui->SecondTitle->setText(QString("Ota yhteys pankkiin"));
    timer->start(4000);
}

// Kortin kanssa epäonnistuminen, mikä palaa tällä hetkellä showLoginiin eli alkutilaan
void MainWindow::showCardFailure()
{
    state = CARD_FAIL;
    clearScreen();
    ui->Title->setText(QString("Korttia ei löydy"));
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
}

// Kirjautumisen epäonnistuminen, esim. väärä pin ja yritä uudelleen
void MainWindow::showLoginFailure()
{
    state = LOGIN_FAIL;
    clearScreen();
    timer->start(10000);
    ui->Title->setText(QString("Kirjautuminen epäonnistui"));
    ui->SecondTitle->setText(QString("Syötä pin ja yritä uudelleen"));
}
