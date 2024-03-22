"use client";
import pageStyles from "../page.module.scss";
import formStyles from "@/components/form/Form.module.scss";
import styles from "./page.module.scss";
import {
  RadioInput,
  SelectInput,
  TextInput,
} from "@/components/form/InputComponents";
import SchemaForm from "@/components/form/schema-form";
import DeleteIcon from "@/components/icons/delete-icon";
import usePageAlerts from "@/hooks/pageAlerts";
import cx from "classnames";
import { useState } from "react";
import NavigateBeforeIcon from "@/components/icons/navigate-before-icon";
import NavigateNextIcon from "@/components/icons/navigate-next-icon";
import SaveIcon from "@/components/icons/save-icon";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebasse.config";
import SpinnerIcon from "@/components/icons/spinner-icon";
import ArrowIcon from "@/components/icons/arrow-icon";
import MdInput from "@/components/MdInput";

const EditForm = ({
  FormTitle,
  setTitle,
  Fields,
  setFields,
  Preview,
  setPreview,
}) => {
  const [Formview, setFormview] = useState(true);

  function formatString(inputString) {
    const words = inputString.split(" ");

    if (words.length === 1) {
      // If only one word, return the lowercase
      return words[0].toLowerCase();
    } else if (words.length >= 2) {
      // If more than one word, format each word after the first one
      const formattedWords = words.map((word, index) => {
        // Capitalize the first letter of each word after the first one
        if (index === 0) {
          return word.toLowerCase();
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      });

      return formattedWords.join("");
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

  const handlePreview = (e) => {
    setPreview(e.target.value);
  };

  return (
    <form
      className={cx("draft-form", formStyles.form, pageStyles.form)}
      id="editForm"
    >
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
                <div className={styles["field-wrapper"]}>
                  <div className={styles["input-wrapper"]}>
                    <TextInput
                      key={key}
                      placeholder={"Section Heading"}
                      required={true}
                      name={`sectionHeading${key}`}
                      onChange={handleChange}
                      value={field.label}
                    />
                  </div>
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
                <div key={key} className={styles["field-wrapper"]}>
                  <div className={styles["input-wrapper"]}>
                    <TextInput
                      placeholder={`${
                        field.type.charAt(0).toUpperCase() +
                        field.type.slice(1).toLowerCase()
                      } Input Name`}
                      required={true}
                      name={`${field.type}${key}`}
                      onChange={handleChange}
                      value={field.label}
                    />
                  </div>
                  <div className={styles.checkbox}>
                    <label htmlFor="">Mandatory</label>
                    <input
                      id={`radio${key}`}
                      defaultChecked
                      type="checkbox"
                      onChange={handleChange}
                      name={`radio${key}`}
                    />
                  </div>
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
                  className={cx(pageStyles["sub-section-heading"], "sub-label")}
                >
                  Date Range
                </p>
              );
            }
          })}
          <TextInput
            placeholder={"Preview of Form"}
            required={true}
            value={Preview}
            onChange={handlePreview}
          />
          <SelectInput
            placeholder="Add New Field"
            onChange={selectField}
            options={op}
            value=""
          />
        </>
      ) : (
        <>
          <SchemaForm
            Fields={Fields}
            handleInputChange={dummy}
            addPerson={dummy}
            removePerson={dummy}
          />
          <MdInput
            placeholder="Your output will show here"
            value={Preview}
            updateVal={(_) => {}}
            editing={(_) => {}}
          />
        </>
      )}
      <button
        className={cx(pageStyles["btn-submit"], pageStyles.btn,styles.btn)}
        onClick={(e) => {
          e.preventDefault();
          console.log(Fields);
          setFormview((prev) => !prev);
        }}
        type="submit"
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
  const [preview, setPreview] = useState("");
  const { add: addAlert } = usePageAlerts();
  // const {
  //   docs: forms,
  //   fetching: fetchingForms,
  //   error: formError,
  // } = useFetchCollection("activity-forms");

  /*  the code below is used in editing a existing form which functionality is on hold right now  */

  // const [newOption, setNewOption] = useState();

  // useEffect(() => {
  //   if (!fetchingForms) {
  //     if (Object.keys(forms).length) {
  //       addAlert("Form(s) available", "info");
  //       const labels = Object.keys(forms);
  //       let addingOptions = labels.map((form) => {
  //         return {
  //           label: form,
  //           value: form,
  //         };
  //       });
  //       setNewOption([...addingOptions]);
  //     } else addAlert("No forms available", "info");
  //   }
  // }, [fetchingForms, forms]);
  // const handleChange = (e) => {
  //   const { value } = e.target;
  //   if (value !== "New Form" && forms) {
  //     setFields(forms[value]["fields"]);
  //   } else {
  //     setFields([]);
  //   }
  //   setForm(value);
  // };
  // useEffect(() => {
  //   if (formError) {
  //     addAlert("Error fetching forms: ", formError, "error");
  //   }
  // }, [formError]);

  const handelForm = async (e) => {
    if (document.getElementById("editForm").checkValidity()) {
      e.preventDefault();
      setloading(true);
      const publishForm = {
        fields: Fields,
        name: Form,
        preview: preview,
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
    }
  };
  return (
    <div className={pageStyles.page}>
      <header className={cx(pageStyles["page-header"], pageStyles.container)}>
        <h1 className={pageStyles.heading}>Add/Edit Forms</h1>
        <div className={pageStyles["btns-group"]}>
          {Formview ? (
            <button
              className={pageStyles.btn}
              onClick={(e) => {
                if (document.getElementById("activityForm").checkValidity()) {
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
            {/* <p className={cx(formStyles["section-heading"], "sub-label")}>
                  Select A Current Form
                </p>
                <SelectInput
                  placeholder="Select Form"
                  required={true}
                  onChange={handleChange}
                  options={newOption}
                  value={Form || ""}
                /> */}{" "}
            {/* this commented portion above is section for admin to select an edit a existing form. */}
            <p className={cx(formStyles["form-header"], "sub-label")}>
              <span className={pageStyles["section-heading"]}>
                {" "}
                Add a New Form
              </span>
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                setForm("New Form");
                setFields([]);
                setFormview(false);
              }}
              className={cx(pageStyles.btn)}
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
            Preview={preview}
            setPreview={setPreview}
          />
        )}
      </main>
    </div>
  );
}
