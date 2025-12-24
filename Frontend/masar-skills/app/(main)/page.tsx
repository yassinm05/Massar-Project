import Empowering from "@/components/home/Empowering";
import LearningJourney from "@/components/home/LearningJourney";
import Potential from "@/components/home/Potential";
import Discover from "@/components/home/Discover";
import Quote from "@/components/home/Quote";
import Future from "@/components/home/Future";
import StayUpdated from "@/components/home/StayUpdated";

export default function Home() {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <LearningJourney />
      <Empowering />
      <Potential />
      <Discover />
      <Quote />
      <Future />
      <StayUpdated />
    </div>
  );
}
