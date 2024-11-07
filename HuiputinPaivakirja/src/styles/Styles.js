import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    screenBaseContainer: {
        flex: 1
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
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 16
    },
    input: {
        marginBottom: 10,
        backgroundColor: 'white'
    },
    greetingContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center',        
        justifyContent: 'center',   
      }
})

export default styles