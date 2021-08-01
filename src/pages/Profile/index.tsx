import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import * as Yup from 'yup';
import Modal from 'react-native-modal';

import { FormHandles } from '@unform/core';
import Input from '../../components/Input';
import Button from '../../components/Button';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Title,
  Form,
  UserAvatarButton,
  UserAvatar,
  BackButton,
  UserAvatarContainer,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalButton,
  ModalButtonText,
  ModalCloseButton,
} from './styles';

import { useAuth } from '../../hooks/auth';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();

  const [show, setShow] = useState(false);

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: value => !!value.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: value => !!value.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, old_password, password, password_confirmation } =
          data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
        );
      }
    },
    [navigation],
  );

  const handleToggleModal = useCallback(() => {
    setShow(show => !show);
  }, []);

  const handleUpdateAvatar = useCallback(
    (mode: 'CAMERA' | 'LIBRARY') => {
      if (mode === 'LIBRARY') {
        ImagePicker.launchImageLibrary(
          {
            mediaType: 'photo',
          },
          (response: any) => {
            setShow(show => !show);

            if (response.didCancel) {
              return;
            }

            if (response.error) {
              Alert.alert('Erro ao atualizar seu avatar');
              return;
            }

            const [{ uri, fileName: name }] = response.assets;

            const formData = new FormData();

            formData.append('avatar', {
              type: 'image/jpeg',
              name,
              uri,
            });

            api.patch('/users/avatar', formData).then(response => {
              updateUser(response.data);
            });

            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          },
        );
      }

      if (mode === 'CAMERA') {
        ImagePicker.launchCamera(
          {
            mediaType: 'photo',
          },
          (response: any) => {
            setShow(show => !show);

            if (response.didCancel) {
              return;
            }

            if (response.error) {
              Alert.alert('Erro ao atualizar seu avatar');
              return;
            }

            const [{ uri, fileName: name }] = response.assets;

            const formData = new FormData();

            formData.append('avatar', {
              type: 'image/jpeg',
              name,
              uri,
            });

            api.patch('/users/avatar', formData).then(response => {
              updateUser(response.data);
            });
          },
        );
      }
    },
    [updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarContainer>
              <UserAvatarButton onPress={handleToggleModal}>
                <UserAvatar source={{ uri: user.avatar_url }} />
              </UserAvatarButton>
            </UserAvatarContainer>

            <View>
              <Title>Meu Perfil</Title>
            </View>

            <Form ref={formRef} initialData={user} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />

              <Input
                ref={emailInputRef}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              />

              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                name="old_password"
                icon="lock"
                placeholder="Senha Atual"
                textContentType="newPassword"
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova Senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus();
                }}
              />

              <Input
                ref={confirmPasswordInputRef}
                secureTextEntry
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Confirmar Mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>

        <Modal isVisible={show}>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>Selecione um avatar</ModalTitle>
              <ModalCloseButton onPress={handleToggleModal}>
                <Icon name="x" size={18} />
              </ModalCloseButton>
            </ModalHeader>

            <ModalButton onPress={() => handleUpdateAvatar('CAMERA')}>
              <Icon name="camera" size={18} />
              <ModalButtonText>Usar Câmera</ModalButtonText>
            </ModalButton>
            <ModalButton onPress={() => handleUpdateAvatar('LIBRARY')}>
              <Icon name="image" size={18} />
              <ModalButtonText>Escolha da galeria</ModalButtonText>
            </ModalButton>
          </ModalContainer>
        </Modal>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
