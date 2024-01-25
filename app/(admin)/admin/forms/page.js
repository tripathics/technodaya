"use client";
import pageStyles from "../page.module.scss";
import formStyles from "@/components/form/Form.module.scss";
import {
  RadioInput,
  SelectInput,
  TextInput,
} from "@/components/form/InputComponents";
import SchemaForm from "@/components/form/schema-form";
import useFetchCollection from "@/hooks/fetchCollection";
import usePageAlerts from "@/hooks/pageAlerts";
import cx from "classnames";
import { useEffect, useState } from "react";

const EditForm = ({ FormTitle, setTitle }) => {

  const [Fields, setFields] = useState([]);
  const [Formview, setFormview] = useState(true)

  function formatString(inputString) {
    const words = inputString.split(' ');
  
    if (words.length === 1) {
      // If only one word, return the lowercase
      return words[0].toLowerCase();
    } else if (words.length >= 2) {
      // If more than one word, return camel case of the first two words
      const firstWord = words[0].toLowerCase();
      const secondWord = words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
  
      return `${firstWord}${secondWord}`;
    }
     return 'newName'
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [_, index] = name.match(/([a-zA-Z]+)(\d+)/).slice(1);
    const key=parseInt(index)
    if (name.startsWith("sectionHeading")) {
      const newFields = [...Fields];
      newFields[key]={
        ...newFields[key],
        ["label"]:value,
      }
      setFields(newFields)
    } else if(name.startsWith("text") || name.startsWith("number") || name.startsWith("date")){
      const newFields = [...Fields];
      newFields[key]={
        ...newFields[key],
        ["label"]:value,
        ["placeholder"]:value,
        ["name"]:formatString(value),
      }
      setFields(newFields);
    } else if(name.startsWith("radio")){
      const newFields = [...Fields];
      newFields[key]={
        ...newFields[key],
        ["required"]:value==="true"?true:false,
      }
      setFields(newFields);
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const op = [
    { label: "Text Input", value: "text" },
    { label: "Number Input", value: "number" },
    { label: "Date Input", value: "date" },
    { label: "Section Heading", value: "sectionHeading" },
  ];

  const SelectNew = (e) => {
    const { name, value } = e.target;
    if (value === "sectionHeading") {
      setFields((prev) => [...prev, { type: value, label: name }]);
    } else if (value === "text" || value==="number" || value==="date") {
      setFields((prev) => [...prev,{type: value,label: name,name: "",required: true,placeholder: "",}]);
    }
  };

  return (
    <form className={pageStyles.form}>
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
      {Formview ? <>
      {Fields.map((field, key) => {
        if (field.type === "sectionHeading")
          return (
            <TextInput
              key={key}
              placeholder={"Section Heading"}
              required={true}
              name={`sectionHeading${key}`}
              onChange={handleChange}
              value={field.label}
            />
          );
        if (field.type === "text" || field.type === "number" || field.type==="date") {
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
                radios={[{value:"true",label:"Mandatory"},{value:"false",label:"Not Mandatory"}]}
                label={"Mandatory"}
                onChange={handleChange}
                name={`radio${key}`}
              />
            </div>
          );
        }
      })}
      <SelectInput
        placeholder="Add New Field"
        onChange={SelectNew}
        options={op}
        value=""
      /></>:<SchemaForm Fields={Fields} />}
      <button
        className={pageStyles["form-btn"]}
        onClick={(e) => {
          e.preventDefault();
          setFormview((prev)=>(!prev));
        }}
      >
        PreView
      </button>
    </form>
  );
};

function page() {
  const [Form, setForm] = useState("");
  const [Formview, setFormview] = useState(true);
  const { add: addAlert } = usePageAlerts();
  const {
    docs: forms,
    setDocs: setForms,
    fetching: fetchingForms,
    error: formError,
  } = useFetchCollection("forms");

  useEffect(() => {
    if (!fetchingForms) {
      if (Object.keys(forms).length) addAlert("Form(s) available", "info");
      else addAlert("No forms available", "info");
    }
  }, [fetchingForms, forms]);

  useEffect(() => {
    if (formError) {
      addAlert("Error fetching forms: ", formError, "error");
    }
  }, [formError]);

  const handleChange = (e) => {
    const { value } = e.target;
    setForm(value);
  };
  const options = [
    {
      label: "Add a New Form",
      value: "New Form Title",
    },
    {
      label: "Existings",
      value: "Already",
    },
  ];
  return (
    <div className={pageStyles.page}>
      <header className={cx(pageStyles["page-header"], pageStyles.container)}>
        <h1 className={pageStyles.heading}>Add/Edit Forms</h1>
      </header>
      <main className={pageStyles.container}>
        {Formview ? (
          <form className={pageStyles.form}>
            <p className={cx(formStyles["section-heading"], "sub-label")}>
              Select A Form (For New Form Select Add Form)
            </p>
            <SelectInput
              placeholder="Select Form"
              required={true}
              name={"id"}
              onChange={handleChange}
              options={options}
              value={Form}
            />
            {Form && (
              <button
                onClick={() => setFormview(false)}
                className={pageStyles["form-btn"]}
              >
                Edit
              </button>
            )}
          </form>
        ) : (
          <EditForm FormTitle={Form} setTitle={setForm} />
        )}
      </main>
    </div>
  );
}

export default page;
