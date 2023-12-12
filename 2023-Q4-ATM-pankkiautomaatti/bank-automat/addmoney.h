#ifndef ADDMONEY_H
#define ADDMONEY_H

#include <QObject>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>

class AddMoney:public QObject
{
    Q_OBJECT
public:
    AddMoney(QObject * parent = nullptr);
    ~AddMoney();
    void requestTransactions(QByteArray token, QString cardID, QString cardType);
    void checkAtmBalances(QByteArray, QString);
    void insertValueOf(QString amount);
    QList<QString> getAtmBalances();
    QList<QString> getAddedMoney();
    void setDenomination(QString);
    void setCardID(QString);
    QString getDenomination();
public slots:
    void handleGetAtmBalances();
    void handleInsertValues();
signals:
    void atmBalancesReady();
    void atmBalancesToAdminMenu();
    void atmInsertValuesOk(QString);
private:
    void parseAtmBalances(const QString &data);
    int offset;
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QByteArray token;
    QString automatID;
    QString cardID;
    QString amount;
    QString denomination;
    QList<QString> parsedAtmBalances;
    QString callingclass;
};

#endif // ADDMONEY_H
