#include "mainwindow.h"
#include "ui_mainwindow.h"

// **************************************************
// *** Adminin slotit
// ****** Sisältää:
// ********** showAdminMenu(QString token)
// ********** showAddMoney()
// ********** showAddMoney10()
// ********** showAddMoney20()
// ********** showAddMoney50()
// ********** showAddMoney100()
// ********** showAtmBalances()
// ********** showAddedMoney(QString amount)
// ********** showATMCurrentLimits()
// ********** showATMSetLimit()
// ********** showATMEvents()
// ********** showATMLimitSetted()
// ********** checkAtmLimit()
// ********** handleAtmLimit(QString limit)
// **************************************************

// Adminin menu
void MainWindow::showAdminMenu(QString token)
{
    this->token = token;
    qDebug() << token << " admin";
    state = ADMIN_MENU;
    clearScreen();
    disableEnableButtons({ui->pushButton2,ui->pushButton3,ui->pushButton4,ui->pushButton6,ui->pushButton8}, false);

    /****************************************************************
     ***** Jos halutaan tää näyttää, niin pitää korjata logiikka
     ***** HOX : atmBalancet ulos oikeille paikoilleen
                    atmBalances->getAtmBalances().at(0)
                    atmBalances->getAtmBalances().at(1)
                    atmBalances->getAtmBalances().at(2)
                    atmBalances->getAtmBalances().at(3)
     ***** Sekä Nostorajan näkymä oikeana, kuten tietokannassa
    ****************************************************************/

    QString contentText =
        "\t Nostoraja : " + adminMenu->getMaxWithdrawal() + " Euroa \n" +
        "\t Setelit ja määrät : \n"
        "\t 10 €  \t" + atmBalances->getAtmBalances().at(0) + " \n"
        "\t 20 €  \t" + atmBalances->getAtmBalances().at(1) + " \n"
        "\t 50 €  \t" + atmBalances->getAtmBalances().at(2) + " \n"
        "\t 100 €  \t" +atmBalances->getAtmBalances().at(3) + " \n";

    ui->Title->setText(QString("Valitse toiminto"));
    ui->SecondTitle->setText("Automaatin ID: " + automatID);
    ui->Content2->setText(contentText);
    ui->PushText2->setText(QString("Lokitiedot"));
    ui->PushText3->setText(QString("Automaatin varat"));
    ui->PushText4->setText(QString("Lisää varoja"));
    ui->PushText6->setText(QString("Muuta nostorajaa"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showAddMoney()
{
    clearScreen();
    state = ATM_ADDMONEY;
    atmBalances->setDenomination("0");
    disableEnableButtons({ui->pushButton2,ui->pushButton3,ui->pushButton4,ui->pushButton6,ui->pushButton7,ui->pushButton8}, false);
    ui->Title->setText(QString("Lisää käyttövaroja automaattiin"));
    ui->SecondTitle->setText(QString("Valitse lisättävät setelit"));
    ui->PushText2->setText(QString("10 €"));
    ui->PushText3->setText(QString("20 €"));
    ui->PushText6->setText(QString("50 €"));
    ui->PushText7->setText(QString("100 €"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showAddMoneyAmount(QString denomination, int text_color_shift)
{
    clearScreen();
    state = ATM_ADDMONEY_AMOUNT;
    disableEnableButtons({ui->pushButton2,ui->pushButton3,ui->pushButton4,ui->pushButton6,ui->pushButton7,ui->pushButton8}, false);
    QLabel * clr_shift = this->findChild<QLabel*>(QString("PushText"+QString::number(text_color_shift)));
    clr_shift->setStyleSheet("color: #7777c7;");
    ui->Title->setText(QString("Lisää käyttövaroja automaattiin"));
    ui->SecondTitle->setText(QString("Syötä lisättävä määrä "+denomination+" € seteleinä"));
    ui->PushText2->setText(QString("10 €"));
    ui->PushText3->setText(QString("20 €"));
    ui->PushText6->setText(QString("50 €"));
    ui->PushText7->setText(QString("100 €"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showAtmBalances()
{
    clearScreen();
    state = ATM_CHECKBALANCES;

    ui->Title->setText("Automaatin varat ");
    ui->SecondTitle->setText("Setelit ja määrät");

    QString contentText = "\t\t10 € \t=\t" + atmBalances->getAtmBalances().at(0) + "\n" +
    "\t\t20 € \t=\t" + atmBalances->getAtmBalances().at(1) + "\n" +
    "\t\t50 € \t=\t" + atmBalances->getAtmBalances().at(2) + "\n" +
    "\t\t100 € \t=\t" + atmBalances->getAtmBalances().at(3);

    ui->Content2->setText(contentText);
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
}

void MainWindow::showAddedMoney(QString amount)
{
    QString banknote = atmBalances->getDenomination();

    clearScreen();
    state = ATM_MONEYSENT;

    ui->Title->setText("Varoja lisätty");

        QString contentText = "Käyttövaroja " + banknote + " € lisätty " + amount + " (kpl) setelin verran";

    ui->Content2->setText(contentText);
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
}

void MainWindow::showATMCurrentLimits()
{

}

void MainWindow::showATMSetLimit()
{
    clearScreen();
    state = AUTOMAT_SET_MAX_WITHDRAWAL;
    ui->Title->setText("Nykyinen nostoraja: "+setlimits->getATMLimit()+" euroa.");
    ui->SecondTitle->setText("Syötä uusi nostoraja");
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);

}

void MainWindow::showATMEvents()
{
    clearScreen();
    state = AUTOMAT_VIEW_LOG;

    if (offset == 0) {
        ui->pushButton1->setDisabled(true);
        ui->PushText1->setStyleSheet("color: #7777c7;");
        ui->pushButton5->setDisabled(false);
        ui->PushText5->setStyleSheet("");
    } else if (offset != 0 && viewlog->maxEvents() < offset+5) {
        ui->pushButton1->setDisabled(false);
        ui->PushText1->setStyleSheet("");
        ui->pushButton5->setDisabled(true);
        ui->PushText5->setStyleSheet("color: #7777c7;");
    } else {
        ui->pushButton1->setDisabled(false);
        ui->PushText1->setStyleSheet("");
        ui->pushButton5->setDisabled(false);
        ui->PushText5->setStyleSheet("");
    }

    ui->Title->setText("Automaatin tapahtumat");
    ui->SecondTitle->setText("Ajankohta | Tapahtuma | Summa (€)");
        for (int i = 0; i < viewlog->getEvents().size(); i++)
        {
            ui->Content2->setText(ui->Content2->text()+viewlog->getEvents().at(i));
        }

        if (offset != 0 && viewlog->maxEvents() < offset + 5) {
            ui->Content2->setText(ui->Content2->text() + "\tEi vanhempia tapahtumia!\n");
        }

        ui->PushText1->setText(QString("Uudemmat"));
        ui->PushText5->setText(QString("Vanhemmat"));
        ui->PushText4->setText(QString("Palaa takaisin"));
        ui->PushText8->setText(QString("Keskeytä"));
        ui->pushButton4->setDisabled(false);
        ui->pushButton8->setDisabled(false);
}

void MainWindow::showATMLimitSetted()
{
        clearScreen();
        state = AUTOMAT_SET_MAX_WITHDRAWAL;
        ui->Title->setText("Uudeksi nostorajaksi asetettu "+setlimits->getATMLimit()+" euroa.");
        ui->PushText4->setText(QString("Palaa takaisin"));
        ui->PushText8->setText(QString("Keskeytä"));
        ui->pushButton4->setDisabled(false);
        ui->pushButton8->setDisabled(false);
}

void MainWindow::checkAtmLimit()
{
        if(ui->Content->text().toInt() > atmMaxWithdrawal) {
            ui->Content->setStyleSheet("color: #FF0000");
            ui->GREEN->setDisabled(true);
            ui->SecondTitle->setText(QString("Summa ylittää automaatin nostorajan ("+QString::number(atmMaxWithdrawal)+"€)"));
        }
        else {
            ui->Content->setStyleSheet("color: #FFFFFF");
            ui->GREEN->setDisabled(false);
            ui->SecondTitle->clear();
        }
}

void MainWindow::handleAtmLimit(QString limit)
{
        this->atmMaxWithdrawal = limit.toInt();
        qDebug() << "Atm " << this->automatID << " maxwithdrawal is " << this->atmMaxWithdrawal;
}
