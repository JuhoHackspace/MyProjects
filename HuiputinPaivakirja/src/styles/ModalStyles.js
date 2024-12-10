import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
  },
  modalView: {
    borderRadius: 20,
    padding: 30, 
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, 
    shadowRadius: 5,
    width: '80%',
  },
  modalButtonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 20, 
    width: '100%',
  },
  modalButton: {
    flex: 1, 
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5, 
  },
  modalButtonDanger: {
    flex: 1, 
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  picureModalButtonView: {
    width: '80%',
    height: 40
  },
  modalPicture: {
    width: '80%',
    height: 550, 
    margin: 10
  },
});

export default modalStyles;