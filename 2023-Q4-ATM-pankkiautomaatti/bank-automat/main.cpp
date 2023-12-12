#include "mainwindow.h"
#include <QApplication>
#include <QFile>
#include <QDebug>
#include <QDir>
#include <QResource>


int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    QFile styleFile(":/bankstyle.qss");

    qDebug() << "Current working directory: " << QDir::currentPath();
    if (styleFile.open(QFile::ReadOnly | QFile::Text)) {
        QString style = QLatin1String(styleFile.readAll());
        a.setStyleSheet(style);
        styleFile.close();
    } else {
        qDebug() << "Failed to open a stylesheet file.";
    }

    MainWindow w;

    w.setWindowTitle("Bankki");
    w.show();
    //w.showAnimatedGifBeforeLogin();

    return a.exec();
}
