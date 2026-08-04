import BackToInformation from "../BackToInformation";
import PeopleDirectory from "./PeopleDirectory";

export default function PeoplePage() {
  return (
    <main className="people-page">
      <BackToInformation className="people-page__back-button" />
      <PeopleDirectory />
    </main>
  );
}
