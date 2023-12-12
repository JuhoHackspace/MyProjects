QT       += core gui
QT       += network
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    addmoney.cpp \
    adminmenuinfo.cpp \
    checkbalance.cpp \
    login.cpp \
    main.cpp \
    mainwindow-buttons.cpp \
    mainwindow-connects.cpp \
    mainwindow-handlers.cpp \
    mainwindow-showAdminSlots.cpp \
    mainwindow-showLoginSlots.cpp \
    mainwindow-showOtherSlots.cpp \
    mainwindow-showUserSlots.cpp \
    mainwindow.cpp \
    setlimits.cpp \
    transactions.cpp \
    viewlog.cpp \
    withdraw.cpp

HEADERS += \
    addmoney.h \
    adminmenuinfo.h \
    checkbalance.h \
    login.h \
    mainwindow.h \
    setlimits.h \
    transactions.h \
    viewlog.h \
    withdraw.h

FORMS += \
    mainwindow.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

RESOURCES += \
    styles/resources.qrc
