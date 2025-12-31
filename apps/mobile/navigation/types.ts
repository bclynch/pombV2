export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Profile: { username: string };
};

export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
};
