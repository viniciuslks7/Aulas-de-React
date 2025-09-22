// Tipos de navegação para o React Navigation

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  UserType: undefined;
  CadUnicoForm: undefined;
  CadUnicoForm2: {
    dadosFormulario?: {
      nomeCompleto: string;
      endereco: string;
      idade: string;
      categorias: {
        pix: boolean;
        dinheiro: boolean;
        cestaBasica: boolean;
        agasalhos: boolean;
      };
      relato: string;
    };
  };
  MainScreen: undefined;
  ProfileScreen: undefined;
  Splash: undefined;
  FirebaseTest: undefined;
};

// Tipos para as props de navegação das telas
export type LoginScreenNavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
  goBack: () => void;
  replace: (screen: keyof RootStackParamList) => void;
};

export type HomeScreenNavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
  goBack: () => void;
  replace: (screen: keyof RootStackParamList) => void;
};

export type UserTypeScreenNavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
  goBack: () => void;
  replace: (screen: keyof RootStackParamList) => void;
};

export type CadUnicoFormScreenNavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
  goBack: () => void;
  replace: (screen: keyof RootStackParamList) => void;
};

// Tipos específicos para uso com React Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
  route: RouteProp<RootStackParamList, 'Login'>;
};

export type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export type UserTypeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'UserType'>;
  route: RouteProp<RootStackParamList, 'UserType'>;
};

export type CadUnicoFormScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CadUnicoForm'>;
  route: RouteProp<RootStackParamList, 'CadUnicoForm'>;
};

export type CadUnicoForm2ScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CadUnicoForm2'>;
  route: RouteProp<RootStackParamList, 'CadUnicoForm2'>;
};

export type MainScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MainScreen'>;
  route: RouteProp<RootStackParamList, 'MainScreen'>;
};

export type ProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProfileScreen'>;
  route: RouteProp<RootStackParamList, 'ProfileScreen'>;
};
