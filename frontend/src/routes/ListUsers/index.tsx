import React, { useState, useEffect } from "react";

import { List, Container, Button, Icon, Confirm } from "semantic-ui-react";
import { api } from "../../api";
import { useHistory } from "react-router";

interface User {
  _id: string;
  name: string;
  email: string;
  friend: any;
}

const ListUsers: React.FC = (props) => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  
  const fetchData = async () => {
    const response = await api.get("/v1/users");
    console.log(response.data.items);
    setUsers(response.data.items);
  };

  useEffect(() => {
    
    fetchData();
  }, []);

  const handleNewUserClick = () => {
    history.push("/new-user");
  };

  const  handleDrawClick = async () => {
    try {
        const response: any = await api.get("/v1/users/draw");
        console.log(response.data.data);
        setUsers(response.data.data);
    } catch (error) {
        
    }
  }

  const handleEdit = (id: string) => () => {
    history.push(`/users/${id}/edit`);
  };

  const handleDelete = (user: User) => () => {
    setSelectedUser(user as any);
    setOpenConfirm(true);
  };
  const closeCancelDelete = () => setOpenConfirm(false);
  const closeConfirmDelete = async () => {
    try {
        const user = (selectedUser as any);
        await api.delete(`/v1/users/${user._id}`);
        setUsers(users.filter((u: User) => u._id !== user._id))
    } catch (error) {
        alert("Erro ao deletar usuário.");
    } finally {
        setSelectedUser(null);
        setOpenConfirm(false);
    }
  };

  return (
    <div>
      <Container>
        <Button primary icon onClick={handleNewUserClick}>
          <Icon name="add user" />
        </Button>
        <Button primary onClick={handleDrawClick}>
          Sortear
        </Button>
        <List divided verticalAlign="middle">
          {users.map((user: User) => (
            <List.Item key={user._id}>
              <List.Content>
                <List.Header>{user.name}</List.Header>
                {user.email}
              </List.Content>
              <List.Content floated="right">
                {user.friend ? (<Button  icon onClick={handleEdit(user._id)}>
                  <Icon name="eye" />
                </Button>) : null}
                <Button icon>
                  <Icon name="edit" />
                </Button>
                <Button color="red" icon onClick={handleDelete(user)}>
                  <Icon name="delete" />
                </Button>
                
              </List.Content>
            </List.Item>
          ))}
        </List>
        
        <Confirm
                    open={openConfirm}
                    content={`Deseja remover o usuário ${selectedUser ? (selectedUser as any).name : ""}?`}
                    onCancel={closeCancelDelete}
                    onConfirm={closeConfirmDelete}
                    />
      </Container>
    </div>
  );
};

export default ListUsers;
