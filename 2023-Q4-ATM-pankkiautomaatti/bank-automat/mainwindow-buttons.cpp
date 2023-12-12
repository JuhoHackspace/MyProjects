#include "mainwindow.h"
#include "ui_mainwindow.h"

// *************************************************************************************
// ** Painikkeet ** ja napit alkavat tästä sekä niistä siirtymiä (mm. switch case)
// ** case NIMI:   kertoo "nykyisen" vaiheen (state) ja se ilmaistaan tiloissa alempana
// *************************************************************************************
// ****** Sisältää:
// ********** atmClicked()
// ********** clickedGREEN()
// ********** clickedYELLOW()
// ********** clickedGREY()
// ********** clickedRED()
// ********** button1Clicked()
// ********** button2Clicked()
// ********** button3Clicked()
// ********** button4Clicked()
// ********** button5Clicked()
// ********** button6Clicked()
// ********** button7Clicked()
// ********** button8Clicked()
// *************************************************************************************

//Asetetaan kartalta valittu automaatin ID muuttujaan ja aktivoidaan kirjautumistila
void MainWindow::atmClicked()
{
    QPushButton * atm_btn = qobject_cast<QPushButton*>(sender());
    QString atm_id = atm_btn->objectName();
    qDebug()<<"ATM button clicked";
    this->automatID = atm_id.last(1);
    ui->Mapframe->hide();
    adminMenu->setAutomatID(automatID);
    showLogin();
}

//Vihreästä napista siirretään käyttäjän syötteet näytöltä tilan mukaisesti eri luokille
void MainWindow::clickedGREEN()
{
    qDebug()<<"Green button clicked";

    switch (state) {
    case SELECT_CARD:
        ID = ui->Content->text();
        atmBalances->setCardID(ID);
        login->setCardID(ui->Content->text(),automatID);                                  //Aktivoidaan login luokan korttiin liittyvät tarkistukset
        break;
    case CARD_FAIL:
        ID = ui->Content->text();
        atmBalances->setCardID(ID);
        login->setCardID(ui->Content->text(),automatID);
        break;
    case CARD_OK:
    case LOGIN_FAIL:
        login->setPIN(ui->Content->text(),cardType); //Aktivoidaan login luokassa sisäänkirjautuminen
        timer->stop();
        break;
    case CARD_COMBINATION:
        break;
    case USER_MENU:
        break;
    case ADMIN_MENU:
        break;
    case USER_INSERT_AMOUNT:
        qDebug() << "Amount inserted, green clicked";
        withdraw->setAmount(ui->Content->text()); //Siirrettään syötetty rahasumma nosto luokalle
        break;
    case ATM_ADDMONEY_AMOUNT:
        atmBalances->insertValueOf(ui->Content->text()); //Siirretään syötetty lisättävien setelien määrä addMoney luokalle (atmBalances pointteri)
        break;
    case AUTOMAT_SET_MAX_WITHDRAWAL:
        setlimits->setLimit(automatID, ui->Content->text()); //Siirrettään syötetty uusi nostoraja setLimits luokalle
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Keltaisen painikkeen "kumita kaikki merkit" toiminto. Käynnistää myös uudelleen tilojen timeout ajastukset
void MainWindow::clickedYELLOW()
{
    qDebug()<<"Yellow button clicked";
    ui->Content->clear();
    disableEnableButtons({ui->GREEN},true);
    switch(state) {
    case CARD_OK:
    case LOGIN_FAIL:
        timer->start(10000);
        break;
    case USER_INSERT_AMOUNT:
        checkAtmLimit(); //Tarkistetaan ylittääkö ruudulle syötetty summa automaatin nostorajan
        timer->start(10000);
        break;
    case AUTOMAT_SET_MAX_WITHDRAWAL:
    case ATM_ADDMONEY_AMOUNT:
        timer->start(30000);
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Harmaan painikkeen "kumita yksi merkki" toiminto. Käynnistää myös uudelleen tilojen timeout ajastukset
void MainWindow::clickedGREY()
{
    qDebug()<<"Grey button clicked";

    QString content = ui->Content->text();
    if (content.size() > 0) {
        ui->Content->setText(content.left(content.size() -1));
    }
    if (ui->Content->text() == "") {
        disableEnableButtons({ui->GREEN}, true);
    }
    switch(state) {
    case CARD_OK:
    case LOGIN_FAIL:
        timer->start(10000);
        break;
    case USER_INSERT_AMOUNT:
        checkAtmLimit(); //Tarkistetaan ylittääkö ruudulle syötetty summa automaatin nostorajan
        timer->start(10000);
        break;
    case AUTOMAT_SET_MAX_WITHDRAWAL:
    case ATM_ADDMONEY_AMOUNT:
        timer->start(30000);
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Punaisen painikkeen "keskeytä" STOP -toiminto, joka palaa alkutilaan
void MainWindow::clickedRED()
{
    qDebug()<<"Red button clicked";
    switch(state) {
    case CARD_OK:
    case CARD_FAIL:
    case CARD_COMBINATION:
    case LOGIN_FAIL:
        showLogin(); //Ennen kirjautumista palataan suoraan alkutilaan
        break;
    default:
        login->requestLogout(); //Kirjautumisen jälkeen palataan alkutilaan uloskirjautumisen kautta
        break;
    }

}

// Sivu painike numero 1 , vasemmalla
void MainWindow::button1Clicked()
{
    switch(state) {
    case USER_TRANSACTIONS:
        qDebug() << "Uudemmat clicked";
        if (offset>0){
            offset=offset-5; //Siirrytään uudempiin tapahtumiin -> offset -= 5
        }else
        {
            offset=0;
        }
        qDebug() << "offset: "<< offset;
        transactions->showTransactions(token, accountID, offset, QString("transactions")); //Pyydetään käyttäjän tapahtumat
        break;
    case AUTOMAT_VIEW_LOG:
        qDebug() << "Uudemmat clicked";
        if (offset>0){
            offset=offset-5; //Siirrytään uudempiin tapahtumiin -> offset -= 5
        }else
        {
            offset=0;
        }
        qDebug() << "offset: "<< offset;
        viewlog->requestEvents(token, automatID, offset); //Pyydetään automaatin tapahtumat
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 10 clicked";
        withdraw->setAmount(QString("10")); //Aktivoidaan 10€ nostoyritys
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 2 , vasemmalla
void MainWindow::button2Clicked()
{
    switch(state) {
    case ADMIN_MENU:
        qDebug() << "ATM set limit -clicked";
        setlimits->requestLimit(token,automatID); //Aktivoidaan muuta nostorajaa tila (pyydetään ja näytetään ensin nykyinen raja näytöllä)
        break;
    case USER_MENU:
        qDebug() << "User Balance -clicked";
        offset = 0;
        transactions->showTransactions(token, accountID, offset, QString("balance")); //Pyydetään 5 viimeaikaista tilitapahtumaa (näkyy samassa kuin saldo)
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 20 clicked";
        withdraw->setAmount(QString("20")); //Aktivoidaan 20€ nostoyritys
        break;
    case ATM_ADDMONEY:
    case ATM_ADDMONEY_AMOUNT:
        qDebug() << "Add Money 10 -clicked";
        atmBalances->setDenomination("10"); //Asetetaan lisättävän setelin suuruus addMoney luokkaan (atmBalances pointteri)
        showAddMoneyAmount("10",2); //Näytetään tila, jossa pyydetään syöttämään lisättävien setelien määrä
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 3 , vasemmalla
void MainWindow::button3Clicked()
{
    switch(state) {
    case USER_MENU:
        qDebug() << "Transactions -clicked";
        offset = 0;
        transactions->showTransactions(token, accountID, offset, QString("transactions")); //Aktivoidaan tilipahatumat tila. Pyydetään käyttäjän tapahtumat
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 40 -clicked";
        withdraw->setAmount(QString("40")); //Aktivoidaan 40€ nostoyritys
        break;
    case ATM_ADDMONEY:
    case ATM_ADDMONEY_AMOUNT:
        qDebug() << "Add Money 20 -clicked";
        atmBalances->setDenomination("20"); //Asetetaan lisättävän setelin suuruus addMoney luokkaan (atmBalances pointteri)
        showAddMoneyAmount("20",3); //Näytetään tila, jossa pyydetään syöttämään lisättävien setelien määrä
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 4 , vasemmalla (useimmin meillä "palaa takaisin")
void MainWindow::button4Clicked()
{
    switch(state) {
    case CARD_COMBINATION: showInputPin("debit"); //Valitaan debit tili
        qDebug() << "debit clicked";
        break;
    case ATM_MONEYSENT:
    case ADMIN_MENU:
        qDebug() << "ATM Add money -clicked";
        showAddMoney(); //Aktivoidaan ja näytetään lisää varoja tila
        break;
    case USER_MENU:
        qDebug() << "User Withdrawal -clicked";
        showWithdrawal();  //Aktivoidaan ja näytetään rahan nosto tila
        break;
    case USER_BALANCE:
    case USER_WITHDRAWAL:
    case WITHDRAWAL_FAIL:
        qDebug() << "Paluu clicked";
        showMenu(token, accountID); //Palataan käyttäjän päävalikkoon
        break;
    case USER_INSERT_AMOUNT:
        qDebug() << "Return -clicked";
        qDebug() << "user token: " << token << " user accountID: " << accountID;
        showWithdrawal(); //Palataan nosta rahaa tilaan
        break;
    case USER_TRANSACTIONS:
        qDebug() << "Paluu clicked";
        offset=0;
        ui->PushText1->setStyleSheet(""); //Asetetaan tekstin tyylit normaaliksi
        ui->PushText5->setStyleSheet("");
        showMenu(token, accountID); //Palataan käyttäjän päävalikkoon
        break;
    case AUTOMAT_VIEW_LOG:
    case ATM_ADDMONEY:
    case ATM_ADDMONEY_AMOUNT:
    case AUTOMAT_SET_MAX_WITHDRAWAL:
        qDebug() << "Paluu clicked";
        adminMenu->getAdminMenuInfo(token); //Noudetaan automaatin tiedot, ja palataan adminin päävalikkoon
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 5 , oikealla
void MainWindow::button5Clicked()
{
    switch(state) {
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 60 -clicked";
        withdraw->setAmount(QString("60")); //Aktivoidaan 60€ nostoyritys
        break;
    case USER_TRANSACTIONS:
        qDebug() << "Vanhemmat clicked";
        offset += 5;                       //Korotetaan offset muuttujaa -> viisi vanhempaa tapahtumaa
        qDebug() << "offset: "<< offset;
        transactions->showTransactions(token, accountID, offset, QString("transactions")); //Pyydetään tapahtumat
        break;
    case AUTOMAT_VIEW_LOG:
        qDebug() << "Vanhemmat clicked";
        offset += 5;                       //Korotetaan offset muuttujaa -> viisi vanhempaa tapahtumaa
        qDebug() << "offset: "<< offset;
        viewlog->requestEvents(token,automatID,offset); //Pyydetään automaatin tapahtumat
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 6 , oikealla
void MainWindow::button6Clicked()
{
    switch(state) {
    case ADMIN_MENU:
        qDebug() << "ATM Events -clicked";
        offset = 0;
        viewlog->requestEvents(token, automatID, offset); //Aktivoidaan ja näytetään automaatin tapahtumaloki
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 80 clicked";
        withdraw->setAmount(QString("80")); //Aktivoidaan 80€ nostoyritys
        break;
    case ATM_ADDMONEY:
    case ATM_ADDMONEY_AMOUNT:
        qDebug() << "Add Money 50 -clicked";
        atmBalances->setDenomination("50"); //Asetetaan lisättävän setelin suuruus addMoney luokkaan (atmBalances pointteri)
        showAddMoneyAmount("50", 6); //Näytetään tila, jossa pyydetään syöttämään lisättävien setelien määrä
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 7 , oikealla
void MainWindow::button7Clicked()
{
    switch(state) {
    case USER_WITHDRAWAL:
        qDebug() << "Insert amount clicked";
        showInsertAmount(); //Aktivoidaan ja näytetään syötä nostettava summa -tila
        break;
    case ATM_ADDMONEY:
    case ATM_ADDMONEY_AMOUNT:
        qDebug() << "Add Money 100 -clicked";
        atmBalances->setDenomination("100"); //Asetetaan lisättävän setelin suuruus addMoney luokkaan (atmBalances pointteri)
        showAddMoneyAmount("100", 7); //Näytetään tila, jossa pyydetään syöttämään lisättävien setelien määrä
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 8 , oikealla (useimmin meillä "keskeytä")
void MainWindow::button8Clicked()
{
    switch(state) {
    case CARD_COMBINATION: showInputPin("credit"); //Valitaan credit tili
        qDebug() << "credit clicked";
        break;
    case ADMIN_MENU:
    case USER_MENU:
    case USER_WITHDRAWAL:
    case USER_TRANSACTIONS:
    case USER_BALANCE:
    case USER_INSERT_AMOUNT:
    case AUTOMAT_VIEW_LOG:
    case ATM_ADDMONEY:
    case ATM_ADDMONEY_AMOUNT:
    case ATM_MONEYSENT:
    case AUTOMAT_SET_MAX_WITHDRAWAL:
        qDebug() << "Stop session -clicked";
        login->requestLogout(); //Siirrytään uloskirjautumisen kautta alkutilaan
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}
