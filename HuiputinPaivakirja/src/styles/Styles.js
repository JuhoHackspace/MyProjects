
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screenBaseContainer: {
        flex: 1,
    },
    headerContainer: {
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 50,
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
        padding: 16,
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
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    input: {
        marginBottom: 10,
        backgroundColor: 'white',
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
    mapContainer: {
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
});

export default styles;