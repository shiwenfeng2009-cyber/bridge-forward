import BackToInformation from "../BackToInformation";

export default function CampusMapPage() {
  return (
    <main className="campus-map-page">
      <h1 className="sr-only">Moanalua High School 校园地图</h1>
      <div className="campus-map-page__frame">
        <div className="campus-map-page__image-link">
          <img
            alt="Moanalua High School 双语校园地图"
            height="1024"
            src="/images/moanalua-campus-map.png"
            width="1536"
          />
        </div>
        <span aria-hidden="true" className="campus-map-page__old-header-mask" />
        <span aria-hidden="true" className="campus-map-page__old-back-mask" />
        <BackToInformation className="campus-map-page__back-button" />
      </div>
    </main>
  );
}
