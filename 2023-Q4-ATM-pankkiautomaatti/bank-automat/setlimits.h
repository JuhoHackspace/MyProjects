#ifndef SETLIMITS_H
#define SETLIMITS_H

#include <QObject>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>

class SetLimits:public QObject
{
    Q_OBJECT
public:
    SetLimits(QObject * parent = nullptr);
    ~SetLimits();
    QString getATMLimit();
public slots:
    void requestLimit(QByteArray token, QString automatID);
    void setLimit(QString automatID, QString newLimit);
    void handleGetLimit();
    void handleSetLimit();
signals:
    void atmLimitReady();
    void automatCheckLimits();
    void automatSetLimits();
    void atmInsertLimitOk(QByteArray,QString);
private:
    QString automatID;
    void parseLimits(const QString &data);
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString parsedAtmLimit;
    QString limit;
    QByteArray token;

};

#endif // SETLIMITS_H
