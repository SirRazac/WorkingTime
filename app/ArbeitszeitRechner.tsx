import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";

const ArbeitszeitRechner = () => {
  const [startzeit, setStartzeit] = useState(null);
  const [pause, setPause] = useState(null);
  const [endzeit, setEndzeit] = useState(null);
  const [ergebnis, setErgebnis] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("startzeit");
  const [step, setStep] = useState(1);

  // Funktionen zur Berechnung
  const berechneArbeitszeit = () => {
    if (!startzeit || !endzeit || pause === null) return;
    const arbeitszeit = (endzeit - startzeit) / (1000 * 60 * 60); // Arbeitszeit in Stunden
    const pauseInStunden = pause / 60; // Pause in Stunden
    const arbeitszeitMitPause = arbeitszeit - pauseInStunden; // Effektive Arbeitszeit
    setErgebnis(`Effektive Arbeitszeit: ${arbeitszeitMitPause.toFixed(2)} Stunden`);
  };

  const berechneEndzeit = (zielArbeitszeit) => {
    if (!startzeit || pause === null) return;
    const pauseInMillis = pause * 60 * 1000; // Pause in Millisekunden
    const end = new Date(startzeit.getTime() + zielArbeitszeit * 60 * 60 * 1000 + pauseInMillis);
    setErgebnis(`Endzeit für ${zielArbeitszeit} Stunden: ${end.toTimeString().slice(0, 5)}`);
  };

  // Funktionen zur Zeitauswahl
  const openPicker = (mode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const handlePickerChange = (event, date) => {
    if (date) {
      if (pickerMode === "startzeit") {
        setStartzeit(date);
        setStep(2);
      } else if (pickerMode === "pause") {
        const minutes = date.getMinutes(); // Nur die Minuten verwenden
        setPause(minutes);
        setStep(3);
      } else if (pickerMode === "endzeit") {
        setEndzeit(date);
      }
    }
    setShowPicker(false);
  };

  // Zurücksetzen aller Eingaben
  const reset = () => {
    setStartzeit(null);
    setPause(null);
    setEndzeit(null);
    setErgebnis("");
    setStep(1);
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arbeitszeit Rechner</Text>

      {/* Ergebnis-Anzeige (oben) */}
      {ergebnis && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ergebnis</Text>
          <Text style={styles.result}>{ergebnis}</Text>
        </View>
      )}

      {/* Anzeige der aktuellen Eingaben */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Eingaben</Text>
        <View style={styles.inputRow}>
          <Icon name="access-time" size={20} color="#0288d1" />
          <Text style={styles.label}>Startzeit: {startzeit ? startzeit.toTimeString().slice(0, 5) : "Nicht gesetzt"}</Text>
        </View>
        <View style={styles.inputRow}>
          <Icon name="timer" size={20} color="#0288d1" />
          <Text style={styles.label}>Pause: {pause !== null ? `${pause} Minuten` : "Nicht gesetzt"}</Text>
        </View>
        <View style={styles.inputRow}>
          <Icon name="access-time" size={20} color="#0288d1" />
          <Text style={styles.label}>Endzeit: {endzeit ? endzeit.toTimeString().slice(0, 5) : "Nicht gesetzt"}</Text>
        </View>
      </View>

      {/* Schritt 1: Startzeit auswählen */}
      {step === 1 && (
        <TouchableOpacity style={styles.button} onPress={() => openPicker("startzeit")}>
          <Icon name="edit" size={20} color="#fff" />
          <Text style={styles.buttonText}>Startzeit auswählen</Text>
        </TouchableOpacity>
      )}

      {/* Schritt 2: Pause auswählen */}
      {step === 2 && (
        <TouchableOpacity style={styles.button} onPress={() => openPicker("pause")}>
          <Icon name="edit" size={20} color="#fff" />
          <Text style={styles.buttonText}>Pause in Minuten auswählen</Text>
        </TouchableOpacity>
      )}

      {/* Schritt 3: Endzeit auswählen oder Berechnungen durchführen */}
      {step === 3 && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => openPicker("endzeit")}>
            <Icon name="edit" size={20} color="#fff" />
            <Text style={styles.buttonText}>Endzeit auswählen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={berechneArbeitszeit}>
            <Icon name="calculate" size={20} color="#fff" />
            <Text style={styles.buttonText}>Arbeitszeit berechnen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => berechneEndzeit(8)}>
            <Icon name="schedule" size={20} color="#fff" />
            <Text style={styles.buttonText}>Endzeit für 8h</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => berechneEndzeit(9)}>
            <Icon name="schedule" size={20} color="#fff" />
            <Text style={styles.buttonText}>Endzeit für 9h</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Zurücksetzen-Button */}
      <TouchableOpacity style={styles.resetButton} onPress={reset}>
        <Icon name="refresh" size={20} color="#fff" />
        <Text style={styles.buttonText}>Zurücksetzen</Text>
      </TouchableOpacity>

      {/* DateTimePicker als Modal */}
      {showPicker && (
        <Modal transparent={true} animationType="slide" visible={showPicker}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={pickerMode === "pause" ? new Date(0, 0, 0, 0, pause || 0) : startzeit || new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={handlePickerChange}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Stile
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0277bd",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#0288d1",
    padding: 15,
    borderRadius: 10,
    margin: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  resetButton: {
    flexDirection: "row",
    backgroundColor: "#d32f2f",
    padding: 15,
    borderRadius: 10,
    margin: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  result: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796b",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
});

export default ArbeitszeitRechner;