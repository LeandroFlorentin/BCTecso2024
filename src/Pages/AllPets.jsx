import React, { useState, useEffect } from "react";
import "../assets/styles/allPets.css";
import Header from "../components/Header/Header";
import Filters from "../components/Filters/Filters";
import { useSelector } from "react-redux";
import { getPets } from "../api/setupAxios";
import CardAllPet from "../components/Cards/CardAllPet";

const AllPets = () => {
  const [petsImages, setPetsImages] = useState([]);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const loadPetsFromAPI = async () => {
      try {
        if (token) {
          const petsData = await getPets(token);
          console.log("Pets from API:", petsData);
          setPetsImages(petsData);
        }
      } catch (error) {
        console.error("Error al cargar las mascotas desde el backend:", error);
      }
    };
    loadPetsFromAPI();
  }, [token]);

  return (
    <div>
      <Header />
      <main className="vh-100">
        <Filters />
        <section>
          {petsImages.length === 0 ? (
            <div className="d-flex align-items-center justify-content-center" style={{ height: "75vh" }}>
              <p>No hay animales registrados actualmente</p>
            </div>
          ) : (
            <div>
              <div className="d-flex justify-content-between ms-4 me-4 ">
                <p>Animales</p>
              </div>
              <section className="d-flex flex-wrap justify-content-center">
                {petsImages.map((image, index) => (
                  <CardAllPet index={index} image={image} key={index} />
                ))}
              </section>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AllPets;
