import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import modalStyles from '../styles/ModalStyles';
import { useTheme } from 'react-native-paper';
import { useCustomTheme } from '../theme/CustomTheme';

/**
 * ConfirmDeleteModal displays a modal to confirm deletion of a route.
 */

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onDelete,
}) {
  const { colors } = useTheme();
  const { isDarkTheme } = useCustomTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={[modalStyles.modalView, { backgroundColor: colors.background }]}>
          <Text style={[modalStyles.modalText, { color: colors.text }]}>
            Delete the route? This will render the route inaccessible from the boulder map.
          </Text>
          <View style={modalStyles.modalButtonContainer}>
            <TouchableOpacity
              style={[modalStyles.modalButtonDanger, { backgroundColor: colors.accent }]}
              onPress={onDelete}
            >
              <Text style={modalStyles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.modalButton, { backgroundColor: colors.accent2 }]}
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