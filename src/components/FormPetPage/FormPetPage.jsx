import React, { useState, useEffect } from "react";
import { Col, Form, Button, Row, Alert } from "react-bootstrap";
import MySlider from "../MySlider";
import { Formik } from "formik";
import Select from "../elements/Select";
import Input from "../elements/Input";
import Check from "../elements/Check";
import { inputs, selects, inputs2, checks } from "../../data/FormPetPage";
import moment from "moment-timezone";
import { useParams, useNavigate } from "react-router-dom";
import { GetGeneral, PostGeneral, PutGeneral } from "../../api/setupAxios";
import UploadFile from "../elements/UploadFile";
import FormModalPet from "../FormModalPet";
import Modal from "../Modal";
import FormDeletePet from "../FormDeletePet";
import { useSelector } from "react-redux";

//QUEDA PREGUNTAR PARA REALIZAR EL TEMA FOTOS.

const FormPetPage = () => {
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const [modalShow, setmodalShow] = useState({ show: false, accion: "s" });
  const [datosPet, setdatosPet] = useState({ id: 0, nombre: "" });
  const closeModal = () => setmodalShow(false);
  const openModal = (accion) => manejo_acciones(accion);
  const [checked, setchecked] = useState({ 0: false, 1: false });
  const [images, setImages] = useState([]);
  const [errorsMessages, setErrorsMessages] = useState([]);
  const [alert, setAlert] = useState("<div></div>");
  const [petData, setpetData] = useState({
    id: 0,
    nombre: "",
    tipoAnimal: "",
    raza: "",
    descripcion: "",
    sexo: "",
    tamano: "",
    temperamentoConAnimales: "",
    temperamentoConPersonas: "",
    edad: 0,
    estado: "",
    ciudad: "",
    mesAnioNacimiento: "",
    protectoraId: 0,
    fotos: [],
  });
  let action = localStorage.getItem("action");
  const [combos, setCombos] = useState({
    raza: [{ label: "Raza*", value: "raza" }],
    tipoAnimal: [
      { label: "Perro", value: "Perro" },
      { label: "Gato", value: "Gato" },
      { label: "Hamster", value: "Hamster" },
      { label: "Conejo", value: "Conejo" },
    ],
    tamano: [
      { label: "Pequeño", value: "Pequeño" },
      { label: "Mediano", value: "Mediano" },
      { label: "Grande", value: "Grande" },
    ],
    temperamentoConAnimales: [
      { label: "Buenito", value: "Buenito" },
      { label: "Maldito", value: "Maldito" },
    ],
    temperamentoConPersonas: [
      { label: "Buenito", value: "Buenito" },
      { label: "Maldito", value: "Maldito" },
    ],
    protectoraId: [
      { label: "Protectora 1", value: 1 },
      { label: "Protectora 2", value: 2 },
    ],
  });
  const valueManagement = (values) => {
    const errors = {};
    let hoy = moment();
    if (!values.nombre) errors.nombre = "Campo requerido";
    else if (!values.raza) errors.raza = "Campo requerido";
    else if (!values.tamano) errors.tamano = "Campo requerido";
    else if (!values.temperamentoConAnimales) errors.temperamentoConAnimales = "Campo requerido";
    else if (!values.temperamentoConPersonas) errors.temperamentoConPersonas = "Campo requerido";
    else if (!values.protectoraId) errors.protectoraId = "Campo requerido";
    else if (!values.ciudad) errors.ciudad = "Campo requerido";
    else if (!values.mesAnioNacimiento) errors.mesAnioNacimiento = "Campo requerido";
    else if (!moment(values.mesAnioNacimiento, "DD/MM/YYYY", true).isValid) errors.mesAnioNacimiento = "Ingrese una fecha valida";
    else if (moment(values.mesAnioNacimiento).isAfter(hoy)) errors.mesAnioNacimiento = "Ingrese una fecha anterior al día de hoy";
    else if (!values.sexo) errors.sexo = "Campo requerido";
    return errors;
  };
  const submitForm = async (values, setSubmitting) => {
    let fecha = values.mesAnioNacimiento;
    const obj = { mesAnioNacimiento: fecha };
    let valuesMassage = ["raza", "tipoAnimal", "tamano", "temperamentoConAnimales", "temperamentoConPersonas", "protectoraId"];
    try {
      setSubmitting(true);
      values.edad = moment().diff(moment(values.mesAnioNacimiento), "years");
      for (const key in values) {
        if (valuesMassage.includes(key)) {
          obj[key] = values[key];
          values[key] = values[key].value;
        }
        if (key === "mesAnioNacimiento") values[key] = moment.tz(values[key], "America/Argentina/Buenos_Aires").format("YYYY-MM");
        if (key === "fotos") values[key] = images;
      }
      let response = await PostGeneral("Mascotas/registro", values);
      setdatosPet(response);
      setSubmitting(false);
      openModal("c");
    } catch (error) {
      for (const key in obj) {
        if (valuesMassage.includes(key)) values[key] = obj[key];
        if (key === "mesAnioNacimiento") values[key] = fecha;
      }
      let errors = error.response.data;
      if (Array.isArray(errors)) setErrorsMessages(errors);
      else if (!errors) setErrorsMessages(["Hubo un error al ingresar su animal, intente mas tarde."]);
      else if (!Array.isArray(errors.errors)) setErrorsMessages(Object.values(errors.errors).map((error) => error[0]));
      setSubmitting(false);
    }
  };
  const changePet = async (values) => {
    let fecha = values.mesAnioNacimiento;
    let obj = { mesAnioNacimiento: fecha };
    let valuesMassage = ["raza", "tipoAnimal", "tamano", "temperamentoConAnimales", "temperamentoConPersonas", "protectoraId"];
    try {
      values.edad = moment().diff(moment(values.mesAnioNacimiento), "years");
      for (const key in values) {
        if (valuesMassage.includes(key)) {
          obj[key] = values[key];
          values[key] = values[key].value;
        }
        if (key === "mesAnioNacimiento") values[key] = moment.tz(values[key], "America/Argentina/Buenos_Aires").format("YYYY-MM");
        if (key === "fotos") values[key] = images;
      }
      let response = await PutGeneral(`mascotas/${id}`, values);
      setdatosPet(response);
      openModal("s");
    } catch (error) {
      for (const key in obj) {
        if (valuesMassage.includes(key)) values[key] = obj[key];
        if (key === "mesAnioNacimiento") values[key] = fecha;
      }
      let errors = error?.response?.data;
      if (Array.isArray(errors)) setErrorsMessages(errors);
      else if (!errors) setErrorsMessages(["Hubo un error al ingresar su animal, intente mas tarde."]);
      else if (!Array.isArray(errors.errors)) setErrorsMessages(Object.values(errors.errors).map((error) => error[0]));
    }
  };
  const returnButtons = (action, isSubmitting, values) => {
    switch (action) {
      case "m":
        return (
          <div>
            <Button className="background-button-muma w-100" onClick={() => changePet(values)} disabled={isSubmitting}>
              Guardar Cambios
            </Button>
            <Button variant="outline-danger" className="w-100 mt-2 mb-2" onClick={() => openModal("b")} disabled={isSubmitting}>
              Dar de baja
            </Button>
          </div>
        );
      default:
        return (
          <Button className="background-button-muma w-100 mb-2" type="submit" disabled={isSubmitting}>
            Cargar animal
          </Button>
        );
    }
  };
  const deleteImage = (key) => {
    let deleteImg = images.filter((value, k) => k !== key);
    setImages(deleteImg);
  };
  const onDeleteModal = async (id) => {
    try {
      let response = await PostGeneral(`mascotas/${id}/baja`, { motivo: "porque pinto", idMascotero: user?.tipoRegistro.id });
    } catch (error) {
      let errors = error?.response?.data;
      if (Array.isArray(errors)) setErrorsMessages(errors);
      else if (!errors) setErrorsMessages(["Hubo un error al eliminar su animal, intente mas tarde."]);
      else if (!Array.isArray(errors.errors)) setErrorsMessages(Object.values(errors.errors).map((error) => error[0]));
    }
  };
  const manejo_acciones = (accion) => {
    switch (accion) {
      case "b": {
        setmodalShow({ show: true, accion });
        break;
      }
      case "s": {
        setmodalShow({ show: true, accion });
        break;
      }
      case "c": {
        setmodalShow({ show: true, accion });
        break;
      }
      default:
        break;
    }
  };
  useEffect(() => {
    //Se manejara el llenado byid para la modificacion.
    GetGeneral("Protectoras", {}).then((protectoras) => {
      let combosProtectoras = protectoras.map((protectora) => ({ label: protectora.nombreProtectora, value: protectora.id }));
      setCombos({
        ...combos,
        protectoraId: combosProtectoras,
      });
    });
    if (id) {
      GetGeneral(`mascotas/${id}`).then((value) => {
        setpetData({
          nombre: value.nombre,
          raza: combos.raza.find((val) => val.value === value.raza),
          tipoAnimal: combos.tipoAnimal.find((val) => val.value === value.tipoAnimal),
          tamano: combos.tamano.find((val) => val.value === value.tamano),
          temperamentoConAnimales: combos.temperamentoConAnimales.find((val) => val.value === value.temperamentoConAnimales),
          temperamentoConPersonas: combos.temperamentoConPersonas.find((val) => val.value === value.temperamentoConPersonas),
          protectoraId: { label: value.protectora.nombre, value: value.protectora.id },
          ciudad: value.ciudad,
          mesAnioNacimiento: "",
          descripcion: value.descripcion,
          sexo: value.sexo,
          fotos: value.fotos,
        });
        setImages(value.fotos);
      });
    }
    /* return () => localStorage.removeItem("action"); */
  }, [id]);
  return (
    <div>
      <Modal show={modalShow.show} onHide={closeModal}>
        {modalShow.accion === "b" ? <FormDeletePet id={id} title="Dar de baja" onClose={closeModal} description={`¿Estás seguro de que querés dar de baja a ${petData.nombre}?`} onDelete={onDeleteModal} /> : <FormModalPet accion={modalShow.accion} datosPet={datosPet} />}
      </Modal>
      <Formik enableReinitialize={true} initialValues={petData} validate={(values) => valueManagement(values)} onSubmit={(values, { setSubmitting }) => submitForm(values, setSubmitting)}>
        {({ handleSubmit, isSubmitting, errors, touched, setFieldValue, values }) => {
          const setCheckedLocal = (setFieldValue, key, value) => {
            setFieldValue("sexo", value);
            setchecked({ ...checked, [key]: !checked[key] });
          };
          return (
            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
              {inputs.map((input, key) => (
                <Col xs={12} key={key}>
                  <Input type={input.type} name={input.name} placeholder={input.placeholder} />
                </Col>
              ))}
              {selects.map((select, key) => (
                <Col xs={12} key={key}>
                  <Select name={select.name} type={select.type} placeholder={select.placeholder} options={combos[select.name]} noOption={select.noOption} />
                </Col>
              ))}
              {inputs2.map((input, key) => (
                <Col xs={12} key={key}>
                  <Input type={input.type} name={input.name} placeholder={input.placeholder} />
                </Col>
              ))}
              <Row className="mt-2 mb-2">
                {checks.map((check, key) => (
                  <Col key={key} md={6} className="d-flex justify-content-center">
                    <Check onChange={(e) => setCheckedLocal(setFieldValue, key, e.target.value)} id={check.id} label={check.label} value={check.value} checked={checked[key]} type={check.type} name={check.name} />
                  </Col>
                ))}
                <p className="text-danger m-0 p-0 fs-12 ms-2">{errors.sexo && touched.sexo && errors.sexo}</p>
              </Row>
              <Row>
                <UploadFile images={images} setImages={setImages} setError={setAlert} />
                <p className="text-danger m-0 p-0 fs-12 ms-2">{errors.fotos && touched.fotos && errors.fotos}</p>
                <Row className="d-flex">
                  {images?.length ? (
                    <MySlider>
                      {images.map((image, key) => (
                        <div className="position-relative w-auto ms-1 me-1" key={key}>
                          <i className="p-1 bg-light rounded text-danger bi bi-trash3 top-0 end-0 pointer position-absolute mt-1 me-1" onClick={() => deleteImage(key)}></i>
                          <div className="h-200">
                            <img className="max-h-200px object-fit-contain" src={image} alt={`image-${key}`} />
                          </div>
                        </div>
                      ))}
                    </MySlider>
                  ) : null}
                </Row>
              </Row>
              {errorsMessages?.map((error, key) => (
                <Alert variant="danger" key={key}>
                  {error}
                </Alert>
              ))}
              <div dangerouslySetInnerHTML={{ __html: alert }}></div>
              {returnButtons(action, isSubmitting, values)}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormPetPage;
