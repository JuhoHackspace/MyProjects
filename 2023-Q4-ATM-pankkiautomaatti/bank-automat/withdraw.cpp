#include "withdraw.h"

Withdraw::Withdraw(QObject *parent)
    : QObject{parent}
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

Withdraw::~Withdraw()
{
}

//Ottaa vastaan nostettavan summan ja kutsuu metodia, joka lähettää nostopyynnön
void Withdraw::setAmount(QString amount)
{
    this->amount = amount;
    qDebug() << "Amount received: " << this->amount;
    requestWithdrawal(); //Lähetetään nostopyyntö
}

//Ottaa vastaan luokassa tarvittavat tiedot, ja kutsuu metodia, joka tarkistaa automaatin nostorajan
void Withdraw::setInfo(QByteArray token, QString accountID, QString cardID, QString cardType, QString automatID)
{
    this->token = token;
    this->accountID = accountID;
    this->cardID = cardID;
    this->cardType = cardType;
    this->automatID = automatID;
    requestAtmLimit(this->token,this->automatID, "withdraw"); //Tätä metodia käyttää kaksi luokkaa, tässä kutsujaksi asetetaan withdraw luokka
}

//Ottaa vastaan ja käsittelee vastauksen automaatin nostorajasta
void Withdraw::handleAtmLimit()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        maxWithdrawal = QString(responseData);
        if(callingClass == "withdraw") {
            emit atmLimitReady(maxWithdrawal); //Jos kutsujana on withdraw luokka, lähetetään signaali mainwindow:lle, jossa tieto tallennetaan muuttujaan
        }
        else {
            emit atmLimitToAdminMenu(maxWithdrawal); //Muussa tapauksessa signaali lähtee kutsujana olevaan adminMenu luokkaan
        }
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get automat limit" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan ja käsittelee vastauksen nostopyynnöstä
void Withdraw::handleWithdrawal()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        QString response = QString(responseData).replace("\"", "");
        qDebug() << "Withdraw response: " << QString(responseData);

        //Lähetetään tieto noston tuloksesta signaalina mainwindow:lle
        if(response == "account limit exceeded") {
            emit withdrawFailure("Tilin nostoraja ylittyy");
        }
        else if(response == "withdrawal ok") {
            emit withdrawalOk(amount);
        }
        else if(response == "not enough bills") {
            emit withdrawFailure("Oikeankokoiset setelit lopussa");
        }
        else if(response == "not enough balance") {
            emit withdrawFailure("Tilin kate ei riitä");
        }

    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get response from withdrawal" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Lähettää REST API:lle pyynnön noutaa automaatin nostoraja
void Withdraw::requestAtmLimit(QByteArray token,QString automatID,QString callingclass)
{
    callingClass = callingclass;
    this->token = token;
    this->automatID = automatID;
    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(this->token)); //Web tokenin lähetys
    request.setUrl(QUrl("http://localhost:3000/automat/getAtmLimit/"+this->automatID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleAtmLimit())); //Kytketään vastaus slottiin
}

//Lähettää REST API:lle nostopyynnön
void Withdraw::requestWithdrawal()
{
    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(token)); //Web tokenin lähetys
    QJsonObject body;
    body.insert("id_account",accountID);
    body.insert("id_card",cardID);
    body.insert("id_automat",automatID);
    body.insert("amount",amount);
    request.setUrl(QUrl("http://localhost:3000/account/attemptWithdrawal"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleWithdrawal())); //Kytketään vastaus slottiin
}
