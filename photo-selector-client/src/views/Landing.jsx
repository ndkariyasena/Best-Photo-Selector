import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Loading from '../components/Loading';

export const Landing = (props) => {
  return ( !props.authUser || Object.keys(props.authUser).length === 0 ) ? <><Loading /></> : <>{props.children}</>;
};

Landing.propTypes = {
  authUser: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.instanceOf(React.Component), PropTypes.object]),
};

const mapStateToProps = (state) => ({
  authUser: state.PhotoRepo.author,
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
