import React, { useEffect } from 'react';
import './App.css';
//import useSocket from 'use-socket.io-client';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import { useEffectOnce } from 'react-use';
import io from 'socket.io-client';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    margin: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));

function App() {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    author: "",
    text: ""
  });
  const socket = io('http://localhost:8080', { forceNew: true });

  useEffect(() => {
    socket.on('connect', () => {
      console.log("alguien se a conectado")
    });
    socket.on('messages', (message) => {
      setValues({ text: message.body })
      //console.log(message)
    });
    socket.on('disconnect', () => { console.log("alguien se a disconnect") });

  }, []);
  useEffectOnce(() => {

  });

  function handleSubmit(event) {
    event.preventDefault();
    const body = event.target.value
    if (event.keyCode === 13 && body) {
      //setValues({ text: event.target.value })
      socket.emit('new-message', event.target.value);
      event.target.value = ''
    }
  }

  return (
    <div>
      {values.text}

      <Input
        id="text"
        label="text"
        className={classes.input}
        onKeyUp={handleSubmit.bind(this)}
        margin="normal"
      />

    </div>

  );
}

export default App;
