#ifndef WITHDRAW_H
#define WITHDRAW_H

#include <QObject>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>

class Withdraw : public QObject
{
    Q_OBJECT
public:
    explicit Withdraw(QObject *parent = nullptr);
    ~Withdraw();
    void setAmount(QString);
    void setInfo(QByteArray, QString, QString, QString,QString);
    void requestAtmLimit(QByteArray,QString, QString);
public slots:
    void handleAtmLimit();
    void handleWithdrawal();
signals:
    void atmLimitReady(QString limit);
    void atmLimitToAdminMenu(QString limit);
    void withdrawFailure(QString reason);
    void withdrawalOk(QString amount);
private:
    QByteArray token;
    QString accountID;
    QString cardID;
    QString cardType;
    QString amount;
    QString automatID;
    QString maxWithdrawal;
    QString callingClass;
    QNetworkAccessManager * manager;
    QNetworkReply * reply;
    void requestWithdrawal();
};

#endif // WITHDRAW_H
