import React, { useState, useEffect, ChangeEvent } from "react";
import { Button, Form } from "semantic-ui-react";

export default (props: any) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (props.user) {
      setId(props.user._id);
      setName(props.user.name);
      setEmail(props.user.email);
    }
  }, [props.user]);

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (field) {
      case "id":
        setId(event.target.value);
        break;
      case "name":
        setName(event.target.value);
        break;
      case "email":
        setEmail(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleClick = () => {
      props.onSubmit && props.onSubmit(id, name, email);
  }

  const handleCancelClick = () => {
    props.onCancel && props.onCancel(id, name, email);
}

  return (
    <Form>
      <Form.Field>
        <label>Nome</label>
        <input
          placeholder="Seu nome"
          value={name}
          onChange={handleChange("name")}
        />
      </Form.Field>
      <Form.Field>
        <label>Email</label>
        <input
          placeholder="Seu email"
          value={email}
          onChange={handleChange("email")}
        />
      </Form.Field>
      <input type="hidden" value={id} onChange={handleChange("id")} />
      <Button secondary type="submit" onClick={handleCancelClick}>Cancelar</Button>
      <Button primary type="submit" onClick={handleClick}>Enviar</Button>
    </Form>
  );
};
