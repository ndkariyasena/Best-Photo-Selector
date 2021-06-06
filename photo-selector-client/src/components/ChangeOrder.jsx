/* cSpell:ignore fortawesome fontawesome vcenter */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';

import '../assets/styles/changeOrder.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  selectorWrapper: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
  }
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const ChangeOrder = (props) => {

  const [photoAlbum, setPhotoAlbum] = useState(props.photoList);

  const classes = useStyles();

  const handleClose = () => {
    props.onClose();
  };

  const handleSave = () => {
    props.updateExistingOrder(photoAlbum);
  };

  const handleChange = (event) => {
    const oldPosition = Number(event.target.name.split('_')[1]);
    const newPosition = Number(event.target.value);

    if( oldPosition !== newPosition ) {

      const _photoAlbum = [...photoAlbum];

      _photoAlbum.splice(newPosition, 0, _photoAlbum.splice(oldPosition, 1)[0]);

      setPhotoAlbum(_photoAlbum);

    }


  };

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Change order</DialogTitle>
        <DialogContent>

          <div className={classes.root}>
            <Grid container>
              {
                photoAlbum.map((item, index) => (
                  <Grid item xs={4} key={index}>
                    <div className="relative-position">
                      <FormControl className={'drop-down ' + classes.selectorWrapper}>
                        <Select
                          labelId="customized-select-label"
                          key={item.id}
                          id={`${item.id}_${index}`}
                          name={`${item.id}_${index}`}
                          value={index}
                          onChange={handleChange}
                          input={<BootstrapInput />}
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i, j) => (<MenuItem key={`${i}_${j}`} value={i}>{i + 1}</MenuItem>))}
                        </Select>
                      </FormControl>
                    </div>
                    <img src={item.picture} alt={'ooo'} className="image" />
                  </Grid>
                ))
              }
            </Grid>
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ChangeOrder.defaultProps = {
  selectedPhotos: [],
  photoList: [],
};

ChangeOrder.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateExistingOrder: PropTypes.func.isRequired,
  selectedPhotos: PropTypes.array.isRequired,
  photoList: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ChangeOrder;
