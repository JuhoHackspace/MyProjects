#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QMovie>

// *************************************************************************************
// *** Käyttäjän slotit
// ****** Sisältää:
// ********** showMenu(QString token, QString accountID)
// ********** showUserBalance(QString formattedBalance, QString formattedCreditLimit)
// ********** takesBalanceTransactions()
// ********** showInsertAmount()
// ********** showTransactions()
// ********** showWithdrawal()
// ********** showWithdrawFailure(QString reason)
// ********** showWithdrawOk(QString amount)
// *************************************************************************************


// Käyttäjän päävalikko
void MainWindow::showMenu(QByteArray token, QString accountID)
{
    this->token = token;
    this->accountID = accountID;
    qDebug() << "user token: " << token << " user accountID: " << accountID;
    state = USER_MENU;
    showAnimatedGifAfterLogin();
    clearScreen();
    disableEnableButtons({ui->pushButton2,ui->pushButton3,ui->pushButton4,ui->pushButton8}, false);
    ui->Title->setText(QString("Valitse toiminto"));
    ui->PushText2->setText(QString("Saldo"));
    ui->PushText3->setText(QString("Tapahtumat"));
    ui->PushText4->setText(QString("Nosto"));
    ui->PushText8->setText(QString("Keskeytä"));
    timer->start(30000);
}

//Näyttää tilin saldon sekä neljä viimeistä tilitapahtumaa näytöllä
void MainWindow::showUserBalance(QString formattedBalance, QString formattedCreditLimit)
{
    //this->saldo = balance;  // Aseta saldo-muuttujan arvo
    this->saldo = formattedBalance; // Aseta saldo-muuttujan arvo
    this->csaldo = formattedCreditLimit;

    clearScreen();
    state = USER_BALANCE;

    int maxTransactionsToShow = 4;
    QString creditLimitText = "";
    ui->Title->setText("Tilin saldo:");
    ui->SecondTitle->setText(this->saldo);

    if (cardType == "credit")
    {
        ui->Title->setText("Luottoa nostettavissa ");
        ui->SecondTitle->setText(this->saldo + "" + creditLimitText);
        // poistettu csaldo ja pelkkä saldo laitettu koska koko luotto tuli näkyviin ei ollenkaan nosto vähennyksiä
    }

    if (!transactions->getTransactions().isEmpty()) {
        int transactionsToDisplay = qMin(maxTransactionsToShow, transactions->getTransactions().size());
        ui->Content5->setText("Viimeaikaiset tilitapahtumat \n");
        for (int i = 0; i < transactionsToDisplay; i++) {
            ui->Content5->setText(ui->Content5->text() + transactions->getTransactions().at(i));
        }
    }

    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
    disableEnableButtons({ui->pushButton4,ui->pushButton8}, false);
    timer->start(10000);
}

//Ottaa vastaan signaalin transactions luokalta, kun tilitapahtumat on noudettu. Aktivoi saldon tarkistuksen
//Tapahtumaketju saldon tarkasteluun: aktivoidaan tapahtumien nouto -> kun valmis, pyydetään tilin saldo
//-> kun valmis, näytetään näytöllä tilin saldo + 4 viimeistä tapahtumaa
void MainWindow::takesBalanceTransactions()
{
    balance->displayBalance(token, accountID, cardType);
}

//Pyytää käyttäjää syöttämään nostettavan summan
void MainWindow::showInsertAmount()
{
    clearScreen();
    state = USER_INSERT_AMOUNT;
    disableEnableButtons({ui->pushButton4,ui->pushButton8}, false);
    ui->Title->setText(QString("Syötä nostettava summa"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
    timer->start(10000);
}

//Näyttää tilitapahtumat -tilassa näytöllä viisi valittua (uudemmat/vanhemmat) tilitapahtumaa
void MainWindow::showTransactions()
{
    clearScreen();
    state = USER_TRANSACTIONS;

    if (offset == 0) {
        ui->pushButton1->setDisabled(true);
        ui->PushText1->setStyleSheet("color: #7777c7;");
        ui->pushButton5->setDisabled(false);
        ui->PushText5->setStyleSheet("");
    } else if (offset != 0 && transactions->maxTransactions() < offset+5) {
        ui->pushButton1->setDisabled(false);
        ui->PushText1->setStyleSheet("");
        ui->pushButton5->setDisabled(true);
        ui->PushText5->setStyleSheet("color: #7777c7;");
    } else {
        disableEnableButtons({ui->pushButton1,ui->pushButton5}, false);
        ui->PushText1->setStyleSheet("");
        ui->PushText5->setStyleSheet("");
    }

    ui->Title->setText("Tilitapahtumat");
    ui->ThirdTitle->setText("Ajankohta       Tapahtuma   Summa (€)");

    for (int i = 0; i < transactions->getTransactions().size(); i++)
    {
        ui->Content5->setText(ui->Content5->text()+transactions->getTransactions().at(i));
    }

    if (offset != 0 && transactions->maxTransactions() < offset + 5) {
        ui->Content5->setText(ui->Content5->text() + "Ei vanhempia tapahtumia!\n");
    }

    ui->PushText1->setText(QString("Uudemmat"));
    ui->PushText5->setText(QString("Vanhemmat"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
    disableEnableButtons({ui->pushButton4,ui->pushButton8}, false);
    timer->start(15000);
}

//Näyttää nosta rahaa -tilassa nostovaihtoehdot näytöllä
void MainWindow::showWithdrawal()
{
    clearScreen();
    state = USER_WITHDRAWAL;
    withdraw->setInfo(token,accountID,ID,cardType,automatID);
    disableEnableButtons({ui->pushButton1,ui->pushButton2,ui->pushButton3,ui->pushButton4,ui->pushButton5,ui->pushButton6,ui->pushButton7,ui->pushButton8}, false);
    ui->Title->setText(QString("Valitse nostettava summa"));
    ui->PushText1->setText(QString("10"));
    ui->PushText2->setText(QString("20"));
    ui->PushText3->setText(QString("40"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText5->setText(QString("60"));
    ui->PushText6->setText(QString("80"));
    ui->PushText7->setText(QString("Muu summa"));
    ui->PushText8->setText(QString("Keskeytä"));
    timer->start(10000);
}

//Näyttää syyn epäonnistuneelle nostolle
void MainWindow::showWithdrawFailure(QString reason)
{
    state = WITHDRAWAL_FAIL;
    clearScreen();
    ui->Title->setText("Nosto epäonnistui");
        ui->SecondTitle->setText(reason);
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->pushButton4->setDisabled(false);
    timer->start(7000);
}

//Näyttää onnistuneen noston ja nostetun summan
void MainWindow::showWithdrawOk(QString amount)
{
    state = WITHDRAWAL_OK;
    clearScreen();
    ui->Title->setText("Nosto suoritettu");
    ui->SecondTitle->setText("Nostettu " + amount + " euroa");
    timer->start(4800);

    QMovie *movie = new QMovie(":/money-output-withdrawal.gif");
    ui->Withdrawal->setMovie(movie);
    ui->Withdrawal->show();

    connect(timer, &QTimer::timeout, [=]() {
        ui->Withdrawal->setMovie(nullptr);
        ui->Withdrawal->hide(); // Piilota widget
    });

    ui->Withdrawal->setMovie(movie);
    movie->start();
}
