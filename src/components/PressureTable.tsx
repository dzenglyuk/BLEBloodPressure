import React from 'react';
import type { FC } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import type { Pressure } from '../redux/modules/bluetooth/reducer';

interface IProps {
  pressure: Pressure[];
}

export const PressureTable: FC<IProps> = ({ pressure }) => {
  return pressure.length > 0 ? (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.pressureTitle]}>DATE</Text>
        <Text style={[styles.cell, styles.pressureTitle]}>TIME</Text>
        <Text style={[styles.cell, styles.pressureTitle]}>SYS</Text>
        <Text style={[styles.cell, styles.pressureTitle]}>DIA</Text>
        <Text style={[styles.cell, styles.pressureTitle]}>PULSE</Text>
      </View>
      {pressure.map(({ sys, dia, pulse, date, time }) => (
        <View style={styles.row} key={`${date}${time}`}>
          <Text style={[styles.cell, styles.pressureText]}>{date}</Text>
          <Text style={[styles.cell, styles.pressureText]}>{time}</Text>
          <Text style={[styles.cell, styles.pressureText]}>{sys}</Text>
          <Text style={[styles.cell, styles.pressureText]}>{dia}</Text>
          <Text style={[styles.cell, styles.pressureText]}>{pulse}</Text>
        </View>
      ))}
    </View>
  ) : (
    <Text style={styles.pressureTitle}>No data</Text>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 1,
  },
  pressureTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  pressureText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
