"use client";
import pageStyles from "../page.module.scss";
import formStyles from "@/components/form/Form.module.scss";
import {
  RadioInput,
  SelectInput,
  TextInput,
} from "@/components/form/InputComponents";
import SchemaForm from "@/components/form/schema-form";
import DeleteIcon from "@/components/icons/delete-icon";
import useFetchCollection from "@/hooks/fetchCollection";
import LoadingScreen from "@/components/loading-screen";
import usePageAlerts from "@/hooks/pageAlerts";
import cx from "classnames";
import { useEffect, useState } from "react";
import NavigateBeforeIcon from "@/components/icons/navigate-before-icon";
import NavigateNextIcon from "@/components/icons/navigate-next-icon";
import SaveIcon from "@/components/icons/save-icon";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebasse.config";
import SpinnerIcon from "@/components/icons/spinner-icon";
import ArrowIcon from "@/components/icons/arrow-icon";

const EditForm = ({ FormTitle, setTitle, Fields, setFields }) => {
  const [Formview, setFormview] = useState(true);

  function formatString(inputString) {
    const words = inputString.split(" ");

    if (words.length === 1) {
      // If only one word, return the lowercase
      return words[0].toLowerCase();
    } else if (words.length >= 2) {
      // If more than one word, return camel case of the first two words
      const firstWord = words[0].toLowerCase();
      const secondWord =
        words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();

      return `${firstWord}${secondWord}`;
    }
    return "newName";
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [_, index] = name.match(/([a-zA-Z]+)(\d+)/).slice(1);
    const key = parseInt(index);
    if (name.startsWith("sectionHeading")) {
      const newFields = [...Fields];
      newFields[key] = {
        ...newFields[key],
        ["label"]: value,
      };
      setFields(newFields);
    } else if (
      name.startsWith("text") ||
      name.startsWith("number") ||
      name.startsWith("date")
    ) {
      const newFields = [...Fields];
      newFields[key] = {
        ...newFields[key],
        ["label"]: value,
        ["placeholder"]: value,
        ["name"]: formatString(value),
      };
      setFields(newFields);
    } else if (name.startsWith("radio")) {
      const newFields = [...Fields];
      newFields[key] = {
        ...newFields[key],
        ["required"]: value === "true" ? true : false,
      };
      setFields(newFields);
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const op = [
    { label: "Section Heading", value: "sectionHeading" },
    { label: "Text Input", value: "text" },
    { label: "Number Input", value: "number" },
    { label: "Date Input", value: "date" },
    { label: "Date Range Input", value: "dateRange" },
  ];

  const selectField = (e) => {
    const { name, value } = e.target;
    if (value === "sectionHeading") {
      setFields((prev) => [...prev, { type: value, label: name }]);
    } else if (value === "text" || value === "number" || value === "date") {
      setFields((prev) => [
        ...prev,
        { type: value, label: name, name: "", required: true, placeholder: "" },
      ]);
    } else if (value === "dateRange") {
      setFields((prev) => [
        ...prev,
        {
          type: value,
          from: {
            type: "date",
            label: "Date",
            name: "date",
            placeholder: "",
            required: true,
          },
          to: { type: "date", label: "Date", name: "toDate", required: false },
        },
      ]);
    }
  };

  const deleteField = (e, key) => {
    e.preventDefault();
    const newFields = Fields.filter((_, index) => index !== key);
    setFields(newFields);
  };

  const dummy = (e) => {
    try {
      if (e) e.preventDefault();
      alert("This is only a preview not actual Form");
    } catch (error) {
      return;
    }
    return;
  };

  return (
    <form className={pageStyles.form} id="editForm">
      <div className={cx(formStyles["form-header"], pageStyles["form-header"])}>
        <input
          type="text"
          name="title"
          className={cx(
            formStyles["form-title"],
            pageStyles["form-title"],
            formStyles["form-control"]
          )}
          placeholder="Title of newsletter *"
          required={true}
          onChange={handleTitle}
          value={FormTitle || ""}
        />
      </div>
      {Formview ? (
        <>
          {Fields.map((field, key) => {
            if (field.type === "sectionHeading")
              return (
                <div>
                  <TextInput
                    key={key}
                    placeholder={"Section Heading"}
                    required={true}
                    name={`sectionHeading${key}`}
                    onChange={handleChange}
                    value={field.label}
                  />
                  <button
                    className={pageStyles.btn}
                    onClick={(e) => deleteField(e, key)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            else if (
              field.type === "text" ||
              field.type === "number" ||
              field.type === "date"
            ) {
              return (
                <div key={key}>
                  <TextInput
                    placeholder={`${field.type} Input Name`}
                    required={true}
                    name={`${field.type}${key}`}
                    onChange={handleChange}
                    value={field.label}
                  />
                  <RadioInput
                    radios={[
                      { value: "true", label: "Mandatory" },
                      { value: "false", label: "Not Mandatory" },
                    ]}
                    label={"Mandatory"}
                    onChange={handleChange}
                    name={`radio${key}`}
                  />
                  <button
                    className={pageStyles.btn}
                    onClick={(e) => deleteField(e, key)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            } else if (field.type === "dateRange") {
              return (
                <p
                  key={key}
                  className={cx(pageStyles["section-heading"], "sub-label")}
                >
                  Date Range
                </p>
              );
            }
          })}
          <SelectInput
            placeholder="Add New Field"
            onChange={selectField}
            options={op}
            value=""
          />
        </>
      ) : (
        <SchemaForm
          Fields={Fields}
          handleInputChange={dummy}
          addPerson={dummy}
          removePerson={dummy}
        />
      )}
      <button
        className={cx(pageStyles["btn-submit"], pageStyles.btn)}
        onClick={(e) => {
          e.preventDefault();
          setFormview((prev) => !prev);
        }}
      >
        {Formview ? (
          <span className={pageStyles["btn-text"]}>
            Preview
            <NavigateNextIcon />
          </span>
        ) : (
          <span className={pageStyles["btn-text"]}>
            Edit
            <NavigateBeforeIcon />
          </span>
        )}
      </button>
    </form>
  );
};

export default function Form() {
  const [Form, setForm] = useState(null);
  const [Fields, setFields] = useState([]);
  const [Formview, setFormview] = useState(true);
  const [loading, setloading] = useState(false);
  const { add: addAlert } = usePageAlerts();
  const {
    docs: forms,
    fetching: fetchingForms,
    error: formError,
  } = useFetchCollection("activity-forms");
  const [newOption, setNewOption] = useState();

  useEffect(() => {
    if (!fetchingForms) {
      if (Object.keys(forms).length) {
        addAlert("Form(s) available", "info");
        const labels = Object.keys(forms);
        let addingOptions = labels.map((form) => {
          return {
            label: form,
            value: form,
          };
        });
        setNewOption([...addingOptions]);
      } else addAlert("No forms available", "info");
    }
  }, [fetchingForms, forms]);

  useEffect(() => {
    if (formError) {
      addAlert("Error fetching forms: ", formError, "error");
    }
  }, [formError]);

  const handleChange = (e) => {
    const { value } = e.target;
    if (value !== "New Form" && forms) {
      setFields(forms[value]["fields"]);
    } else {
      setFields([]);
    }
    setForm(value);
  };

  const handelForm = async (e) => {
    e.preventDefault();
    setloading(true);
    const publishForm = {
      fields: Fields,
    };
    console.log(publishForm);

    const docRef = doc(db, "activity-forms", Form);
    try {
      await setDoc(docRef, publishForm);
      addAlert("Form Added Successfully", "success", 2000);
    } catch (error) {
      addAlert("Error, try after Sometime", "warning");
    } finally {
      setloading(false);
    }
  };
  return (
    <div>
      {fetchingForms ? (
        <LoadingScreen />
      ) : (
        <div className={pageStyles.page}>
          <header
            className={cx(pageStyles["page-header"], pageStyles.container)}
          >
            <h1 className={pageStyles.heading}>Add/Edit Forms</h1>
            <div className={pageStyles["btns-group"]}>
              {Formview ? (
                <button
                  className={pageStyles.btn}
                  onClick={(e) => {
                    if (
                      document.getElementById("activityForm").checkValidity()
                    ) {
                      e.preventDefault();
                      setFormview(false);
                    }
                  }}
                  type="submit"
                  form="activityForm"
                >
                  <span className={pageStyles["btn-text"]}>Next</span>
                  <NavigateNextIcon />
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    form="editForm"
                    onClick={handelForm}
                    disabled={loading}
                    className={cx(pageStyles.btn, pageStyles["btn-submit"])}
                  >
                    <span className={pageStyles["btn-text"]}>Save Form</span>
                    {loading ? <SpinnerIcon /> : <SaveIcon />}
                  </button>
                  <button
                    className={pageStyles.btn}
                    onClick={(e) => {
                      e.preventDefault();
                      setFormview(true);
                    }}
                  >
                    <span className={pageStyles["btn-text"]}>Back</span>
                    <NavigateBeforeIcon />
                  </button>
                </>
              )}
            </div>
          </header>
          <main className={pageStyles.container}>
            {Formview ? (
              <form className={pageStyles.form} id="activityForm">
                <p className={cx(formStyles["section-heading"], "sub-label")}>
                  Select A Current Form
                </p>
                <SelectInput
                  placeholder="Select Form"
                  required={true}
                  onChange={handleChange}
                  options={newOption}
                  value={Form || ""}
                />
                <p className={cx(formStyles["section-heading"])}>
                  Or Add a New Form
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setForm("New Form");
                    setFields([]);
                    setFormview(false);
                  }}
                  className={pageStyles.btn}
                >
                  <span className={pageStyles["btn-text"]}>New Form</span>
                  <ArrowIcon />
                </button>
              </form>
            ) : (
              <EditForm
                FormTitle={Form}
                setTitle={setForm}
                Fields={Fields}
                setFields={setFields}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
