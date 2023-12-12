#include "adminmenuinfo.h"

AdminMenuInfo::AdminMenuInfo(QObject *parent, Withdraw * withdraw, AddMoney * addmoney)
    : QObject{parent}
{
    //Asetetaan konstruktorin parametreinä tulleet luokkapointterit muuttujiin (aggregaatio)
    this->withdraw = withdraw;
    this->addmoney = addmoney;
}

//Asettaa automaatin ID:n
void AdminMenuInfo::setAutomatID(QString automatID)
{
    this->automatID = automatID;
}

//Palauttaa automaatin nostorajan
QString AdminMenuInfo::getMaxWithdrawal()
{
    return atmLimit;
}

//Ottaa vastaan Web tokenin signaalilta, ja pyytää withdraw luokan kautta automaatin nostorajaa
void AdminMenuInfo::getAdminMenuInfo(QByteArray token)
{
    this->token = token;
    withdraw->requestAtmLimit(this->token,automatID, "adminMenu"); //Asetetaan tässä kutsuvaksi luokaksi adminMenu
}

//Ottaa vastaan signaalin Withdraw luokalta, kun automaatin nostoraja on noudettu. Pyytää tiedot automaatin varoista addMoney luokalta
void AdminMenuInfo::handleAtmLimit(QString atmLimit)
{
    this->atmLimit = atmLimit;
    addmoney->checkAtmBalances(token,automatID); //Asetetaan tässäkin kutsuvaksi luokaksi adminMenu
}

//Ottaa vastaan signaalin addMoney luokalta, kun automaatin varat on noudettu. Lähettää signaalin mainwindow:lle
void AdminMenuInfo::handleAtmBalances()
{
    emit limitAndBalancesReady(token); //Signaalin mukana lähetetään Web token
}
