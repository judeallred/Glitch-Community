import React from 'react';
import PropTypes from 'prop-types';

import Notifications from '../notifications.jsx';

const AddProjectMessage = (projectName, collectionName) => (
  <React.Fragment>
    <p>Added <b><span className="project-name">ProjectName</span></b> to collection <b><span className="collection-name">CollectionName</span></b></p>
    <a href="#" target="_blank" className="button button-small button-tertiary button-in-notification-container notify-collection-link">Take me there</a>
  </React.Fragment>
);
AddProjectMessage.propTypes = {
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired
};

class AddProjectToCollection extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ...props
    }
  }
  componentDidMount() {
    const content = AddProjectMessage(this.props.projectName, this.props.collectionName);
    this.notification = this.props.createPersistentNotification(content);
  }
  
  componentWillUnmount() {
    this.notification.removeNotification();
  }
  
  render() {
    return null;
  }
}
AddProjectToCollection.propTypes = {
  createPersistentNotification: PropTypes.func.isRequired,
  projectName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired
};

const AddProjectToCollectionContainer = () => (
  <Notifications>
    {notifyFuncs => (
      <AddProjectToCollection {...notifyFuncs}/>
    )}
  </Notifications>
);

export default AddProjectToCollectionContainer;