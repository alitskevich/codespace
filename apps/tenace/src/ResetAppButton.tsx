import React from 'react';
import { Button } from 'react-native';
import RNRestart from 'react-native-restart';

export function ResetAppButton() {
  return (
    <Button
      onPress={() => {
        RNRestart.Restart();
      }}
      title="Retry"
      color="#F00"
    />
  );
}
