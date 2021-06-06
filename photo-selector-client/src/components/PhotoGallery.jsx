import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
}));

const GRID_LIST = {
  'active': { cellHeight : 150, cols: 5 },
  'inactive': { cellHeight : 250, cols: 3 },
};

const ImageGridList = (props) => {
  const classes = useStyles();

  const handleClick = (event) => {
    if( props.handlePhotoSelect ) props.handlePhotoSelect(event);
  };

  return (
    <div className={classes.root}>
      <GridList cellHeight={ GRID_LIST[props.displayType].cellHeight } className={classes.gridList} cols={ GRID_LIST[props.displayType].cols }>
        {props.photoList.map((imageItem) => (
          <GridListTile key={imageItem.id} cols={imageItem.cols || 1}>
            { ( props.selection === 'single' && props.selectedPhotos.includes(imageItem.id) ) ? <span className={'selected-image-icon'}><FontAwesomeIcon icon={faCheckCircle} size="lg" /></span> : null}
            { ( props.selection === 'multiple' && props.selectedPhotos.includes(imageItem.id) ) ? <span className={'selected-image-number'}>{props.selectedPhotos.indexOf(imageItem.id) + 1}</span> : null}
            <img src={imageItem.picture} alt={imageItem.title} id={imageItem.id} onClick={handleClick} className={'full-height-images'} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

ImageGridList.defaultProps = {
  selection: 'multiple',
  displayType: 'active',
  photoList: [],
  selectedPhotos: [],
};

ImageGridList.propTypes = {
  displayType: PropTypes.string,
  handlePhotoSelect: PropTypes.func.isRequired,
  selectedPhotos: PropTypes.array.isRequired,
  photoList: PropTypes.array.isRequired,
  selection: PropTypes.string.isRequired,
};

export default ImageGridList;