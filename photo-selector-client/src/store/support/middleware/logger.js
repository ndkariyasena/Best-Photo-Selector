const logger = store => next => action => {

  let result = null;

  if( !action.type || action.type === undefined ) {
    console.log(' Updating ... ');
  
    result = next(action);

  } else {

    console.log('/** Logger **/');

    console.group(action.type);
    console.info('dispatching', action);
  
    result = next(action);
  
    console.log('next state', store.getState());
    console.groupEnd();
  
    console.log('/** ------ **/');
    console.log();

  }

  return result;
};

export default logger;