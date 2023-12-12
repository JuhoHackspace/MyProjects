#include "addmoney.h"

// ** AddMoney ** -liittyy automaatin hallinnointiin (ATM) ja siihen päästään admin näkymästä, ADMIN_MENU kautta
// Automaatin käyttövarojen tarkastaminen on valmis
// Käyttövarojen lisääminen ei aloitettu

AddMoney::AddMoney(QObject * parent): QObject(parent)
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

AddMoney::~AddMoney()
{
}

//Lähettää pyynnön REST API:lle automaatin varojen noutamiseksi
void AddMoney::checkAtmBalances (QByteArray token, QString automatID)
{
    //Asetetaan tarvittavat tiedot muuttujiin
    this->token = token;
    this->automatID = automatID;

    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(this->token)); //Web tokenin lähetys
    request.setUrl(QUrl("http://localhost:3000/automat/getBalances/"+this->automatID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetAtmBalances())); //Kytketään vastaus oikeaan slottiin
}

//Palauttaa QList objektin sisällä automaatin varat formatoituina QStringeinä
QList<QString> AddMoney::getAtmBalances()
{
    return parsedAtmBalances;
}

//Asettaa lisättävän setelin muuttujaan denomination. Tätä käytetään InsertValueOf metodissa.
void AddMoney::setDenomination(QString denomination)
{
    this->denomination = denomination;
}

//Asettaa kortin ID:n
void AddMoney::setCardID(QString cardID)
{
    this->cardID = cardID;
}

//Palauttaa lisättävän setelin muuttujasta denomination
QString AddMoney::getDenomination()
{
    return denomination;
}

//Ottaa vastaan ja käsittelee vastauksen automaatin varoista
void AddMoney::handleGetAtmBalances()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        parseAtmBalances(responseData); //Formatoidaan vastaus oikeaan muotoon
    }
    else {
        //Käsitelään mahdollinen virhe
        qDebug() << "Could not get atm balances";
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan, formatoi ja asettaa QList objektiin automaatin varat QStringeinä
void AddMoney::parseAtmBalances(const QString &data)
{
    parsedAtmBalances.clear(); //Tyhjennetään objekti
    QJsonDocument jsonResponse = QJsonDocument::fromJson(data.toUtf8());

    QJsonObject jsonObject = jsonResponse.object();
        qDebug() << jsonObject ;
    parsedAtmBalances.append(QString::number(jsonObject["balance_10"].toInt()));
    parsedAtmBalances.append(QString::number(jsonObject["balance_20"].toInt()));
    parsedAtmBalances.append(QString::number(jsonObject["balance_50"].toInt()));
    parsedAtmBalances.append(QString::number(jsonObject["balance_100"].toInt()));

    emit atmBalancesToAdminMenu(); //Lähetetään signaali adminMenu:lle
}

// Lisää käyttövaroja automaattiin -alkaa tästä

//Ottaa vastaan lisättävien setelien määrän ja lähettää pyynnön REST API:lle varojen lisäämiseksi automaattiin
void AddMoney::insertValueOf(QString amount)
{
    this->amount = amount;
    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(token)); //Web tokenin lähetys
    QJsonObject body;
    body.insert("id_automat", automatID);
    body.insert("id_card", cardID);
    body.insert("amount", this->amount);
    request.setUrl(QUrl("http://localhost:3000/automat/addMoney/"+denomination));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleInsertValues())); //Kytketään vastaus oikeaan slottiin
}

//Ottaa vastaan ja käsittelee vastauksen varojen lisäämisestä automaattiin
void AddMoney::handleInsertValues() {
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        //Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        QString response = QString(responseData).replace("\"", "");

        if (response == "succes") {
            emit atmInsertValuesOk(this->amount); //Jos varat on lisätty onnistuneesti, lähetetään signaali mainwindow:lle
        } else {
            qDebug() << "Unexpected response: " << response;
        }
    } else {
        //Käsitellään mahdollinen virhe
        qDebug() << "Could not add money" << reply->errorString();
    }
    reply->deleteLater();
}

