// src/pages/Home.tsx

import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../auth/auth";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebaseDatabase"; // <- usamos diretamente aqui

export default function Home() {
  const navigate = useNavigate();

  const logout = () => {
    fakeAuth.logout();
    navigate("/login");
  };

  const [data, setData] = useState<
    { time: string; temp1: number | string; temp2: number | string; temp3: number | string }[]
  >([]);

  useEffect(() => {
    const refSensor1 = ref(database, "sensorData/sensor1");
    const refSensor2 = ref(database, "sensorData/sensor2");
    const refSensor3 = ref(database, "sensorData/sensor3");

    const dataHolder = { sensor1: {}, sensor2: {}, sensor3: {} };

    const convertTimestampToTime = (timestamp: string | number) => {
      const date = new Date(Number(timestamp) * 1000); // multiplica por 1000 porque JS usa milissegundos
      return date.toLocaleString("pt-BR"); // ou en-US, etc.
    };

    const combineAndSetData = () => {
      const allTimes = new Set([
        ...Object.keys(dataHolder.sensor1),
        ...Object.keys(dataHolder.sensor2),
        ...Object.keys(dataHolder.sensor3),
      ]);

      const combined = Array.from(allTimes).map((time) => ({
        time: convertTimestampToTime(time),
        temp1: dataHolder.sensor1[time]?.temperature ?? "-",
        temp2: dataHolder.sensor2[time]?.temperature ?? "-",
        temp3: dataHolder.sensor3[time]?.temperature ?? "-",
      }));

      combined.sort((a, b) => (a.time < b.time ? 1 : -1));
      setData(combined);
    };

    onValue(refSensor1, (snapshot) => {
      dataHolder.sensor1 = snapshot.val() || {};
      combineAndSetData();
    });

    onValue(refSensor2, (snapshot) => {
      dataHolder.sensor2 = snapshot.val() || {};
      combineAndSetData();
    });

    onValue(refSensor3, (snapshot) => {
      dataHolder.sensor3 = snapshot.val() || {};
      combineAndSetData();
    });
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.headerTitle}>Dashboard</h2>
        <button style={styles.logoutButton} onClick={logout}>
          Sair
        </button>
      </header>

      <div style={styles.contentBox}>
        <h1 style={styles.title}>Leituras do Sensor</h1>
        <div style={styles.scrollBox}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Temperatura Sensor 1</th>
                <th>Temperatura Sensor 2</th>
                <th>Temperatura Sensor 3</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.time}</td>
                  <td>{entry.temp1} °C</td>
                  <td>{entry.temp2} °C</td>
                  <td>{entry.temp3} °C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    background: "#eef2f5",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.5rem",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  contentBox: {
    flex: 1,
    padding: "2rem",
    overflow: "hidden",
  },
  title: {
    textAlign: "center" as const,
    fontSize: "1.75rem",
    marginBottom: "1rem",
  },
  scrollBox: {
    height: "70vh",
    overflowY: "auto" as const,
    background: "white",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
};
