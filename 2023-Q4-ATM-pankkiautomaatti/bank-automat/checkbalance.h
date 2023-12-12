#ifndef CHECKBALANCE_H
#define CHECKBALANCE_H

#include <QObject>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>
#include <QJsonObject>

class CheckBalance : public QObject
{
    Q_OBJECT
public:
    explicit CheckBalance(QObject* parent = nullptr);
    ~CheckBalance();
    void displayBalance(QByteArray token, QString accountID, QString cardType);
public slots:
    void handleGetBalance();
signals:
    //void balanceReady(QString balance);
    void balanceReady(QString formattedBalance, QString formattedCreditLimit);

private:
    QByteArray token;
    QString accountID;
    QString cardType;
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
};

#endif // CHECKBALANCE_H

