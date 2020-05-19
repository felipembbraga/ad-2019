import React, { useEffect, useState } from "react";
import UserForm from "../../components/UserForm";
import { api } from "../../api";
import { useHistory, useParams } from "react-router";

export default () => {
  let history = useHistory();
  let params: any = useParams();
  let [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/v1/users/${params.id}`);
        setUser(response.data);
      } catch (error) {
        alert("usuário não encontrado.");
        setTimeout(() => history.goBack(), 3000);
      }
    };
    fetchData();
  }, [history, params.id]);

  const handleSubmit = async (_id: string, name: string, email: string) => {
    try {
      await api.put(`/v1/users/${params.id}`, { name, email });
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

  return <UserForm user={user} onSubmit={handleSubmit} onCancel={handleCancel} />;
};
