import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Form as UnForm } from '@unform/mobile';

export const Container = styled.View`
  flex: 1;
  /* align-items: center; */
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 100 : 40}px;
  position: relative;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  /* font-family: 'RobotoSlab-Medium'; */
  margin: 24px 0;
`;

export const Form = styled(UnForm)`
  width: 100%;
`;

export const UserAvatarContainer = styled.View`
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 32px;
  margin-bottom: 10px;
  border-radius: 98px;
  width: 186px;
  height: 186px;
  background: red;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  align-self: center;
  border-radius: 98px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 40px;
`;
