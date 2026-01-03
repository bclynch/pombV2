export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Profile: { username: string };
  Trip: { username: string; tripSlug: string };
};

export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
};
