import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const ArbeitszeitRechner = () => {
  const [startzeit, setStartzeit] = useState(new Date());
  const [endzeit, setEndzeit] = useState(new Date());
  const [pause, setPause] = useState(new Date(0, 0, 0, 0, 30));
  const [ergebnis, setErgebnis] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showPausePicker, setShowPausePicker] = useState(false);

  const berechneArbeitszeit = () => {
    const arbeitszeit = (endzeit - startzeit) / (1000 * 60 * 60);
    const pauseInStunden = (pause.getHours() * 60 + pause.getMinutes()) / 60;
    const arbeitszeitMitPause = arbeitszeit - pauseInStunden;
    setErgebnis(`Effektive Arbeitszeit: ${arbeitszeitMitPause.toFixed(2)} Stunden`);
  };

  const berechneEndzeit = (zielArbeitszeit) => {
    const pauseInMillis = (pause.getHours() * 60 + pause.getMinutes()) * 60 * 1000;
    const end = new Date(startzeit.getTime() + zielArbeitszeit * 60 * 60 * 1000 + pauseInMillis);
    setErgebnis(`Endzeit für ${zielArbeitszeit} Stunden: ${end.toTimeString().slice(0, 5)}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arbeitszeit Rechner</Text>

      <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker(true)}>
        <Text>Startzeit: {startzeit.toTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startzeit}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartzeit(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker(true)}>
        <Text>Endzeit: {endzeit.toTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endzeit}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndzeit(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowPausePicker(true)}>
        <Text>Pausenzeit: {pause.toTimeString().slice(3, 5)} Minuten</Text>
      </TouchableOpacity>
      {showPausePicker && (
        <DateTimePicker
          value={pause}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(event, date) => {
            setShowPausePicker(false);
            if (date) setPause(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={berechneArbeitszeit}>
        <Text style={styles.buttonText}>Arbeitszeit berechnen</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => berechneEndzeit(8)}>
        <Text style={styles.buttonText}>Endzeit für 8h</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => berechneEndzeit(9)}>
        <Text style={styles.buttonText}>Endzeit für 9h</Text>
      </TouchableOpacity>

      {ergebnis ? <Text style={styles.result}>{ergebnis}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ddd",
    marginBottom: 10,
    textAlign: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    margin: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ArbeitszeitRechner;
