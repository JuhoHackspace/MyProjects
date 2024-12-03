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
        <View style={modalStyles.modalView}>
            <Image source={{uri: routeImageUrl}} style={{width: '100%', height: 550}}/>
            <View style={modalStyles.modalButtonContainer}>
            <TouchableOpacity
                style={modalStyles.modalButton}
                onPress={onClose}
            >
                <Text style={modalStyles.modalButtonText}>Close</Text>
            </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
}