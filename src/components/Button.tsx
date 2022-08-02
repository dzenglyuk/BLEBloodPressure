import React, { FC } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ButtonProps = { title: string; onPress: () => void };

const Button: FC<ButtonProps> = (props) => {
  return (
    <TouchableOpacity style={styles.buttonContiner} onPress={props.onPress}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContiner: {
    height: 55,
    marginHorizontal: 25,
    backgroundColor: '#7735C2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Button;
