import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import modalStyles from '../styles/ModalStyles';

export default function ModalView({
  visible,
  onClose,
  routeImageUrl,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
            <Image source={{uri: routeImageUrl}} style={{width: '80%', height: 550, margin: 10}}/>
            <View style={modalStyles.picureModalButtonView}>
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