import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackendUrl from "./BackendUrl";

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [expandedContractId, setExpandedContractId] = useState(null);
  const [filteredContract, setFilteredContract] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const handleFetchError = (error) => {
        if (error.response && error.response.status === 401) {
          alert("אין לך גישה, אנא התחבר");
          navigate("/login");
        } else {
          alert("An error occurred while fetching the data.");
        }
      };

      try {
        const response = await axios.get(`${BackendUrl()}/base/contracts/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("Authorization")).access,
          },
        });
        setContracts(response.data.contracts);
      } catch (error) {
        handleFetchError(error);
      }
    };

    fetchData();
  }, [navigate]);

  const toggleContract = (contractId) => {
    setExpandedContractId((prevId) =>
      prevId === contractId ? null : contractId
    );
  };

  const refreshContracts = async () => {
    try {
      const response = await axios.get(`${BackendUrl()}/base/contracts/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("Authorization")).access,
        },
      });
      setContracts(response.data.contracts);
    } catch (error) {
      console.error("Error refreshing contracts: ", error);
    }
  };

  const markPaymentAsPaid = async (contractId, paymentId) => {
    try {
      await axios.patch(
        `${BackendUrl()}/base/contracts/${contractId}/payments/${paymentId}/mark_as_paid/`,
        { didPayed: true }
      );
      refreshContracts();
    } catch (error) {
      console.error("Error marking payment as paid: ", error);
    }
  };

  const deleteContract = async (contractId) => {
    try {
      await axios.delete(`${BackendUrl()}/base/contracts/${contractId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("Authorization")).access,
        },
      });
      refreshContracts();
    } catch (error) {
      console.error("Error deleting contract: ", error);
    }
  };

  const filteredContracts = (e) => {
    let updatedContracts = [];
    contracts.forEach((contract) => {
      const text = contract.name || "";
      const customerName = contract.customerName || "";

      if (e === "" || text.includes(e) || customerName.includes(e)) {
        updatedContracts.push(contract);
      }
    });
    setFilteredContract(updatedContracts);
  };

  return (
    <div className="body_contracts">
      <h1>רשימת חוזים</h1>
      <br />
      <input
        style={{ width: "30%" }}
        type="text"
        placeholder="חיפוש לפי שם לקוח או כתובת"
        onChange={(e) => filteredContracts(e.target.value)}
      />

      {filteredContract !== null
        ? filteredContract
            .sort(
              (a, b) =>
                new Date(a.payments[0]?.date) - new Date(b.payments[0]?.date)
            )
            .map((contract) => (
              <div key={contract.id}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onClick={() => toggleContract(contract.id)}
                >
                  <button
                    className="btn_delete"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from propagating to the parent h3
                      deleteContract(contract.id);
                    }}
                  >
                    X
                  </button>
                  <span>{contract.name}</span>
                </h3>

                {expandedContractId === contract.id && (
                  <div>
                    <div className="details">
                      תאריך חתימה:{" "}
                      {new Date(contract.created).toISOString().split("T")[0]}
                    </div>
                    <div className="details">
                      שם לקוח: {contract.customerName}
                    </div>
                    <div className="details">
                      מספר טלפון: {contract.phoneNumber}
                    </div>
                    <div className="details">
                      מחיר הנכס: {Number(contract.amount).toLocaleString()} ₪
                    </div>
                    <div className="details">
                      סוג הנכס:{" "}
                      {contract.firstApt ? "דירה ראשונה" : "דירה שנייה"}
                    </div>
                    <h3 className="paymentHeadlineB">לוח תשלומים</h3>

                    {contract.payments
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((payment) => (
                        <div key={payment.id}>
                          {payment.name}
                          <br />
                          תאריך:{" "}
                          {new Date(payment.date).toLocaleDateString("en-GB")}
                          <br />
                          סכום: {Number(payment.amount).toLocaleString()} ₪
                          {payment.didPayed ? (
                            <div>
                              <span className="dot-green" title="Paid"></span>
                              שולם
                            </div>
                          ) : (
                            <button
                              className="btn_payed"
                              onClick={() =>
                                markPaymentAsPaid(contract.id, payment.id)
                              }
                            >
                              סמן כשולם
                            </button>
                          )}
                          <br />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
        : contracts
            .sort(
              (a, b) =>
                new Date(a.payments[0]?.date) - new Date(b.payments[0]?.date)
            )
            .map((contract) => (
              <div key={contract.id}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onClick={() => toggleContract(contract.id)}
                >
                  <button
                    className="btn_delete"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from propagating to the parent h3
                      deleteContract(contract.id);
                    }}
                  >
                    X
                  </button>
                  <span>{contract.name}</span>
                </h3>

                {expandedContractId === contract.id && (
                  <div>
                    <div className="details">
                      תאריך חתימה:{" "}
                      {new Date(contract.created).toISOString().split("T")[0]}
                    </div>
                    <div className="details">
                      שם לקוח: {contract.customerName}
                    </div>
                    <div className="details">
                      מספר טלפון: {contract.phoneNumber}
                    </div>
                    <div className="details">
                      מחיר הנכס: {Number(contract.amount).toLocaleString()} ₪
                    </div>
                    <div className="details">
                      סוג הנכס:{" "}
                      {contract.firstApt ? "דירה ראשונה" : "דירה שנייה"}
                    </div>
                    <h3 className="paymentHeadlineB">לוח תשלומים</h3>

                    {contract.payments
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((payment) => (
                        <div key={payment.id}>
                          {payment.name}
                          <br />
                          תאריך:{" "}
                          {new Date(payment.date).toLocaleDateString("en-GB")}
                          <br />
                          סכום: {Number(payment.amount).toLocaleString()} ₪
                          {payment.didPayed ? (
                            <div>
                              <span className="dot-green" title="Paid"></span>
                              שולם
                            </div>
                          ) : (
                            <button
                              className="btn_payed"
                              onClick={() =>
                                markPaymentAsPaid(contract.id, payment.id)
                              }
                            >
                              סמן כשולם
                            </button>
                          )}
                          <br />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
    </div>
  );
};

export default ContractList;
