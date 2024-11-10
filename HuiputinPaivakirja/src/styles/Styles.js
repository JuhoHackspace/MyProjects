
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
    buttonTopRight: {
        position: 'absolute',
        top: 10,
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
        marginTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greetingText: {
        fontSize: 18,
    },
});

export default styles;