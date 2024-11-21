import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import modalStyles from '../styles/ModalStyles';

export default function ModalView({ visible, onClose }) {
    return (
      <Modal
        animationType="slide" 
        transparent={true}
        visible={visible}
        onRequestClose={onClose} 
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Modal!</Text>
            <TouchableOpacity
              style={modalStyles.modalButton}
              onPress={onClose}
            >
              <Text style={modalStyles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }