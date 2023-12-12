#include "checkbalance.h"
#include <QLocale>

CheckBalance::CheckBalance(QObject *parent)
    : QObject{parent}
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

CheckBalance::~CheckBalance()
{
}

//Ottaa vastaan tarvittavat tiedot parametreina ja lähettää pyynnön REST API:lle tilin saldon noutamiseksi
void CheckBalance::displayBalance(QByteArray token, QString accountID, QString cardType)

{
    this->token = token;
    this->accountID = accountID;
    this->cardType =cardType;

    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(this->token));
    request.setUrl(QUrl("http://localhost:3000/account/getBalance/"+this->accountID));

    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    qDebug() << "Request URL:" << request.url().toString();

    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetBalance()));
}

//Ottaa vastaan ja käsittelee vastauksen tilin saldosta
void CheckBalance::handleGetBalance()
{
     QNetworkReply *reply = qobject_cast<QNetworkReply*>(sender());

    if (reply->error() == QNetworkReply::NoError) {
        //Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        qDebug() << "Response Data:" << responseData;
        //Käsitellään vastaus
        QJsonDocument jsonResponse = QJsonDocument::fromJson(responseData);

        if (!jsonResponse.isNull() && jsonResponse.isObject()) {
            QJsonObject jsonObject = jsonResponse.object();

            if (jsonObject.contains("balance") && jsonObject.contains("credit_limit")) {
                QString balanceString = jsonObject["balance"].toString();
                QString creditLimitString = jsonObject["credit_limit"].toString();

                bool balanceOk, creditLimitOk;
                double balance = balanceString.toDouble(&balanceOk);
                double creditLimit = creditLimitString.toDouble(&creditLimitOk);

                if (balanceOk && creditLimitOk) { //Tarkistetaan, että balance ja credit limit on onnistuuneesti muutettu double muotoon
                    if (cardType == "credit") {
                        balance += creditLimit; //Jos kortin tyyppi on credit, esitetään saldo käytettävissä olevana luottona
                    }

                    QLocale locale(QLocale::English);
                    QString formattedBalance = locale.toString(balance, 'f', 2) + " €";
                    QString formattedCreditLimit = locale.toString(creditLimit, 'f', 2) + " €";

                    formattedBalance.replace(",", " ");
                    formattedCreditLimit.replace(",", " ");

                     emit balanceReady(formattedBalance, formattedCreditLimit); //Lähetetään signaalin mukana tiedot mainwindow:lle
                //Käsitellään mahdolliset virheet
                } else {
                    qDebug() << "Invalid balance or credit_limit format";
                }
            } else {
                qDebug() << "Invalid JSON structure. Missing fields.";
            }
        } else {
            qDebug() << "Invalid JSON data format.";
        }
    } else {
        qDebug() << "Could not get balance" << reply->errorString();
    }

    reply->deleteLater();


}
