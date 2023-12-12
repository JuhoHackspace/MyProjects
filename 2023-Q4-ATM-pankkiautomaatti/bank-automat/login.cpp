#include "login.h"

Login::Login(QObject *parent) :
    QObject(parent)
{
    cardID = "";
    pin = "";
    cardType = "";
    token = "";
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
    pin_attempted = false;
}

Login::~Login()
{

}

//Ottaa vastaan kortin ID:n sekä automaatin ID:n mainwindow:sta
void Login::setCardID(const QString &inputCardID, const QString &automatID)
{
    cardID = inputCardID;
    this->automatID = automatID;
    pin_attempted = false;
    requestCardID(); // Kutsutaan metodia, josta lähtee pyyntö REST APIlle kortin tyypin tarkistukselle
}

//Ottaa vastaan PIN koodin sekä kortin tyypin mainwindows:sta
void Login::setPIN(const QString &inputPin,const QString &cardType)
{
    this->cardType = cardType;
    pin = inputPin;
    requestLogin();// Kutsutaan metodia, josta lähtee login pyyntö REST APIlle
}

//Ottaa vastaan ja käsittelee vastauksen kortin tyypin tarkistuksesta REST APIsta
void Login::handleCard()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());

    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastausta

        if(responseData == "false") {
            emit cardFail(); //Tuntematon kortin ID, lähetetään signaali cardFail() maindwindow:lle
        }
        else {
            cardType = QString(responseData).replace("\"", "");
            qDebug() << "cardType:" << cardType;
            if (cardID.toInt() < 1) { //Tarkistetaan, ettei ole annettu numeroa 1 pienempää kortin ID:tä
                emit cardFail(); //Jos ID on 0 -> cardFail() maindwindow:lle
            } else {
                token = ""; //Pyyhitään mahdollinen edellinen token
                checkPinAttempts(); //Jos kortti löytyy, lähdetään tarkistamaan pin koodin yrityskerrat
            }
        }
    } else {
        // Käsitellään mahdollinen virhe vastauksessa (verkkovirhe)
        qDebug() << "Couldnt get card type" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan ja käsittelee vastauksen login pyynnöstä.
void Login::handlePin()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());

    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus

        qDebug() << responseData;
        if(responseData != "false") { //Jos vastaus on != "false", niin token on vastaanotettu ja kirjautuminen ok
            token = "Bearer "+responseData; //Tallennetaan webtoken myöhempää signaalia varten
            clearPinAttempts(); //Kutsutaan metodia, joka tyhjentää pin koodin yritykerrat kortilta tietokannasta
        }
        else {
            pin_attempted = true;
            addAttempt(); //Jos kirjautuminen epäonnistui, kutsutaan metodia, joka lisää yhden pin koodin yritykerran kortille tietokantaan.
        }
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not login" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan ja käsittelee vastauksen kortin pin koodin yrityskerroista
void Login::handleAttempts()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData == "3") {
            emit cardLocked(); //Jos kolme yritystä on täynnä niin lähetetään cardLocked() signaali mainwindow:lle
        }
        else {
            if(!pin_attempted) { //Muussa tapauksessa, tarkistetaan onko piniä yritetty tällä käyttökerralla jo vähintään kerran

                if(cardType == "credit/debit") { //Jos piniä ei vielä oltu yritetty ja kyseessä on yhdistelmäkortti
                    emit cardOkSelectType();     //Lähetetään signaali mainwindow:lle, joka aktivoi valitse tyyppi tilan
                }
                else { //Jos kortti on credit, debit tai admin
                    emit cardOk(cardType); //Lähetetään signaali cardOk() mainwindow:lle, jossa siirrytään pin koodin kyselyyn
                }
            }
            else {
                emit loginFail(); //Jos piniä oli jo yritetty kertaalleen, ja korttia ei vielä lukita, lähetetään signaali mainwindow:lle,
                                  //jossa siirrytään yritä uudestaan tilaan
            }
        }


        qDebug() << responseData;

    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get attempts" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan tiedon onnistuneesta pin koodin yrityskerran lisäämisesta kortille tietokantaan
void Login::handleAddedAttempt()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData == "true") {
            checkPinAttempts(); //Jos vastaus on odotettu, ja yksi yrityskerta on lisätty kortille, niin lähdetään heti perään tarkistamaan yrityskerrat.
        }

        qDebug() << responseData;

    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not add an attempt" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan ja käsittelee vastauksen pin koodin yrityskerojen nollaamisesta
void Login::handleClearAttempts()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData == "true") { //Jos vastaus on odotettu, ja yritykerrat kortilta on nollattu, niin siirrytään kirjautumisesta eteenpäin
            if (cardType == "admin") { //Tarkistetaan vasta täällä, onko kortin tyyppi admin, koska seuraavat signaalit vievät käyttäjän päävalikkoon tai adminMenu luokkaan
                emit loginOkAdmin(token); //Signaali adminMenu:lle adminin päävalikon tietojen noutamiseksi
            }
            else {
                requestAccountID(); //Jos tili on credit tai debit, niin noudetaan tietokannast vielä id_account, jota tarvitaan muissa tiloissa
            }
        }

        qDebug() << responseData;

    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not clear attempts" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

void Login::handleGetAccountID()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData != "false") {
            accountID = QString(responseData); //Jos account ID:n noutaminen onnistui
            emit loginOkUser(token, accountID);      //lähetetään signaali mainwindow:lle käyttäjän päävalikkoon siitymiseksi
            qDebug() << responseData;
        }
        else {
            qDebug() << "No matching account ID";
            emit loginFail(); //Jos käyttäjän account ID:tä ei löydy, kirjautuminen epäonnistuu
        }

    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get account ID" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Lähettää REST API:lle tiedon uloskirjautumisesta
void Login::requestLogout()
{
    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(token)); //Web tokenin lähetys
    QJsonObject body;
    body.insert("id_automat",automatID); //Asetetaan request bodyyn id_automat
    body.insert("id_card",cardID);       //ja id_card
    request.setUrl(QUrl("http://localhost:3000/eventLog"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleLogout())); //Kytketään vastaus slottiin
}

//Ottaa vastaan ja käsittelee vastauksen uloskirjautumisesta
void Login::handleLogout()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData == "success") {
            emit logoutOk(); //Jos uloskirjaus on kirjattu tietokantaan, lähetetään mainwindow:lle signaali, jolla palataan alkutilaan
        }
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not logout" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Lähettää REST API:lle pyynnön kortin tyypin tarkistamiseksi
void Login::requestCardID()
{
    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/cardAttempts/cardType/"+cardID));
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleCard()));
}

//Lähettää REST API:lle login pyynnön
void Login::requestLogin()
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_card",cardID);
    body.insert("pin",pin);
    request.setUrl(QUrl("http://localhost:3000/login"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handlePin()));
}

//Lähettää pyynnön REST API:lle pin koodin yritykertojen noutamiseksi
void Login::checkPinAttempts()
{
    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/cardAttempts/"+cardID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleAttempts()));
}

//Lähettää pyynnnön REST APIlle pin koodin yrityskertojen nollaamiseksi
void Login::clearPinAttempts()
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_card",cardID);
    body.insert("automat_id",automatID);
    request.setUrl(QUrl("http://localhost:3000/cardAttempts/clear"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleClearAttempts()));
}

//Lähettää REST API:lle pyynnön account ID:n noutamiseksi
void Login::requestAccountID()
{
    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(token));
    QJsonObject body;
    body.insert("id_card",cardID);
    body.insert("account_type",cardType);
    request.setUrl(QUrl("http://localhost:3000/account/getID"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetAccountID()));
}

//Lähettää REST API:lle pyynnön lisätä yksi yrityskerta kortille tietokantaan
void Login::addAttempt()
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_card",cardID);
    body.insert("automat_id",automatID);
    request.setUrl(QUrl("http://localhost:3000/cardAttempts/addAttempt"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleAddedAttempt()));
}


