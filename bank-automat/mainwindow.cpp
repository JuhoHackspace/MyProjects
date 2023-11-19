#include "mainwindow.h"
#include "login.h"
#include "ui_mainwindow.h"
#include <iostream>

// Tämä setuppaa alkutilan
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    state = SELECT_CARD;

    login = new Login (this);
    showLogin();

    balance = new CheckBalance(this);
    transactions = new Transactions(this);
    withdraw = new Withdraw(this);

    manager = new QNetworkAccessManager(this);
    reply = nullptr;
    token = "";
    offset = 0;
    connectSlots();

    ui->RED->setDisabled(false);
    ui->YELLOW->setDisabled(false);
    ui->GREY->setDisabled(false);
    ui->GREEN->setDisabled(false);
}

MainWindow::~MainWindow()
{
    delete ui;
}

// ------------------------------------------------------------------------------------------
// Käsittelyt tässä osiossa, painikkeiden handleri, ruudun tyhjentäminen sekä connectit:
// ** clickedNumberHandler **
// ** clearScreen **
// ** connectSlots **
// ------------------------------------------------------------------------------------------

// Tämä käsittelee painikkeiden klikkaamisen
void MainWindow::clickedNumberHandler()
{
    if(state == SELECT_CARD || state == CARD_OK || state == CARD_FAIL || state == LOGIN_FAIL || state == USER_INSERT_AMOUNT) {
        QPushButton * btn = qobject_cast<QPushButton*>(sender());
        QString name = btn->objectName();
        qDebug()<< name << " -button clicked";

        QString content = ui->Content->text();

        if (content.length() < 4) {
            content.append(name.last(1));
            ui->Content->setText(content);
        }

        if (state == CARD_OK || state == LOGIN_FAIL) {
            ui->Content->setEchoMode(QLineEdit::Password);
        } else {
            ui->Content->setEchoMode(QLineEdit::Normal);
        }
    }
}

// Puhdistaa koko näytön, ja tämä ajetaan useimmissa tiloissa heti alussa state-julistuksen jälkeen
void MainWindow::clearScreen()
{
    ui->Content->clear();
    ui->Content2->clear();
    ui->Title->clear();
    ui->SecondTitle->clear();
    ui->PushText1->clear();
    ui->PushText2->clear();
    ui->PushText3->clear();
    ui->PushText4->clear();
    ui->PushText5->clear();
    ui->PushText6->clear();
    ui->PushText7->clear();
    ui->PushText8->clear();
    ui->pushButton1->setDisabled(true);
    ui->pushButton2->setDisabled(true);
    ui->pushButton3->setDisabled(true);
    ui->pushButton4->setDisabled(true);
    ui->pushButton5->setDisabled(true);
    ui->pushButton6->setDisabled(true);
    ui->pushButton7->setDisabled(true);
    ui->pushButton8->setDisabled(true);
}

// Connectit käsittelee saadun signaalin yhteyden tiettyyn slottiin, mikä tekee sen, että
// SIGNAALISTA siirrytään SLOTTIIN (showJokinTila, joita useita tuossa yläpuolella)
void MainWindow::connectSlots()
{
    for(int i = 0; i <= 9; i++) {
        QString btnName = "N" + QString::number(i);
        QPushButton * btn = this->findChild<QPushButton*>(btnName);
        if(btn) {
            connect(btn, SIGNAL(clicked()),this, SLOT(clickedNumberHandler()));
        }
    }
    connect(ui->RED, SIGNAL(clicked()),this, SLOT(clickedRED()));
    connect(ui->YELLOW, SIGNAL(clicked()),this, SLOT(clickedYELLOW()));
    connect(ui->GREY, SIGNAL(clicked()),this, SLOT(clickedGREY()));
    connect(ui->GREEN, SIGNAL(clicked()),this, SLOT(clickedGREEN()));
    connect(ui->pushButton1, SIGNAL(clicked()), this, SLOT(button1Clicked()));
    connect(ui->pushButton2, SIGNAL(clicked()), this, SLOT(button2Clicked()));
    connect(ui->pushButton3, SIGNAL(clicked()), this, SLOT(button3Clicked()));
    connect(ui->pushButton4, SIGNAL(clicked()), this, SLOT(button4Clicked()));
    connect(ui->pushButton5, SIGNAL(clicked()), this, SLOT(button5Clicked()));
    connect(ui->pushButton6, SIGNAL(clicked()), this, SLOT(button6Clicked()));
    connect(ui->pushButton7, SIGNAL(clicked()), this, SLOT(button7Clicked()));
    connect(ui->pushButton8, SIGNAL(clicked()), this, SLOT(button8Clicked()));
    connect(login, SIGNAL(cardFail()), this, SLOT(showCardFailure()));
    connect(login, SIGNAL(cardOk(QString)), this, SLOT(showInputPin(QString)));
    connect(login, SIGNAL(cardOkSelectType()),this, SLOT(selectDebitCredit()));
    connect(login, SIGNAL(loginOkAdmin(QString)),this, SLOT(showAdminMenu(QString)));
    connect(login, SIGNAL(loginFail()),this, SLOT(showLoginFailure()));
    connect(login, SIGNAL(loginOkUser(QString,QString)),this, SLOT(showMenu(QString,QString)));
    connect(login, SIGNAL(cardLocked()),this, SLOT(showCardLocked()));
    connect(transactions, SIGNAL(transactionsReady(QString)), this, SLOT(handleTransactionsReady(QString)));
    connect(balance, SIGNAL(transactionsReady(QString)), this, SLOT(handleTransactionsReady(QString)));
    connect(balance,SIGNAL(balanceReady(QString)), this, SLOT (handleBalanceReady(QString)));
    connect(balance, &CheckBalance::balanceReady, this, &MainWindow::showUserBalance);
}

// -------------------------------------------------------------------------------------
// ** Painikkeet ** ja napit alkavat tästä sekä niistä etenemiset switch casella
// case NIMI:   kertoo "nykyisen" vaiheen (state) ja se ilmaistaan tiloissa alempana
// -------------------------------------------------------------------------------------


// Tähän tulee kaikki toiminnot, mitä vihreästä OK-napista tapahtuu Caseina
void MainWindow::clickedGREEN()
{
    qDebug()<<"Green button clicked";

    switch (state) {
    case SELECT_CARD:
        if(ui->Content->text() != "") { //Mietitään, voidaan kopioida kaikkiin (setCardID())
            login->setCardID(ui->Content->text());
        }
        else {
            login->setCardID("0");
        }
        break;
    case CARD_FAIL:
        login->setCardID(ui->Content->text());
        break;
    case CARD_OK:
        login->setPIN(ui->Content->text(),cardType);
        break;
    case CARD_COMBINATION:
        break;
    case LOGIN_FAIL:
        login->setPIN(ui->Content->text(),cardType);
        break;
    case USER_MENU:
        break;
    case ADMIN_MENU:
        break;
    case USER_INSERT_AMOUNT:
        qDebug() << "Amount inserted, green clicked";
        withdraw->setAmount(ui->Content->text());
        break;
    }
}

// Keltaisen painikkeen "kumita kaikki merkit" toiminto
void MainWindow::clickedYELLOW()
{
    qDebug()<<"Yellow button clicked";
    ui->Content->clear();
}

// Harmaan painikkeen "kumita yksi merkki" toiminto
void MainWindow::clickedGREY()
{
    qDebug()<<"Grey button clicked";

    QString content = ui->Content->text();
    if (content.size() > 0) {
        ui->Content->setText(content.left(content.size() -1));
    }
}

// Punaisen painikkeen "keskeytä" STOP -toiminto, joka palaa alkutilaan
void MainWindow::clickedRED()
{
    qDebug()<<"Red button clicked";
    state = SELECT_CARD;
    showLogin();
}


// Sivu painike numero 1 , vasemmalla
void MainWindow::button1Clicked()
{
    switch(state) {
    case USER_TRANSACTIONS:
        qDebug() << "Uudemmat clicked";
        if (offset>0){
            offset=offset-5;
        }else
        {
            offset=0;
        }
        qDebug() << "offset: "<< offset;
        showTransactions();
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 10 clicked";
        withdraw->setAmount(QString("10"));
        break;
    }
}

// Sivu painike numero 2 , vasemmalla
void MainWindow::button2Clicked()
{
    switch(state) {
    case ADMIN_MENU:
        qDebug() << "ATM Events -clicked";
        //showATMEvents();  // tai vastaavan niminen slotti
        break;
    case USER_MENU:
        qDebug() << "User Balance -clicked";
        showUserBalance(saldo);
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 20 clicked";
        withdraw->setAmount(QString("20"));
        break;
    }
}


// Sivu painike numero 3 , vasemmalla
void MainWindow::button3Clicked()
{
    switch(state) {

    case ADMIN_MENU:
        qDebug() << "ATM balance -clicked";
        //showATMBalance();  // tai vastaavan niminen slotti
        break;
    case USER_MENU:
        qDebug() << "transactions clicked";
        showTransactions();
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 40 clicked";
        withdraw->setAmount(QString("40"));
        break;
    }
}

// Sivu painike numero 4 , vasemmalla (useimmin meillä "palaa takaisin")
void MainWindow::button4Clicked()
{
    switch(state) {
    case CARD_COMBINATION: showInputPin("debit");
        qDebug() << "debit clicked";
        break;
    case ADMIN_MENU:
        qDebug() << "ATM Add money -clicked";
        //showAddMoney();  // tai vastaavan niminen slotti
        break;
    case USER_MENU:
        qDebug() << "User Withdrawal -clicked";
        showWithdrawal();  // tai vastaavan niminen slotti
        break;
    case USER_BALANCE:
        qDebug() << "Paluu clicked";
        offset=0;
        ui->Content2->setAlignment(Qt::AlignCenter);
        ui->SecondTitle->setAlignment(Qt::AlignCenter);
        showMenu(token, accountID);
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Return -clicked";
        showMenu(token, accountID);
        break;
    case USER_INSERT_AMOUNT:
        qDebug() << "Return -clicked";
        qDebug() << "user token: " << token << " user accountID: " << accountID;
        showWithdrawal();
        break;
    case USER_TRANSACTIONS:
        qDebug() << "Paluu clicked";
        offset=0;
        ui->Content2->setAlignment(Qt::AlignCenter);
        ui->SecondTitle->setAlignment(Qt::AlignCenter);
        ui->PushText1->setStyleSheet("color: rgb(255, 255, 255);");
        ui->PushText5->setStyleSheet("color: rgb(255, 255, 255);");
        showMenu(token, accountID);
        break;
    }
}

// Sivu painike numero 5 , oikealla
void MainWindow::button5Clicked()
{
    switch(state) {
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 60 -clicked";
        withdraw->setAmount(QString("20"));
        break;
    case USER_TRANSACTIONS:
        QString labelText = ui->Content2->text();
        int characterCount = labelText.length();
        qDebug() << "Vanhemmat clicked";
        qDebug() << "näytöllä merkkejä: " << characterCount;
        if(characterCount>149){
            offset=offset+5;
        }else{
            offset=offset;
        }
        qDebug() << "offset: "<< offset;
        showTransactions();
        break;
    }

}

// Sivu painike numero 6 , oikealla
void MainWindow::button6Clicked()
{
    switch(state) {
    case ADMIN_MENU:
        qDebug() << "ATM current limit -clicked";
        //showTransactions();  // tai vastaavan niminen slotti
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 60 clicked";
        withdraw->setAmount(QString("60"));
        break;
    }
}

// Sivu painike numero 7 , oikealla
void MainWindow::button7Clicked()
{
    switch(state) {
    case ADMIN_MENU:
        qDebug() << "ATM set limit -clicked";
        //showATNSetLimit();  // tai vastaavan niminen slotti
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Insert amount clicked";
        showInsertAmount();
        break;
    }
}

// Sivu painike numero 8 , oikealla (useimmin meillä "keskeytä")
void MainWindow::button8Clicked()
{
    switch(state) {
    case CARD_COMBINATION: showInputPin("credit");
        qDebug() << "credit clicked";
        break;
    case ADMIN_MENU:
        qDebug() << "Stop session -clicked";
        showLogin();
        break;
    case USER_MENU:
        qDebug() << "Stop session -clicked";
        showLogin();
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Stop session -clicked";
        showLogin();
        break;
    case USER_TRANSACTIONS:
        qDebug() << "Stop session -clicked";
        ui->Content2->setAlignment(Qt::AlignCenter);
        ui->SecondTitle->setAlignment(Qt::AlignCenter);
        ui->PushText1->setStyleSheet("color: rgb(255, 255, 255);");
        ui->PushText5->setStyleSheet("color: rgb(255, 255, 255);");
        showLogin();
        break;
    case USER_BALANCE:
        qDebug() << "Stop session -clicked";
        ui->Content2->setAlignment(Qt::AlignCenter);
        ui->SecondTitle->setAlignment(Qt::AlignCenter);
        showLogin();
        break;
    }
}

// -------------------------------------------------------------------------------------------------------
// Valikoista ja painikkeista avautuvat ** Tilat ** alkavat tästä, ja kaikissa show -tunniste nimen alussa
// state = NIMI;    kussakin tilassa ilmaisee kyseisessä tilassa olevan vaiheen (state)
// clearScreen();   hyvä muistaa useimmissa sijoittaa alkuun
// -------------------------------------------------------------------------------------------------------

// Alkutila, jossa on kirjautumiskehoite
void MainWindow::showLogin()
{
    state = SELECT_CARD;
    clearScreen();
    ui->Title->setText("Kirjaudu sisään");
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
}

// Pin kortin syöttö tila, kun kortti on tunnistettu
void MainWindow::showInputPin(QString cardType)
{
    qDebug() << cardType << " selected";
    state = CARD_OK;
    this->cardType = cardType;
    clearScreen();
    ui->Title->setText(QString("Kortti tunnistettu"));
    ui->SecondTitle->setText(QString("Syötä pin"));
}

// Valitse Debit tai Credit (ennen pinin kyselyä, jos yhdistelmäkortti)
void MainWindow::selectDebitCredit()
{
    this->cardType = "credit/debit";
    state = CARD_COMBINATION;
    clearScreen();
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse tili"));
    ui->PushText4->setText(QString("Debit"));
    ui->PushText8->setText(QString("Credit"));
}

// Käyttäjän menu (adminin menu tulee erikseen)
void MainWindow::showMenu(QString token, QString accountID)
{
    this->token = token;
    this->accountID = accountID;
    qDebug() << "user token: " << token << " user accountID: " << accountID;
    state = USER_MENU;
    clearScreen();
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse toiminto"));
    ui->PushText2->setText(QString("Saldo"));
    ui->PushText3->setText(QString("Tapahtumat"));
    ui->PushText4->setText(QString("Nosto"));
    ui->PushText8->setText(QString("Keskeytä"));
}

// Adminin menu
void MainWindow::showAdminMenu(QString token)
{
    this->token = token;
    qDebug() << token << " admin";
    state = ADMIN_MENU;
    clearScreen();
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse toiminto"));
    ui->PushText2->setText(QString("Lokitiedot"));
    ui->PushText3->setText(QString("Automaatin varat"));
    ui->PushText4->setText(QString("Lisää varoja"));
    ui->PushText6->setText(QString("Nostoraja"));
    ui->PushText7->setText(QString("Muuta nostorajaa"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showCardLocked()
{
    clearScreen();
    state = CARD_LOCKED;
    ui->Title->setText(QString("Kortti lukittu"));
    ui->SecondTitle->setText(QString("Ota yhteys pankkiin"));
}

void MainWindow::showUserBalance(const QString& saldo)
{
    this->saldo = saldo;  // Aseta saldo-muuttujan arvo
    clearScreen();
    state = USER_BALANCE;
    ui->PushText4->setText(QString("Paluu"));
    ui->PushText8->setText(QString("Lopeta"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton5->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    balance->showBalance(token, accountID, offset);
    ui->Title->setText("Saldo: " + this->saldo);
    transactions->showTransactions(token, accountID, offset);



    //balance->showBalance();

}

void MainWindow::handleBalanceReady(const QString &data)
{
    // Tarkistetaan, onko vastaus tyhjä
    if (data.isEmpty()) {
        qDebug() << "Tyhjä vastaus saldosta.";
            return;
    }

    // Käsitellään JSON-vastaus
    QJsonDocument jsonResponse = QJsonDocument::fromJson(data.toUtf8());

    // Tarkistetaan, onko JSON-data muotoa, jota odotamme
    if (!jsonResponse.isArray()) {
        qDebug() << "Virheellinen JSON-dataformaatti saldossa.";
        qDebug() << "Saatu data: " << data;
        return;
    }

    QJsonArray jsonArray = jsonResponse.array();

    // Luodaan muuttuja saldo
    QString saldo = "N/A";  // Oletusarvo, jos saldoa ei saatu

    // Käydään läpi JSON-taulukko
    for (const auto& jsonValue : jsonArray) {
        if (jsonValue.isObject()) {
            QJsonObject jsonObject = jsonValue.toObject();

            // Olettaen, että saldo on suoraan "amount"-avaimen alla
            QString amount = jsonObject["amount"].toString();
            saldo = amount;
        }
    }

    // Päivitetään käyttöliittymä
    ui->Title->setText("Saldo: " + saldo);
}

void MainWindow::showWithdrawal()
{
    clearScreen();
    state = USER_WITHDRAWAL;
    withdraw->setInfo(token,accountID,ID,cardType);
    ui->pushButton1->setDisabled(false);
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton5->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse nostettava summa"));
    ui->PushText1->setText(QString("10"));
    ui->PushText2->setText(QString("20"));
    ui->PushText3->setText(QString("40"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText5->setText(QString("60"));
    ui->PushText6->setText(QString("80"));
    ui->PushText7->setText(QString("Muu summa"));
    ui->PushText8->setText(QString("Keskeytä"));

}

void MainWindow::showInsertAmount()
{
    clearScreen();
    state = USER_INSERT_AMOUNT;
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Syötä nostettava summa"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

// Kortin kanssa epäonnistuminen, mikä palaa tällä hetkellä showLoginiin eli alkutilaan
void MainWindow::showCardFailure()
{
    state = CARD_FAIL;
    ui->Title->setText(QString("Korttia ei löydy"));
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
}

// Kirjautumisen epäonnistuminen, esim. väärä pin ja yritä uudelleen
void MainWindow::showLoginFailure()
{
    state = LOGIN_FAIL;
    clearScreen();
    ui->Title->setText(QString("Kirjautuminen epäonnistui"));
    ui->SecondTitle->setText(QString("Syötä pin ja yritä uudelleen"));
}

void MainWindow::showTransactions()
{
    clearScreen();
    state = USER_TRANSACTIONS;
    //tähän voi miettiä myös hailakampaa näkymää, jos uudempia tapahtumia ei ole..
    if (offset==0){
        ui->PushText1->setStyleSheet("color: rgb(160, 160, 160);");
        ui->pushButton1->setDisabled(true);
    }else{
        ui->PushText1->setStyleSheet("color: rgb(255, 255, 255);");
        ui->pushButton1->setDisabled(false);
    }
    ui->PushText1->setText(QString("Uudemmat"));
    ui->PushText5->setText(QString("Vanhemmat"));
    ui->PushText4->setText(QString("Paluu"));
    ui->PushText8->setText(QString("Lopeta"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton5->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    transactions->showTransactions(token, accountID, offset);
}

void MainWindow::handleTransactionsReady(const QString &data)
{
    ui->Content2->setAlignment(Qt::AlignLeft);
    ui->SecondTitle->setAlignment(Qt::AlignLeft);
    QString tapahtumat="";

    QJsonDocument jsonResponse = QJsonDocument::fromJson(data.toUtf8());

    if (!jsonResponse.isArray()) {
        qDebug() << "Invalid JSON data format.";
        return;
    }

    QJsonArray jsonArray = jsonResponse.array();

    //Tulosta otsikot
    //tapahtumat="Aika\tCard_ID\tTapahtuma\tSumma(€)";//kommentoituna, jos id_card tiedolle ei ole tarvetta.
    tapahtumat="\tAika\t\tTapahtuma\tSumma(€)\n";//kommentoituna, jos id_card halutaan käyttöön.

    for (const auto& jsonValue : jsonArray) {
        QString event_type;
        if (jsonValue.isObject()) {
            QJsonObject jsonObject = jsonValue.toObject();

            //int id_card = jsonObject["id_card"].toInt(); //kommentoituna, jos id_card tiedolle ei ole tarvetta.
            if (jsonObject["event_type"].toString()=="withdrawal"){//withdrawal käännettynä suomeksi, muuta mahdolliset tapahtumat saa mennä ominaan.
                event_type = "Nosto";
            }
            else {
                event_type = jsonObject["event_type"].toString();
            }
            QDateTime time = QDateTime::fromString(jsonObject["time"].toString(), Qt::ISODate);
            QString amount = jsonObject["amount"].toString();
            //tapahtumat += QString("%1\t%2\t%3\t%4\n").arg(time.toString("dd.MM.-yy hh:mm")).arg(id_card).arg(event_type).arg(amount);//kommentoituna, jos id_card tiedolle ei ole tarvetta.
            tapahtumat += QString("\t%1\t%2\t\t%3\n").arg(time.toString("dd.MM.-yy hh:mm")).arg(event_type).arg(amount);//kommentoituna, jos id_card halutaan käyttöön
        }
    }
            int characterCount = tapahtumat.length();
            qDebug() << "tapahtumien pituus merkkeinä: " << characterCount;
                if(characterCount>170){
                ui->Content2->setText(tapahtumat);
                ui->PushText5->setStyleSheet("color: rgb(255, 255, 255);");
                ui->pushButton5->setDisabled(false);
                }else if(characterCount<35){
                ui->Content2->setText("\n\n\t\tEi vanhempia tapahtumia!");
                ui->PushText5->setStyleSheet("color: rgb(160, 160, 160);");
                ui->pushButton5->setDisabled(true);
                }else{
                ui->PushText5->setStyleSheet("color: rgb(160, 160, 160);");
                ui->pushButton5->setDisabled(true);
                ui->Content2->setText(tapahtumat);
                }

    //qDebug() << otsikot;
    //qDebug() << tapahtumat;

}


