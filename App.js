import 'react-native-reanimated';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';

import DraggableFlatList from 'react-native-draggable-flatlist';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const MISS_LIST = [
  "Miss Alsace",
  "Miss Aquitaine",
  "Miss Auvergne",
  "Miss Bourgogne",
  "Miss Bretagne",
  "Miss Centre",
  "Miss Champagne",
  "Miss Corse",
  "Miss Franche-Comté",
  "Miss Guadeloupe",
  "Miss Guyane",
  "Miss Île-de-France",
  "Miss Languedoc",
  "Miss Limousin",
  "Miss Lorraine",
  "Miss Martinique",
  "Miss Mayotte",
  "Miss Midi-Pyrénées",
  "Miss Nord-Pas-de-Calais",
  "Miss Normandie",
  "Miss Nouvelle-Calédonie",
  "Miss Pays de la Loire",
  "Miss Picardie",
  "Miss Poitou-Charentes",
  "Miss Polynésie",
  "Miss Provence",
  "Miss Réunion",
  "Miss Rhône-Alpes",
  "Miss Tahiti",
  "Miss Toulouse"
];

const Stack = createStackNavigator();

// --------------------------------------
// PAGE 1 — IDENTITÉ
// --------------------------------------
function IdentityScreen({ navigation, route }) {
  const [name, setName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Concours Miss France</Text>
      <Text style={styles.subtitle}>✨ Entre ton prénom pour commencer</Text>

      <TextInput
        placeholder="Ton prénom"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={[styles.button, { opacity: name.length > 0 ? 1 : 0.4 }]}
        disabled={name.length === 0}
        onPress={() =>
          navigation.navigate("Top5", {
            playerName: name,
            missList: MISS_LIST,
          })
        }
      >
        <Text style={styles.buttonText}>Commencer ➜</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --------------------------------------
// PAGE 2 — TOP 5 MISS FRANCE (Drag & Drop)
// --------------------------------------
function Top5Screen({ navigation, route }) {
  const { playerName, missList } = route.params;

  const [top5, setTop5] = useState(
    missList.slice(0, 5).map((m, index) => ({ key: index.toString(), name: m }))
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Top 5 Miss France</Text>
      <Text style={styles.subtitle}>✨ Glisse les Miss dans ton ordre de pronostic</Text>

      <DraggableFlatList
        data={top5}
        keyExtractor={(item) => item.key}
        onDragEnd={({ data }) => setTop5(data)}
        renderItem={({ item, drag, isActive }) => (
          <TouchableOpacity
            style={[styles.card, isActive && { backgroundColor: "#ffebf5" }]}
            onLongPress={drag}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Top10", {
            playerName,
            top5: top5.map((x) => x.name),
            missList,
          })
        }
      >
        <Text style={styles.buttonText}>Étape suivante ➜</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --------------------------------------
// PAGE 3 — TOP 10 MISS FRANCINE
// --------------------------------------
function Top10Screen({ navigation, route }) {
  const { playerName, top5, missList } = route.params;

  const available = missList.filter((m) => !top5.includes(m));

  const [top10, setTop10] = useState(
    available.slice(0, 10).map((m, index) => ({ key: index.toString(), name: m }))
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Top 10 Miss Francine</Text>
      <Text style={styles.subtitle}>✨ Glisse les Miss que tu penses éliminées</Text>

      <DraggableFlatList
        data={top10}
        keyExtractor={(item) => item.key}
        onDragEnd={({ data }) => setTop10(data)}
        renderItem={({ item, drag, isActive }) => (
          <TouchableOpacity
            style={[styles.card, isActive && { backgroundColor: "#ffebf5" }]}
            onLongPress={drag}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Concours", {
            playerName,
            top5,
            top10: top10.map((x) => x.name),
            missList,
          })
        }
      >
        <Text style={styles.buttonText}>Démarrer le concours ➜</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --------------------------------------
// PAGE 4 — CONCOURS (Sélection des Miss réelles)
// --------------------------------------
function ConcoursScreen({ navigation, route }) {
  const { playerName, top5, top10, missList } = route.params;

  const [passed, setPassed] = useState([]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Concours réel</Text>
      <Text style={styles.subtitle}>Sélectionne les Miss qui passent les tours</Text>

      <FlatList
        data={missList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              passed.includes(item) && { backgroundColor: "#ffc9de" },
            ]}
            onPress={() =>
              setPassed((prev) =>
                prev.includes(item)
                  ? prev.filter((x) => x !== item)
                  : [...prev, item]
              )
            }
          >
            <Text style={styles.cardText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Score", {
            playerName,
            top5,
            top10,
            passed,
          })
        }
      >
        <Text style={styles.buttonText}>Voir le score ➜</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --------------------------------------
// PAGE 5 — SCORE FINAL
// --------------------------------------
function ScoreScreen({ route }) {
  const { playerName, top5, top10, passed } = route.params;

  let score = 0;
  // (Tu peux intégrer ton calcul ici)

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Résultats</Text>
      <Text style={styles.subtitle}>Bravo {playerName} 🎉</Text>

      <Text style={styles.finalScore}>Score : {score} pts</Text>
    </SafeAreaView>
  );
}

// --------------------------------------
// NAVIGATION PRINCIPALE
// --------------------------------------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Identity" component={IdentityScreen} />
        <Stack.Screen name="Top5" component={Top5Screen} />
        <Stack.Screen name="Top10" component={Top10Screen} />
        <Stack.Screen name="Concours" component={ConcoursScreen} />
        <Stack.Screen name="Score" component={ScoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --------------------------------------
// STYLES ROSE & OR GLAMOUR
// --------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe9f2",
    padding: 20,
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "700",
    color: "#c71585",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    color: "#a94473",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginVertical: 20,
    fontSize: 18,
    borderColor: "#c71585",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#c71585",
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderColor: "#f5b3d1",
    borderWidth: 1,
  },
  cardText: {
    fontSize: 18,
    color: "#c71585",
    fontWeight: "500",
  },
  finalScore: {
    fontSize: 40,
    textAlign: "center",
    marginTop: 40,
    fontWeight: "800",
    color: "#c71585",
  },
});