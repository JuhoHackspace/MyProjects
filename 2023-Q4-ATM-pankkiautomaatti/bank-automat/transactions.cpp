#include "transactions.h"

Transactions::Transactions(QObject *parent)
    : QObject{parent}
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

Transactions::~Transactions()
{
}

//Ottaa vastaan tarvittavat tiedot parametreina ja lähettää REST API:lle pyynnön noutaa tilitapahtumat
void Transactions::showTransactions(QByteArray token, QString accountID, int offset, QString type)
{
    this->token = token;
    this->accountID = accountID;
    this->offset = offset; //Tätä muuttujaa käytetään tapahtumien selaamisessa. Uudemmat -> offset -= 5, Vanhemmat -> offset += 5
    this->type = type; //Tämä muuttuja kertoo mikä tila pyysi tapahtumia (balance tai transactions)

    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(this->token));
    QJsonObject body;
    body.insert("id_account",this->accountID);
    body.insert("offset",this->offset);
    request.setUrl(QUrl("http://localhost:3000/frontendEvents"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetTransaction())); //Kytketään vastaus slottiin
}

//Palauttaa tapahtumat formatoituina QStringeinä QList objektissa
QList<QString> Transactions::getTransactions()
{
    return parsedTransactions;
}

//Palauttaa tapahtumien kokonaismäärän
int Transactions::maxTransactions()
{
    return maximumTransactions;
}

//Ottaa vastaan ja käsittelee vastauksen tilitapahtumien noutamisesta
void Transactions::handleGetTransaction()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData != "false") {
            maximumTransactions = reply->rawHeader("X-Transactions-Count").toInt(); //Tapahtumien määrä on REST API:ssa asetettu rawHeaderiin
            parseTransactions(responseData); //Siirretään tapahtumat formatoitavaksi
        }
        else {
            qDebug() << "Unexpected answer: " << responseData;
        }
    } else {
        // Käsitellään mahdollinen virhe
        qDebug() << "Could not get transactions: " << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Formatoi tilitapahtumat oikeaan muotoon QList objektiin
void Transactions::parseTransactions(const QString &data)
{
    parsedTransactions.clear();
    QJsonDocument jsonResponse = QJsonDocument::fromJson(data.toUtf8());

    if (!jsonResponse.isArray()) {
        qDebug() << "Invalid JSON data format.";
        return;
    }

    QJsonArray jsonArray = jsonResponse.array();

    for (const auto& jsonValue : jsonArray) {
        QString event_type;
        if (jsonValue.isObject()) {
            QJsonObject jsonObject = jsonValue.toObject();

            if (jsonObject["event_type"].toString()=="withdrawal"){//withdrawal käännettynä suomeksi, muuta mahdolliset tapahtumat saa mennä ominaan.
                event_type = "Nosto";
            }
            else {
                event_type = jsonObject["event_type"].toString();
            }
            qDebug() << jsonObject["time"].toString();
            QDateTime time = QDateTime::fromString(jsonObject["time"].toString(), Qt::ISODate);
            QTimeZone stadi("Europe/Helsinki");
            time = time.toTimeZone(stadi);
            qDebug() << time;
            QString amount = jsonObject["amount"].toString();

            parsedTransactions.append(QString("%1\t  %2\t     %3\n").arg(time.toString("dd.MM.yy hh:mm")).arg(event_type).arg(amount));
        }
    }
    if (type == "balance"){
        emit balanceTransReady(); //Jos kutsujana on saldon tarkistus, lähetetään signaali balanceTransReady mainwindowlle
    } else {
        emit transactionsReady(); //Muussa tapauksessa kutsujana on tilitapahtumien tarkastelu, tämä signaali vie mainwindow:ssa
    }                             //tapahtumien tarkastelu näkymään
}
