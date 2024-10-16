import React from "react";
import iconSex from "../../assets/images/icons/sexo.png";

const CardPetShelter = ({ image, key = 0, goToEdit = () => {} }) => {
  return (
    <div key={key} className="pb-5">
      <div className="card ms-3 card-pet" style={{width:'12rem',height:'16rem'}}>
        <i className="bi bi-pencil-square fs-3 text-danger pets-wishList pointer" onClick={() => goToEdit(image.id, "m")}></i>
        <img src={image.fotos[0]} className="card-img-top pet-img pointer" alt={`image-${image.id}`} />
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title">{image.nombre}</h5>
            <img src={iconSex} style={{ width: "30px" }} alt="Sexo" />
          </div>
          <div className="d-flex justify-content-start align-items-center">
            <i className="bi bi-geo-alt fs-3" style={{ color: "#99DBD6" }}></i>
            <p className="card-text ms-2">{image.ciudad}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPetShelter;