#include "mainwindow.h"
#include "ui_mainwindow.h"

// *************************************************************************************
// ** Handlers ** Käsittelijät *********************************************************
// ***** Erilaisia käsittelijöitä on sijoitettu tänne **********************************
// *************************************************************************************

// Tämä käsittelee numeropainikkeiden klikkaamisen. Tilassa käynnistetään uudelleen myös tiettyjen tilojen timeout ajastimet
void MainWindow::clickedNumberHandler()
{
    if(state == SELECT_CARD || state == CARD_OK || state == CARD_FAIL || state == LOGIN_FAIL ||
        state == USER_INSERT_AMOUNT || state == ATM_ADDMONEY_AMOUNT || state == AUTOMAT_SET_MAX_WITHDRAWAL) {
        QPushButton * btn = qobject_cast<QPushButton*>(sender());
        QString name = btn->objectName();
        qDebug()<< name << " -button clicked";

        QString content = ui->Content->text();
        disableEnableButtons({ui->GREEN},false);
        if (content.length() < 4) { //Syötetään enintään neljä merkkiä
            content.append(name.last(1));
            ui->Content->setText(content);
        }
        if(state == USER_INSERT_AMOUNT) {
            checkAtmLimit(); //Tarkistetaan ylittääkö ruudulle syötetty summa automaatin nostorajan
            timer->start(10000);
        }
        if(state == ATM_ADDMONEY_AMOUNT || state == AUTOMAT_SET_MAX_WITHDRAWAL) {
            timer->start(30000);
        }
        if (state == CARD_OK || state == LOGIN_FAIL) {
            ui->Content->setEchoMode(QLineEdit::Password); //Näytetään sisältö salasanamoodissa
            timer->start(10000);
        } else {
            ui->Content->setEchoMode(QLineEdit::Normal);
        }
    }
}

//Ottaa vastaan QTimerin timeout signaalin ja tekee tilan mukaisen toimenpiteen
void MainWindow::handleTimeout()
{
    switch(state) {
    case CARD_OK:
    case LOGIN_FAIL:
    case CARD_LOCKED:
    case CARD_COMBINATION:
        showLogin(); //Palataan alkutilaan
        break;
    case WITHDRAWAL_OK:
    case USER_MENU:
    case ADMIN_MENU:
        login->requestLogout(); //Kirjaudutaan ulos ja palataan alkutilaan
        break;
    case USER_BALANCE:
    case USER_TRANSACTIONS:
    case USER_WITHDRAWAL:
        showMenu(token,accountID); //Palataan käyttäjän päävalikkoon
        break;
    case USER_INSERT_AMOUNT:
    case WITHDRAWAL_FAIL:
        showWithdrawal(); //Palataan nostotilaan
        break;
    case ATM_ADDMONEY:
    case ATM_ADDMONEY_AMOUNT:
    case AUTOMAT_SET_MAX_WITHDRAWAL:
    case AUTOMAT_VIEW_LOG:
        adminMenu->getAdminMenuInfo(token); //Noudetaan automaatin tiedot ja palataan adminin päävalikkoon
        break;
    case ATM_MONEYSENT:
        showAddMoney();
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}
