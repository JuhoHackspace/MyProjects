#ifndef VIEWLOG_H
#define VIEWLOG_H

#include <QObject>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>
#include <QChar>


class ViewLog:public QObject
{
    Q_OBJECT
public:
    ViewLog(QObject * parent = nullptr);
    ~ViewLog();
    void requestEvents(QByteArray, QString, int);
    QList<QString> getEvents();
    int maxEvents();
public slots:
    void handleGetEvents();
signals:
    void LogReady();
private:
    void parseEvents(const QString &data);
    QByteArray token;
    QString automatID;
    int offset;
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QList<QString> parsedEvents;
    int maximumEvents;
};

#endif // VIEWLOG_H
