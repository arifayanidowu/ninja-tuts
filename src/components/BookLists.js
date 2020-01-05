import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_BOOKS, DELETE_BOOK } from "../queries";
import { makeStyles } from "@material-ui/styles";
import BookDetails from "./BookDetails";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(8),

    flexGrow: 1
  },
  flex: {
    width: "100%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    }
  },
  list: {
    backgroundColor: theme.palette.background.paper
  }
}));

export default function BookLists() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK);

  const [selected, setSelected] = useState(null);

  if (error) {
    return <p>Failed to fetch data</p>;
  }

  const handleSelected = id => {
    setSelected(id);
  };

  const handleDeleteBook = id => {
    deleteBook({
      variables: {
        id
      },
      refetchQueries: [{ query: GET_BOOKS }]
    });
  };

  return (
    <div className={classes.flex}>
      <div className={classes.root}>
        <Typography variant="subtitle1" component="p">
          Ninja's reading list
        </Typography>
        <List className={classes.list}>
          {loading ? (
            <ListItem>
              <ListItemText primary="Loading..." />
            </ListItem>
          ) : data.books.length > 0 ? (
            data.books.map(({ id, name }) => (
              <ListItem key={id} onClick={() => handleSelected(id)} button>
                <ListItemText primary={name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteBook(id)}
                    color="secondary"
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="You currently have no books" />
            </ListItem>
          )}
        </List>
      </div>
      <BookDetails bookId={selected} />
    </div>
  );
}
