import React from "react";
import UserForm from "../../components/UserForm";
import { api } from "../../api";
import { useHistory } from "react-router";

export default () => {
  let history = useHistory();
  const handleSubmit = async (_id: string, name: string, email: string) => {
    try {
      const response = await api.post("/v1/users", { name, email });
      console.log(response.data);
      history.push("/");
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : error.message;
      alert(`Erro ao cadastrar: ${message}`);
    }
  };

  const handleCancel = () => {
    history.goBack();
  };
  return <UserForm onSubmit={handleSubmit} onCancel={handleCancel} />;
};
