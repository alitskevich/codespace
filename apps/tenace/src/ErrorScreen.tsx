import React, { FC, ReactNode } from "react";
import { Text, View } from "react-native";

import { styles } from "./styles";

type Props = {
  message: string;
  children?: ReactNode | undefined;
};

export const ErrorScreen: FC<Props> = React.memo(({ message, children }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{message}</Text>
    {children}
  </View>
));
