import React, { useCallback } from 'react';
import { View, Button } from 'react-native';

import { Container, Header, HeaderTitle, UserName, ProfileButton, UserAvatar }  from './styes';

import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const {navigate} = useNavigation();

  const navigateProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem Vindo, {"\n"}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateProfile}>
          <UserAvatar source={{ uri: user.avatar_url }}/>
        </ProfileButton>
      </Header>
    </Container>
  );
};

export default Dashboard;
