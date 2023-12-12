#ifndef LOGIN_H
#define LOGIN_H
#include <QObject>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>


namespace Ui {
class Login;
}

class Login : public QObject
{
    Q_OBJECT

public:
    explicit Login(QObject *parent = nullptr);
    ~Login();
    void setCardID(const QString &inputCardID, const QString &automatID);
    void setPIN(const QString &inputPin,const QString &cardType);
public slots:
    void handleCard();
    void handlePin();
    void handleAttempts();
    void handleAddedAttempt();
    void handleClearAttempts();
    void handleGetAccountID();
    void requestLogout();
    void handleLogout();

 signals:
    void loginFail();
    void loginOkUser(QByteArray token, QString accountID);
    void cardFail();
    void cardLocked();
    void cardOk(QString cardType);
    void cardOkSelectType();
    void loginOkAdmin(QByteArray token);
    void logoutOk();

private:
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString cardID;
    QString pin;
    QString cardType;
    QByteArray token;
    QString accountID;
    QString automatID;
    void requestCardID();
    void requestLogin();
    void checkPinAttempts();
    void clearPinAttempts();
    void requestAccountID();
    void addAttempt();
    bool pin_attempted;
};

#endif // LOGIN_H
