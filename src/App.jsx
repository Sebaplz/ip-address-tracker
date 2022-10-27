import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "./App.css";
import Map from "./components/Map";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setipAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${
            import.meta.env.VITE_APP_API_KEY
          }`
        );
        const data = await res.json();
        setAddress(data);
      };
      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  const getDataWithIp = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${
        import.meta.env.VITE_APP_API_KEY
      }&${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getDataWithIp();
    setipAddress("");
  };

  const locationSVG = L.icon({
    iconUrl: "images/icon-location.svg",
  });

  return (
    <>
      <div className="absolute -z-10 w-full">
        <img
          src="images/pattern-bg.png"
          alt="Imagen de Fondo"
          className="w-full h-80 object-cover"
        />
      </div>
      {address && (
        <>
          <section className="space-y-10 lg:space-y-20">
            <div className="flex-col justify-center md:pt-5 lg:pt-10">
              <h1 className="text-white text-2xl md:text-3xl lg:text-4xl text-center py-5">
                IP Address Tracker
              </h1>
              <form
                autoComplete="off"
                className="flex justify-center max-w-xl mx-auto px-5"
                onSubmit={handleSubmit}
              >
                <input
                  className="h-12 rounded-l-xl px-3 py-3 bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  type="text"
                  name="ip-name"
                  id="ip-name"
                  required
                  placeholder="Search for any IP address or domain"
                  value={ipAddress}
                  onChange={(e) => setipAddress(e.target.value)}
                />
                <button className="bg-black h-12 w-12 rounded-r-xl">
                  <img
                    className="mx-auto"
                    src="images/icon-arrow.svg"
                    alt="Icono flecha"
                  />
                </button>
              </form>
            </div>
            <div
              className=" bg-white text-center rounded-lg shadow p-5 mx-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:mx-auto lg:max-w-4xl md:text-left relative"
              style={{ zIndex: 10000 }}
            >
              <div className="lg:border-r lg:border-slate-400 pb-2">
                <h2 className="text-slate-500 font-bold text-sm tracking-widest uppercase">
                  IP ADDRESS
                </h2>
                <p className="text-black text-xl font-bold">{address.ip}</p>
              </div>
              <div className="lg:border-r lg:border-slate-400 pb-2">
                <h2 className="text-slate-500 font-bold text-sm tracking-widest uppercase">
                  Location
                </h2>
                <p className="text-black text-xl font-bold">
                  {address.location.city}, {address.location.country}
                </p>
              </div>
              <div className="lg:border-r lg:border-slate-400 pb-2">
                <h2 className="text-slate-500 font-bold text-sm tracking-widest uppercase">
                  TIMEZONE
                </h2>
                <p className="text-black text-xl font-bold">
                  {address.location.timezone}
                </p>
              </div>
              <div>
                <h2 className="text-slate-500 font-bold text-sm tracking-widest uppercase">
                  ISP
                </h2>
                <p className="text-black text-xl font-bold">{address.isp}</p>
              </div>
            </div>
          </section>
          <section className="-mt-52 md:-mt-20 lg:-mt-16">
            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={16}
              scrollWheelZoom={false}
              style={{ height: "645px", width: "100vw" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[address.location.lat, address.location.lng]}
                icon={locationSVG}
              ></Marker>
              <Map address={address} />
            </MapContainer>
          </section>
        </>
      )}
    </>
  );
}

export default App;
