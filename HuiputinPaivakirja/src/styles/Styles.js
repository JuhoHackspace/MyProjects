import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    screenBaseContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    headerContainer: {
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 50
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    buttonContainerVertical: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16

    },
    buttonContainerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    button: {
        margin: 5
    }
    
})

export default styles