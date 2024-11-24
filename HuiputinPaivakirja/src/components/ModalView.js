import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import modalStyles from '../styles/ModalStyles';

export default function ModalView({
  visible,
  onClose,
  onDelete,
  deleteConfirmation,
  password,
  setPassword,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          {deleteConfirmation ? (
            <>
              <Text style={modalStyles.modalText}>
                Delete your account and all your related information?
              </Text>
              <TextInput
                style={modalStyles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <View style={modalStyles.modalButtonContainer}>
                <TouchableOpacity
                  style={modalStyles.modalButtonDanger}
                  onPress={onDelete}
                >
                  <Text style={modalStyles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={modalStyles.modalButton}
                  onPress={onClose}
                >
                  <Text style={modalStyles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={modalStyles.modalText}>Modal!</Text>
              <TouchableOpacity
                style={modalStyles.modalButton}
                onPress={onClose}
              >
                <Text style={modalStyles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}