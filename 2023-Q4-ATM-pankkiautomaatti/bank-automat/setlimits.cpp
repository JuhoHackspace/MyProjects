#include "setlimits.h"

// ** SetLimits ** -liittyy automaatin hallinnointiin (ATM) ja siihen päästään admin näkymästä, ADMIN_MENU kautta

SetLimits::SetLimits(QObject * parent): QObject(parent)
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

SetLimits::~SetLimits()
{
}

//Ottaa vastaan tarvittavat tiedot parametreina, sekä lähettää REST API:lle pyynnön automaatin nostorajan noutamiseksi
void SetLimits::requestLimit(QByteArray token, QString automatID)
{
    this->automatID = automatID;
    this->token = token;
    qDebug() << "Request limit, automatID"<<this->automatID;
    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(this->token));
    request.setUrl(QUrl("http://localhost:3000/automat/getAtmLimit/"+this->automatID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetLimit()));
}

//Ottaa vastaan uuden nostorajan ja lähettää REST API:lle pyynnön nostorajan asettamiseksi
void SetLimits::setLimit(QString automatID, QString newLimit)
{
    qDebug()<<"Setlimit";
    this->automatID = automatID;
    limit = newLimit;
    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(token));
    QJsonObject body;
    body.insert("id_automat",this->automatID);
    body.insert("ATMlimit",limit);
    request.setUrl(QUrl("http://localhost:3000/automat/setATMLimit/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleSetLimit()));
}

//Palauttaa automaatin nostorajan
QString SetLimits::getATMLimit()
{
    return parsedAtmLimit;
}

//Ottaa vastaan ja käsittelee vastauksen nostorajan noutamisesta
void SetLimits::handleGetLimit()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        qDebug() << "handleGetLimit onnistunut vastaus" ;
        QByteArray responseData = reply->readAll();
        parseLimits(responseData); //Kun nostoraja on noudettu, muutetaan se oikeaan muotoon
    }else{
        //Käsittellään mahdollinen virhe
        qDebug() << "handleGetLimit epäonnistunut vastaus" ;
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan ja käsittelee vastauksen nostorajan asettamisesta
void SetLimits::handleSetLimit()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        //Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        QString response = QString(responseData).replace("\"", "");

        if (response == "success") {
            emit atmInsertLimitOk(this->token,this->automatID); //Lähetetään signaali atmInsertLimitOk, kun uusi raja on asetettu
                                                                //Tämä signaali on kytketty requestLimit slottiin tässä luokassa
        } else {
            qDebug() << "Unexpected response: " << response;
        }
    } else {
        qDebug() << "Could not set new limit" << reply->errorString();
    }
    reply->deleteLater();
}

//Muuttaa nostorajan QString muotoon sekä viestii tästä mainwindow:lle
void SetLimits::parseLimits(const QString &data)
{
    qDebug() << "parseLimits. data:" << data ;
    parsedAtmLimit = data;
    emit atmLimitReady(); //Lähetetään signaali mainwindow:lle, joka näyttää nostorajan näytöllä
}
