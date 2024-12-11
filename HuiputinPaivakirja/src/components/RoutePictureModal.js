import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import modalStyles from '../styles/ModalStyles';
import { useTheme } from 'react-native-paper';

/**
 * ModalView displays a modal with a picture of a route.
 */

export default function ModalView({
  visible,
  onClose,
  routeImageUrl,
}) {
  const { colors } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <Image source={{uri: routeImageUrl}} style={modalStyles.modalPicture}/>
        <View style={modalStyles.picureModalButtonView}>
          <TouchableOpacity
            style={[modalStyles.modalButton, { backgroundColor: colors.accent }]}
            onPress={onClose}
          >
            <Text style={modalStyles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}