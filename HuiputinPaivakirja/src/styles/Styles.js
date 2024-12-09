import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screenBaseContainer: {
        flex: 1,
    },
    headerContainer: {
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 70,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonContainerVertical: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    buttonContainerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerBottom: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
    },
    buttonTopRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        top: 20,
        right: 10,
    },
    toMapButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    button: {
        margin: 10,
        width: 100, 
    },
    buttonLong: {
        width: 150,
        margin: 10,
    },
    buttonLonger: {
        width: 200,
        margin: 10,
    },
    buttonContent: {
        flexDirection: 'row-reverse', // Ensure the icon is on the left
        justifyContent: 'center', // Center the text
    },
    buttonLabel: {
        flex: 1, // Ensure the text takes up the remaining space
        textAlign: 'center', // Center the text
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    input: {
        marginBottom: 10,
        //color: 'white',
    },
    greetingContainer: {
        marginTop: 100,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greetingText: {
        fontSize: 18,
    },
    basicText: {
        fontSize: 18,
        marginBottom: 10,
    },
    marginLeft16: {
        marginLeft: 16,
    },
    bold: {
        fontWeight: 'bold',
    },
    notification: {
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        zIndex: 1,
    },
    notificationText: {
        color: 'white',
        textAlign: 'center',
    },
    centeredbaseContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapImage: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1, // Adjust this to match your image's aspect ratio
        resizeMode: 'contain',
    },
    svgOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    deleteButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    image: { 
        width: '100%', 
        height: 700, 
        resizeMode: 'contain', 
        marginTop: 32, 
        marginBottom: 16 
    },
    ClickableRouteContainer: {
        width: '100%',
        height: 65,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    verticalContainerRouteInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'left',
        marginLeft: 20,
        marginTop: 4,
        marginBottom: 4,
    },
    routeTriesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    routeTriesIndicator: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 20,
    },
    smallText: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 5
    },
    horizontalSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    counterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
});

export default styles;