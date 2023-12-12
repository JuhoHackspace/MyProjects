#include "mainwindow.h"
#include "ui_mainwindow.h"

// ***********************************************************************************
// ** Connectit ** Signaalit ** Slotit ***********************************************
// ** Connectit käsittelevät saadun signaalin yhteyden tiettyyn slottiin *************
// ******* l. Signaalista siirtymä Slottiin (esim. showJokinTila) ********************
// ***********************************************************************************

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
    connect(login, SIGNAL(loginOkAdmin(QByteArray)),adminMenu, SLOT(getAdminMenuInfo(QByteArray)));
    connect(login, SIGNAL(loginFail()),this, SLOT(showLoginFailure()));
    connect(login, SIGNAL(loginOkUser(QByteArray,QString)),this, SLOT(showMenu(QByteArray,QString)));
    connect(login, SIGNAL(cardLocked()),this, SLOT(showCardLocked()));
    connect(transactions, SIGNAL(transactionsReady()), this, SLOT(showTransactions()));
    connect(timer, SIGNAL(timeout()), this, SLOT(handleTimeout()));
    connect(balance, SIGNAL(balanceReady(QString, QString)),this, SLOT(showUserBalance(QString, QString)));
    connect(withdraw, SIGNAL(atmLimitReady(QString)),this, SLOT(handleAtmLimit(QString)));
    connect(withdraw, SIGNAL(withdrawFailure(QString)),this, SLOT(showWithdrawFailure(QString)));
    connect(withdraw, SIGNAL(withdrawalOk(QString)),this, SLOT(showWithdrawOk(QString)));
    connect(viewlog, SIGNAL(LogReady()), this, SLOT(showATMEvents()));
    connect(ui->atm1, SIGNAL(clicked()), this, SLOT(atmClicked()));
    connect(ui->atm2, SIGNAL(clicked()), this, SLOT(atmClicked()));
    connect(ui->atm3, SIGNAL(clicked()), this, SLOT(atmClicked()));
    connect(ui->atm4, SIGNAL(clicked()), this, SLOT(atmClicked()));
    connect(transactions, SIGNAL(balanceTransReady()), this, SLOT(takesBalanceTransactions()));
    connect(atmBalances, SIGNAL(atmInsertValuesOk(QString)),this, SLOT(showAddedMoney(QString)));
    connect(setlimits, SIGNAL(atmLimitReady()), this, SLOT(showATMSetLimit()));
    connect(setlimits, SIGNAL(atmInsertLimitOk(QByteArray,QString)), setlimits, SLOT(requestLimit(QByteArray,QString)));
    connect(adminMenu, SIGNAL(limitAndBalancesReady(QByteArray)), this, SLOT(showAdminMenu(QByteArray)));
    connect(atmBalances, SIGNAL(atmBalancesToAdminMenu()),adminMenu, SLOT(handleAtmBalances()));
    connect(withdraw, SIGNAL(atmLimitToAdminMenu(QString)),adminMenu, SLOT(handleAtmLimit(QString)));
    connect(login, SIGNAL(logoutOk()), this, SLOT(showLogin()));
}
