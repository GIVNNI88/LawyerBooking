import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AddContract = ({ contracts }) => {
  const [numPayments, setNumPayments] = useState(2);
  const [amount, setAmount] = useState(0);
  const [text, setText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [payments, setPayments] = useState([]);
  const forms = [];
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(true);
  const rows = [];
  for (let i = 2; i < 36; i++) {
    rows.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  ////////////////////////////////////handling the taxes////////////////////////////////////////

  function calculatePurchaseTaxForFirstApt(purchaseValue) {
    const EXEMPTION_THRESHOLD = 1919155;
    const FIRST_TIER_THRESHOLD = 2276360;
    const SECOND_TIER_THRESHOLD = 5872725;
    const FIRST_TIER_RATE = 0.035;
    const SECOND_TIER_RATE = 0.05;

    if (purchaseValue <= EXEMPTION_THRESHOLD) {
      return 0;
    } else if (purchaseValue <= FIRST_TIER_THRESHOLD) {
      return (purchaseValue - EXEMPTION_THRESHOLD) * FIRST_TIER_RATE;
    } else if (purchaseValue <= SECOND_TIER_THRESHOLD) {
      return (purchaseValue - FIRST_TIER_THRESHOLD) * SECOND_TIER_RATE;
    } else {
      const firstTierTax =
        (FIRST_TIER_THRESHOLD - EXEMPTION_THRESHOLD) * FIRST_TIER_RATE;
      const secondTierTax =
        (SECOND_TIER_THRESHOLD - FIRST_TIER_THRESHOLD) * SECOND_TIER_RATE;
      const remainingValue = purchaseValue - SECOND_TIER_THRESHOLD;
      return firstTierTax + secondTierTax + remainingValue * SECOND_TIER_RATE;
    }
  }

  function calculatePurchaseTaxForSecondApt(purchaseValue) {
    const SECOND_APT_THRESHOLD = 5872725;
    const FIRST_TIER_RATE = 0.08;
    const SECOND_TIER_RATE = 0.1;

    if (purchaseValue <= SECOND_APT_THRESHOLD) {
      return purchaseValue * FIRST_TIER_RATE;
    } else {
      const firstTierTax = SECOND_APT_THRESHOLD * FIRST_TIER_RATE;
      const remainingValue = purchaseValue - SECOND_APT_THRESHOLD;
      return firstTierTax + remainingValue * SECOND_TIER_RATE;
    }
  }

  function calculateDateAfter30Days() {
    const today = new Date(); // Get the current date
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days

    // Format the date as needed (e.g., YYYY-MM-DD)
    const formattedDate = `${next30Days.getFullYear()}-${(
      next30Days.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${next30Days.getDate().toString().padStart(2, "0")}`;

    return formattedDate;
  }

  useEffect(() => {
    const fetchData = async () => {
      const handleFetchError = (error) => {
        if (error.response && error.response.status === 401) {
          alert("אין לך גישה, אנא התחבר");
          navigate("/login");
        } else {
          alert("אין לך גישה, אנא התחבר");
          navigate("/login");
        }
      };

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/base/contracts/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " +
                JSON.parse(localStorage.getItem("Authorization")).access,
            },
          }
        );
      } catch (error) {
        handleFetchError(error);
      }
    };

    fetchData();
  }, [navigate]);

  const handlTaxPayment = () => {
    const taxDate = calculateDateAfter30Days();
    let taxAmount = amount;
    if (selectedOption) {
      taxAmount = calculatePurchaseTaxForFirstApt(taxAmount);
    } else {
      taxAmount = calculatePurchaseTaxForSecondApt(taxAmount);
    }
    const payment = {
      name: "מס רכישה",
      amount: taxAmount,
      date: taxDate,
    };
    return payment;
  };

  /////////////////////////////////handle the payments form values//////////////////////////////////////////

  const handlePaymentChange = (index, field, value) => {
    const updatedPayments = [...payments];
    if (!updatedPayments[index]) {
      updatedPayments[index] = {};
    }
    updatedPayments[index][field] = value;
    setPayments(updatedPayments);
  };

  const handlePaymentName = () => {
    for (let i = 0; i < payments.length; i++) {
      if (i === 0) {
        payments[i].name = "מס רכישה";
      } else {
        payments[i].name = `תשלום ${i}`;
      }
    }
    console.log("finished");
  };

  const getUserLocalStorage = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    return user;
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value === "firstApt");
  };

  const handleNumPaymentChange = (event) => {
    let num_of_Payments = parseInt(event.target.value);
    setNumPayments(num_of_Payments);
  };
  if (handlTaxPayment() === 0) {
    payments[0] = handlTaxPayment();
  }
  for (let i = 0; i < numPayments; i++) {
    forms.push(
      <div key={i}>
        <h3>{payments[i]?.name || `תשלום ${i}`}</h3>
        <div>
          <label htmlFor={`amount${i}`}>סכום לתשלום </label>
          <input
            type="number"
            value={payments[i]?.amount || ""}
            onChange={(e) => handlePaymentChange(i, "amount", e.target.value)}
            placeholder="אנא הכנס סכום לתשלום"
          />
        </div>
        <br />
        {i !== 0 || amount === 0 ? (
          <div>
            <label htmlFor={`date${i}`}>אנא בחר תאריך לתשלום</label>
            <input
              type="date"
              value={payments[i]?.date || ""}
              onChange={(e) => handlePaymentChange(i, "date", e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label>מס רכישה נחשב תשלום</label>
            <input
              type="date"
              value={payments[i]?.date || ""}
              onChange={(e) => handlePaymentChange(i, "date", e.target.value)}
            />
          </div>
        )}
      </div>
    );
  }

  //////////////////////////////create the event in google calendar////////////////////////////////////////////

  const createEvent = (paymentName, dateTime, amount, text, customerName) => {
    let user = getUserLocalStorage();
    let startDate = new Date(dateTime).toISOString().split("T")[0];
    let desData = `
    תזכורת לתלשום<br>
    <u>כתובת הנכס:</u> ${text}<br>
    <u>שם לקוח:</u> ${customerName}<br>
    <u>טלפון:</u> ${phoneNumber}<br>
    <u>סכום לתשלום:</u>  ${Number(amount).toLocaleString()} ₪ ${paymentName}<br>
    
  `;

    let data = {
      summary: `שם הנכס ${text}`,
      location: "",
      description: desData,
      start: {
        date: startDate,
      },
      end: {
        date: startDate,
      },
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: "popup",
            minutes: 60,
          },
        ],
      },
    };

    axios
      .post(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  /////////////////////////////////add contract to database/////////////////////////////////////

  function addContract(e) {
    let user = getUserLocalStorage();
    let totalAmount = 0;
    let isEmptyDatePresent = false;
    for (let i = 1; i < payments.length; i++) {
      totalAmount += parseInt(payments[i].amount);
    }
    payments.forEach((payment) => {
      if (!payment.date) {
        isEmptyDatePresent = true;
      }
    });

    if (
      text === "" ||
      amount === 0 ||
      isEmptyDatePresent ||
      phoneNumber === ""
    ) {
      setSuccessMessage("אנא מלא את כל הפרטים"); // Set success message
      setTimeout(() => {
        setSuccessMessage(""); // Clear success message after 3 seconds
      }, 3000);
    } else if (amount - totalAmount < 0 || amount - totalAmount !== 0) {
      setSuccessMessage("סכום התשלומים צריך להיות זהה לסכום החוזה"); // Set success message
      setTimeout(() => {
        setSuccessMessage(""); // Clear success message after 3 seconds
      }, 3000);
    } else if (user === null) {
      setSuccessMessage("אנא התחבר לגוגל"); // Set success message
      setTimeout(() => {
        setSuccessMessage(""); // Clear success message after 3 seconds
      }, 3000);
    } else {
      handlePaymentName();
      payments.forEach((payment) => {
        createEvent(
          payment.name,
          payment.date,
          payment.amount,
          text,
          customerName
        );
      });
      axios
        .post(
          "https://lawbooking.site:8000/base/contracts/",
          {
            text: text,
            customerName: customerName,
            amount: amount,
            firstApt: selectedOption,
            phoneNumber: phoneNumber,
            payments,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " +
                JSON.parse(localStorage.getItem("Authorization")).access,
            },
          }
        )
        .then(() => {
          setSuccessMessage("חוזה נוסף בהצלחה"); // Set success message
          setTimeout(() => {
            setSuccessMessage("");
            navigate("/contracts");
          }, 1000);
        })
        .catch((error) => {
          console.error("Error adding contract: ", error);
        });
    }
  }

  return (
    <>
      <div className="container">
        <h3>הכנס חוזה חדש</h3>
        <div>
          <label htmlFor="text">שם הלקוח:</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(a) => setCustomerName(a.target.value)}
            placeholder="שם לקוח.."
          />
        </div>

        <div>
          <label htmlFor="text">מספר טלפון:</label>
          <input
            id="phoneNumber"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="הזן מספר טלפון.."
          />
        </div>

        <div>
          <label htmlFor="text">כתובת הנכס:</label>
          <input
            id="name"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="כתובת.."
          />
        </div>

        <div>
          <label htmlFor="amount">מחיר הנכס:</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(a) => setAmount(a.target.value)}
            placeholder="מחיר.."
          />
        </div>

        <div>
          <h3>סוג הנכס:</h3>
          <div>
            <select
              value={selectedOption ? "firstApt" : "secondApt"}
              onChange={handleOptionChange}
            >
              <option value="firstApt">דירה ראשונה</option>
              <option value="secondApt">דירה שנייה</option>
            </select>
          </div>
        </div>

        <div className="number-selector">
          <h3>בחר כמות תשלומים (כולל מס רכישה)</h3>
          <select value={numPayments} onChange={handleNumPaymentChange}>
            {rows}
          </select>
        </div>

        {forms}
        <br />
        <button className="btn_income" onClick={addContract}>
          אישור
        </button>

        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AddContract;
