import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import modalStyles from '../styles/ModalStyles';

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onDelete,
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
              <Text style={modalStyles.modalText}>
                Delete the route? This will render the route inaccessible from the boulder map.
              </Text>
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
        </View>
      </View>
    </Modal>
  );
}