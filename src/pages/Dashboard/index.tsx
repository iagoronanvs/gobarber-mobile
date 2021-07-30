import React, { useCallback, useEffect, useState } from 'react';
import { View, Button } from 'react-native';

import { Container, Header, HeaderTitle, UserName, ProfileButton, UserAvatar, ProvidersList }  from './styes';

import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const { signOut, user } = useAuth();
  const {navigate} = useNavigation();

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  const navigateProfile = useCallback(() => {
    // navigate('Profile');
    signOut();
  }, [navigate, signOut]);

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

      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        renderItem={({item}) => (
          <UserName>{item.name}</UserName>
        )}
      />
    </Container>
  );
};

export default Dashboard;
