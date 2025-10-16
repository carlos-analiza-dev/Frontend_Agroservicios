interface MapIframeProps {
  lat: number;
  lng: number;
  className?: string;
}

export default function MapIframe({
  lat,
  lng,
  className = "",
}: MapIframeProps) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&marker=${lat}%2C${lng}`;

  return (
    <iframe
      width="100%"
      height="100%"
      frameBorder="0"
      scrolling="no"
      marginHeight={0}
      marginWidth={0}
      src={mapUrl}
      className={className}
      style={{ border: 0 }}
      allowFullScreen
    />
  );
}
