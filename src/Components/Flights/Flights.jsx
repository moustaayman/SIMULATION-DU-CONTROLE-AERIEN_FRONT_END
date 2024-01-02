import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";

const Flights = () => {
  let emptyFlight = {
    heurDepart: null,
    nameAeroportDepart: null,
    nameAeroportArrive: null,
    typeAvion: null,
  };

  const [flights, setFlights] = useState([]);
  const [airportOptions, setAirportOptions] = useState([]);
  const [airplaneTypeOptions, setAirplaneTypeOptions] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [flightDialog, setFlightDialog] = useState(false);
  const [deleteFlightDialog, setDeleteFlightDialog] = useState(false);
  const [deleteFlightsDialog, setDeleteFlightsDialog] = useState(false);
  const [flight, setFlight] = useState(emptyFlight);
  const [selectedFlights, setSelectedFlights] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/vols/getAllVol"
        );
        // console.log(response.data);
        const updatedFlights = response.data.map((flight) => ({
          ...flight,
          nameAeroportDepart: flight.aeroportDepart.name,
          nameAeroportArrive: flight.aeroportArrive.name,
        }));

        setFlights(updatedFlights);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchAirplanes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/avions/getAllAvion"
        );
        const airportsName = response.data.map((airport) => airport.name);
        setAirplanes(airportsName);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };
    const fetchAirports = async () => {
      try {
        const response = await axios.get("http://localhost:8080/aeroports");
        const airportsName = response.data.map((airport) => airport.name);
        setAirportOptions(airportsName);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };
    const fetchAirplaneTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/typeavions/getAllTypeAvion"
        );
        const airplaneTypes = response.data.map((type) => type.name);
        setAirplaneTypeOptions(airplaneTypes);
      } catch (error) {
        console.error("Error fetching airplane types:", error);
      }
    };
    fetchFlights();
    fetchAirplanes();
    fetchAirports();
    fetchAirplaneTypes();
  }, []);
  const openNew = () => {
    setFlight(emptyFlight);
    setSubmitted(false);
    setFlightDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setFlightDialog(false);
  };

  const hideDeleteFlightDialog = () => {
    setDeleteFlightDialog(false);
  };

  const hideDeleteFlightsDialog = () => {
    setDeleteFlightsDialog(false);
  };

  const saveFlight = async () => {
    setSubmitted(true);
    try {
      if (
        flight.heurDepart &&
        flight.nameAeroportDepart &&
        flight.nameAeroportArrive &&
        flight.typeAvion
      ) {
        const airplanesResponse = await axios.get(
          "http://localhost:8080/avions/getAllAvion"
        );
        const airplanesData = airplanesResponse.data;

        const selectedAirplane = airplanesData.find(
          (airplane) => airplane.typeAvionDto.name === flight.typeAvion
        );

        if (!selectedAirplane) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: `Airplane data not found for type: ${flight.typeAvion}`,
            life: 3000,
          });
          return;
        }
        const volRequestData = {
          heurDepart: flight.heurDepart,
          nameAeroportDepart: flight.nameAeroportDepart,
          nameAeroportArrive: flight.nameAeroportArrive,
          numeroSerieAvion: selectedAirplane.numeroSerie,
        };

        let response;
        if (flight.id) {
          response = await axios.put(
            `http://localhost:8080/vols/${flight.id}`,
            volRequestData
          );
        } else {
          response = await axios.post(
            "http://localhost:8080/vols",
            volRequestData
          );
        }

        const updatedFlight = response.data;

        setFlights((prevFlights) => {
          const updatedFlights = prevFlights.map((f) =>
            f.id === updatedFlight.id ? updatedFlight : f
          );
          if (!flight.id) {
            updatedFlights.push(updatedFlight);
          }
          return updatedFlights;
        });

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Flight Created/Updated",
          life: 3000,
        });

        setFlightDialog(false);
        setFlight(emptyFlight);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please fill in all required fields",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error saving flight:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save flight",
        life: 3000,
      });
    }
  };

  const confirmDeleteFlight = (flight) => {
    setFlight(flight);
    setDeleteFlightDialog(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteFlight(rowData)}
        />
      </React.Fragment>
    );
  };

  const deleteFlight = async () => {
    try {
      await axios.delete(`http://localhost:8080/vols/${flight.id}`);

      setFlights((prevFlights) =>
        prevFlights.filter((val) => val.id !== flight.id)
      );

      setDeleteFlightDialog(false);
      setFlight(emptyFlight);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Flight Deleted",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting flight:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete flight",
        life: 3000,
      });
    }

    setDeleteFlightDialog(false);
    setFlight(emptyFlight);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteFlightsDialog(true);
  };

  const deleteSelectedFlights = async () => {
    console.log(selectedFlights);
    try {
      const deleteRequests = selectedFlights.map(async (selectedFlight) => {
        await axios.delete(`http://localhost:8080/vols/${selectedFlight.id}`);
      });

      await Promise.all(deleteRequests);

      setFlights((prevFlights) =>
        prevFlights.filter((val) => !selectedFlights.includes(val))
      );

      setDeleteFlightsDialog(false);
      setSelectedFlights(null);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Flights Deleted",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting flights:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete flights",
        life: 3000,
      });
    }
  };

  const onFlightInputChange = (e, name) => {
    const updatedFlight = { ...flight, [name]: e.target.value };
    setFlight(updatedFlight);
  };
  const onFlightDropdownChange = (selectedOption, name) => {
    const updatedFlight = { ...flight, [name]: selectedOption.value };
    setFlight(updatedFlight);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedFlights || !selectedFlights.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Flights</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const flightDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveFlight} />
    </React.Fragment>
  );
  const deleteFlightDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteFlightDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteFlight}
      />
    </React.Fragment>
  );
  const deleteFlightsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteFlightsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedFlights}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={flights}
          selection={selectedFlights}
          onSelectionChange={(e) => setSelectedFlights(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} flights"
          globalFilter={globalFilter}
          header={header}
        >
          <Column selectionMode="multiple" exportable={false}></Column>

          <Column
            field="heurDepart"
            header="Departure Time"
            sortable
            body={(rowData) => (
              <span>
                {new Date(rowData.heurDepart).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            )}
            style={{ minWidth: "20rem" }}
          ></Column>
          <Column
            field="aeroportDepart.name"
            header="Departure Airport"
            sortable
            body={(rowData) => <span>{rowData.aeroportDepart.name}</span>}
            style={{ minWidth: "20rem" }}
          ></Column>
          <Column
            field="aeroportArrive.name"
            header="Arrival Airport"
            sortable
            body={(rowData) => <span>{rowData.aeroportArrive.name}</span>}
            style={{ minWidth: "20rem" }}
          ></Column>
          <Column
            field="avionResponse.typeAvionDto.name"
            header="Airplane Type"
            sortable
            body={(rowData) => (
              <span>{rowData.avionResponse.typeAvionDto.name}</span>
            )}
            style={{ minWidth: "20rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={flightDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Flight Details"
        modal
        className="p-fluid"
        footer={flightDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="heurDepart" className="font-bold">
            Heure de départ
          </label>
          <Calendar
            id="heurDepart"
            value={flight.heurDepart}
            onChange={(e) =>
              onFlightInputChange({ target: { value: e.value } }, "heurDepart")
            }
            required
            timeOnly
            className={classNames({
              "p-invalid": submitted && !flight.heurDepart,
            })}
          />
          {submitted && !flight.heurDepart && (
            <small className="p-error">Heure de départ is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="nameAeroportDepart" className="font-bold">
            Aéroport de départ
          </label>

          <Dropdown
            id="nameAeroportDepart"
            value={flight.nameAeroportDepart}
            options={airportOptions.map((name) => ({
              value: name,
              label: name,
            }))}
            onChange={(e) => onFlightDropdownChange(e, "nameAeroportDepart")}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="nameAeroportArrive" className="font-bold">
            Aéroport d'arrivée
          </label>
          <Dropdown
            id="nameAeroportArrive"
            value={flight.nameAeroportArrive}
            options={airportOptions.map((name) => ({
              value: name,
              label: name,
            }))}
            onChange={(e) => onFlightDropdownChange(e, "nameAeroportArrive")}
            required
          />
        </div>

        <div className="field">
          <label className="mb-3 font-bold">Type d'avion</label>
          {airplaneTypeOptions.map((type, index) => (
            <div key={index} className="field-radiobutton col-6">
              <RadioButton
                id={`typeAvion_${index}`}
                name="typeAvion"
                value={type}
                onChange={(e) => onFlightInputChange(e, "typeAvion")}
                checked={flight.typeAvion === type}
                required
              />
              <label htmlFor={`typeAvion_${index}`}>{type}</label>
            </div>
          ))}
        </div>
      </Dialog>

      <Dialog
        visible={deleteFlightDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteFlightDialogFooter}
        onHide={hideDeleteFlightDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {flight && (
            <span>Are you sure you want to delete the selected flight?</span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteFlightsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteFlightsDialogFooter}
        onHide={hideDeleteFlightsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {flight && (
            <span>Are you sure you want to delete the selected flights?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
};
export default Flights;
