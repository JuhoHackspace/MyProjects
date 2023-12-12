#include "mainwindow.h"
#include "ui_mainwindow.h"

// **************************************************
// *** Adminin slotit
// ****** Sisältää:
// ********** showAdminMenu(QByteArray token)
// ********** showAddMoney()
// ********** showAddMoneyAmount(QString denomination, int text_color_shift)
// ********** showAddedMoney(QString amount)
// ********** showATMSetLimit()
// ********** showATMEvents()
// ********** checkAtmLimit()
// ********** handleAtmLimit(QString limit)
// **************************************************

// Näyttää Adminin päävalikon
void MainWindow::showAdminMenu(QByteArray token)
{
    this->token = token;
    qDebug() << token << " admin";
    state = ADMIN_MENU;
    showAnimatedGifAfterLogin();
    clearScreen();
    disableEnableButtons({ui->pushButton2,ui->pushButton4,ui->pushButton6,ui->pushButton8}, false);

    QString content3Text =
        "Automaatin ID : \n"
        "Nostoraja : \n"
        "Käyttövarat : \n "
        "\t    10 €  \n "
        "\t    20 €  \n "
        "\t    50 €  \n "
        "\t    100 € \n ";

    QString content4Text =
        "" + automatID + "\n"
        + adminMenu->getMaxWithdrawal() + "  euroa \n\n"
        + atmBalances->getAtmBalances().at(0) + "  seteliä \n"
        + atmBalances->getAtmBalances().at(1) + "  seteliä \n"
        + atmBalances->getAtmBalances().at(2) + "  seteliä \n"
        + atmBalances->getAtmBalances().at(3) + "  seteliä \n";

    ui->Title->setText(QString("Valitse toiminto"));
    ui->SecondTitle->setText("");
    ui->Content3->setText(content3Text);
    ui->Content4->setText(content4Text);
    ui->PushText2->setText(QString("Aseta nostoraja"));
    ui->PushText4->setText(QString("Lisää varoja"));
    ui->PushText6->setText(QString("Lokitiedot"));
    ui->PushText8->setText(QString("Keskeytä"));
    timer->start(60000);
}

//Näyttää lisää varoja tilan
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
    timer->start(30000);
}

//Pyytää syöttämään lisättävien setelien määrän
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
    timer->start(30000);
}

//Näyttää onnistuneen varojen lisäämisen (setelin sekä määrän)
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
    disableEnableButtons({ui->pushButton4,ui->pushButton8}, false);
    timer->start(7000);
}

//Näyttää nykyisen tai päivitetyn automaatin nostorajan näytöllä
void MainWindow::showATMSetLimit()
{
    clearScreen();
    state = AUTOMAT_SET_MAX_WITHDRAWAL;
    ui->Title->setText("Nykyinen nostoraja: "+setlimits->getATMLimit()+" euroa.");
    ui->SecondTitle->setText("Syötä uusi nostoraja");
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
    disableEnableButtons({ui->pushButton4,ui->pushButton8}, false);
    timer->start(30000);

}

//Näyttää automaatin tapahtumat näytöllä
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
        disableEnableButtons({ui->pushButton1,ui->pushButton5}, false);
        ui->PushText1->setStyleSheet("");
        ui->PushText5->setStyleSheet("");
    }

    ui->Title->setText("Automaatin tapahtumat");
    ui->FourthTitle->setText("Ajankohta\t Kortti\t Tapahtuma\t Määrä");
        for (int i = 0; i < viewlog->getEvents().size(); i++)
        {
            ui->Content6->setText(ui->Content6->text()+viewlog->getEvents().at(i));
        }

        if (offset != 0 && viewlog->maxEvents() < offset + 5) {
            ui->Content6->setText(ui->Content6->text() + "Ei vanhempia tapahtumia!\n");
        }

        ui->PushText1->setText(QString("Uudemmat"));
        ui->PushText5->setText(QString("Vanhemmat"));
        ui->PushText4->setText(QString("Palaa takaisin"));
        ui->PushText8->setText(QString("Keskeytä"));
        disableEnableButtons({ui->pushButton4,ui->pushButton8}, false);
        timer->start(30000);
}

//Tämä metodi tarkistaa ylittääkö ruudulle syötetty summa (nostotilassa) automaatin nostorajan
void MainWindow::checkAtmLimit()
{
        if(ui->Content->text().toInt() > atmMaxWithdrawal) {
            ui->Content->setStyleSheet("color: #FF0000");
            ui->GREEN->setDisabled(true);
            ui->SecondTitle->setText(QString("Summa ylittää automaatin nostorajan ("+QString::number(atmMaxWithdrawal)+"€)"));
        }
        else {
            ui->Content->setStyleSheet("color: #FFFFFF");
            if(ui->Content->text() != "") {
                ui->GREEN->setDisabled(false);
            }
            ui->SecondTitle->clear();
        }
}

void MainWindow::handleAtmLimit(QString limit)
{
        this->atmMaxWithdrawal = limit.toInt();
        qDebug() << "Atm " << this->automatID << " maxwithdrawal is " << this->atmMaxWithdrawal;
}
