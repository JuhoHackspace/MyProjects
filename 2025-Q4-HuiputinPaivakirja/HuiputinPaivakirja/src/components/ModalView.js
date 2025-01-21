import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import modalStyles from '../styles/ModalStyles';
import { useTheme } from 'react-native-paper';

/**
 * ModalView displays a modal for confirmation of account deletion.
 */

export default function ModalView({
  visible,
  onClose,
  onDelete,
  deleteConfirmation,
  password,
  setPassword,
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
        <View style={[modalStyles.modalView, { backgroundColor: colors.background }]}>
          {deleteConfirmation ? (
            <>
              <Text style={[modalStyles.modalText, { color: colors.text }]}>
                Delete your account and all your related information?
              </Text>
              <TextInput
                style={[modalStyles.input, { color: colors.text, borderColor: colors.text }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.text}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
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
            </>
          ) : (
            <>
              <Text style={[modalStyles.modalText, { color: colors.text }]}>Modal!</Text>
              <TouchableOpacity
                style={[modalStyles.modalButton, { backgroundColor: colors.accent }]}
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