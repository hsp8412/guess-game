import {
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import {SafeAreaView as SafeAreaViewAndroid} from "react-native-safe-area-context";
import StartGameScreen from "./screens/StartGameScreen";
import GameScreen from "./screens/GameScreen";
import {LinearGradient} from "expo-linear-gradient";
import {useState, useEffect} from "react";
import Colors from "./constants/colors";
import GameOverScreen from "./screens/GameOverScreen";
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [userNumber, setUserNumber] = useState();
  const [gameIsOver, setGameIsOver] = useState(true);
  const [guessRounds, setGuessRounds] = useState(0);

  const [fontsLoaded] = useFonts({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    if (fontsLoaded) {
      (async function () {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.log("error:", error);
        }
      })();
    }
  }, [fontsLoaded]);

  const pickedNumberHandler = (pickedNumber) => {
    setUserNumber(pickedNumber);
    setGameIsOver(false);
  };

  const gameOverHandler = (numberOfRounds) => {
    setGameIsOver(true);
    setGuessRounds(numberOfRounds);
  };

  const startNewGameHandler = () => {
    setUserNumber(null);
    setGuessRounds(0);
  };

  const SafeAreaComponent =
    Platform.OS === "android" ? SafeAreaViewAndroid : SafeAreaView;

  let screen = <StartGameScreen onPickNumber={pickedNumberHandler} />;

  if (userNumber) {
    screen = (
      <GameScreen userNumber={userNumber} onGameOver={gameOverHandler} />
    );
  }

  if (gameIsOver && userNumber) {
    screen = (
      <GameOverScreen
        userNumber={userNumber}
        roundsNumber={guessRounds}
        onStartNewGame={startNewGameHandler}
      />
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.primary700, Colors.accent500]}
        style={styles.rootScreen}
      >
        <ImageBackground
          source={require("./assets/background.png")}
          resizeMode="cover"
          style={styles.rootScreen}
          imageStyle={styles.backgroundImage}
        >
          <SafeAreaComponent style={styles.rootScreen}>
            {screen}
          </SafeAreaComponent>
        </ImageBackground>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.15,
  },
});
