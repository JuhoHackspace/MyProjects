#ifndef TRANSACTIONS_H
#define TRANSACTIONS_H

#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QObject>

class Transactions : public QObject
{
    Q_OBJECT
public:
    explicit Transactions(QObject *parent = nullptr);
    ~Transactions();
    void showTransactions(QByteArray, QString, int, QString);
    QList<QString> getTransactions();
    int maxTransactions();
public slots:
    void handleGetTransaction();
signals:
    void transactionsReady();
    void balanceTransReady();
    //void userTransactions();
private:
    void parseTransactions(const QString &data);
    QByteArray token;
    QString accountID;
    QString cardID;
    int offset;
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString returnedTransactions;
    QList<QString> parsedTransactions;
    int maximumTransactions;
    QString type;
};

#endif // TRANSACTIONS_H
