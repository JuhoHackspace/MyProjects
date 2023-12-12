#include "viewlog.h"

// ** ViewLog ** -liittyy automaatin hallinnointiin (ATM) ja siihen päästään admin näkymästä, ADMIN_MENU kautta

ViewLog::ViewLog(QObject * parent): QObject(parent)
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

ViewLog::~ViewLog()
{
}

//Ottaa vastaan tarvittavat tiedot parametreina ja lähettää REST API:lle pyynnön noutaa automaatin tapahtumat
void ViewLog::requestEvents(QByteArray token, QString automatID, int offset)
{
    this->token = token;
    this->automatID = automatID;
    this->offset = offset; //Tätä muuttujaa käytetään tapahtumien selaamisessa. Uudemmat -> offset -= 5, Vanhemmat -> offset += 5

    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(this->token));
    request.setUrl(QUrl("http://localhost:3000/frontendEvents/allEvents"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    QJsonObject body;
    body.insert("offset",this->offset);
    body.insert("automat_id",this->automatID);
    reply = manager->post(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetEvents())); //Kytketään vastaus slottiin
}

//Palauttaa tapahtumat formatoituina QStringeinä QList objektissa
QList<QString> ViewLog::getEvents()
{
    return parsedEvents;
}

//Palauttaa tapahtumien kokonaismäärän
int ViewLog::maxEvents()
{
    return maximumEvents;
}

//Ottaa vastaan ja käsittelee vastauksen automaatin tapahtumien noutamisesta
void ViewLog::handleGetEvents()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData != "false") {
            maximumEvents = reply->rawHeader("X-Transactions-Count").toInt(); //Tapahtumien määrä on REST API:ssa asetettu rawHeaderiin
            parseEvents(responseData); //Siirretään tapahtumat formatoitavaksi
        }
        else {
            qDebug() << "Error in database query";
        }
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get all events" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Formatoi automaatin tapahtumat oikeaan muotoon QList objektiin
void ViewLog::parseEvents(const QString &data)
{
    parsedEvents.clear();
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
            qDebug() << jsonObject;
            if (jsonObject["event_type"].toString()=="withdrawal"){
                event_type = "Nostanut";
            }
            else if(jsonObject["event_type"].toString()=="withdrawal attempt, not enough bills" ||
                    jsonObject["event_type"].toString()=="withdrawal attempt, not enough" ||
                    jsonObject["event_type"].toString()=="withdrawal attempt") {
                event_type = "Nostoyritys";
            }
            else if(jsonObject["event_type"].toString()=="login") {
                event_type = "Kirjautunut";
            }
            else if(jsonObject["event_type"].toString()=="logout") {
                event_type = "Keskeyttänyt";
            }
            else if(jsonObject["event_type"].toString()=="login attempt") {
                event_type = "Kirjautumisyritys";
            }
            else if(jsonObject["event_type"].toString()=="card locked") {
                event_type = "Kortti lukittu";
            }
            else if(jsonObject["event_type"].toString()=="added money 10") {
                event_type = "Lisännyt 10€";
            }
            else if(jsonObject["event_type"].toString()=="added money 20") {
                event_type = "Lisännyt 20€";
            }
            else if(jsonObject["event_type"].toString()=="added money 50") {
                event_type = "Lisännyt 50€";
            }
            else if(jsonObject["event_type"].toString()=="added money 100") {
                event_type = "Lisännyt 100€";
            }
            else {
                event_type = jsonObject["event_type"].toString();
            }
            qDebug() << jsonObject["time"].toString();
            QDateTime time = QDateTime::fromString(jsonObject["time"].toString(), Qt::ISODate);
            QTimeZone stadi("Europe/Helsinki");
            time = time.toTimeZone(stadi);
            qDebug() << time;
            QString amount = "-";
            if(jsonObject["amount"].toString()!="NULL") {
                auto separator = QChar('.');
                amount = jsonObject["amount"].toString().split(separator)[0];
            }

            if (event_type.startsWith("Nostanut")||event_type == "Nostoyritys") {
                amount = jsonObject["amount"].toString();
            }

            QString card = QString::number(jsonObject["id_card"].toInt());
            qDebug() << "ID CARD: " << card;
            parsedEvents.append( QString("%1\t %2\t %3\t%4\n").arg(time.toString("dd.MM.yy hh:mm")).arg(card).arg(event_type).arg(amount));
        }
    }
    emit LogReady(); //Lähetetään mainwindow:lle signaali, jolla siirrytään tapahtumien tarkastelunäkymään
}
