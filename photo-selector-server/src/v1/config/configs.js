const ENV_CONFIGURATION = () => {
  try {
    const path = `${process.env.ENV_FILE_PATH}/${process.env.NODE_ENV}.json`;

    return require(path);
    
  } catch (err) {

    console.log(`\n********** ENVIRONMENT NOT FOUND **********
      \nPlease follow below step
      \n01. Create development.json, production,json and test.json in /config/env/ 
      \n02. Copy sample content below created all files.
      \n03. Change content\n`);

  }
};

module.exports = {
  ALLOWED_DOMAINS : ENV_CONFIGURATION().ALLOWED_DOMAINS
};