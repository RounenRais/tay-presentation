import Deck from "@/components/Deck";
import Gameplay from "@/components/Gameplay";
import NasaData from "@/components/NasaData";
import { Closing, Hero, Team } from "@/components/Static";
import Story from "@/components/Story";
import Survival from "@/components/Survival";

export default function Home() {
  return (
    <main>
      <Deck labels={["Intro", "Team", "Story", "Gameplay", "Survival", "NASA data", "Thanks"]}>
        <Hero />
        <Team />
        <Story />
        <Gameplay />
        <Survival />
        <NasaData />
        <Closing />
      </Deck>
    </main>
  );
}
