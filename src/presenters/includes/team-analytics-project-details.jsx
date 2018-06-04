import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';

import Loader from './loader.jsx';

const getProjectDetails = async ({id, api, currentProjectDomain}) => {
  let path = `analytics/${id}/project/${currentProjectDomain}/overview`;
  try {
    return await api().get(path);
  } catch (error) {
    console.error('getProjectDetails', error);
  }
}

const ProjectDetails = ({projectDetails}) => (
  <article className="project-details">
    <table>
      <tr>
        <td>Description</td>
        <td>{projectDetails.description}</td>
      </tr>
      <tr>
        <td>Created</td>
        <td>{projectDetails.createdAt}</td>
      </tr>
      <tr>
        <td>Last code view</td>
        <td>{projectDetails.lastAccess}</td>
      </tr>

      <tr>
        <td>Last edited</td>
        <td>{projectDetails.lastEditedAt}</td>
      </tr>
      <tr>
        <td>Last remixed</td>
        <td>{projectDetails.lastRemixedAt}</td>
      </tr>
      <tr>
        <td>Avatar</td>
        <td>https://cdn.glitch.com/project-avatar/${projectDetails.id}.png</td>
      </tr>
      <tr>
        <td>Total app views</td>
        <td>{projectDetails.description}</td>
      </tr>
      <tr>
        <td>Total code views</td>
        <td>{projectDetails.numUniqueEditorVisits}</td>
      </tr>
      <tr>
        <td>Total </td>
        <td>{projectDetails.description}</td>
      </tr>
      <tr>
        <td>Number of editors</td>
        <td>{projectDetails.numMembers}</td>
      </tr>
      <tr>
        <td>Description</td>
        <td>{projectDetails.description}</td>
      </tr>
      <tr>
        <td>Description</td>
        <td>{projectDetails.description}</td>
      </tr>
      <tr>
        <td>Description</td>
        <td>{projectDetails.description}</td>
      </tr>
      <tr>
        <td>Description</td>
        <td>{projectDetails.description}</td>
      </tr>
      <tr>
        <td>Description</td>
        <td>{projectDetails.description}</td>
      </tr>

      
      { (projectDetails.baseProject.domain) &&
        <tr>
          <td>Remixed from</td>
          <td>{projectDetails.baseProject.domain}</td>
        </tr>
      }

    </table>
  </article>
//   let details = {
//         // projectId: "",
//       // projectCreatedAt: "",
//       // projectDescription: "",
//       // projectAvatar: "", // https://cdn.glitch.com/project-avatar/${id}.png
//       // projectLastAccess: "",
//       // projectLastEdited: "",
//       // projectLastRemixed: "",
//       // projectTotalAppVisits: 0,
//       // projectTotalCodeVisits: 0,
//       // projectDirectRemixes: 0,
//       // projectTotalRemixes: 0,
//       // projectRemixes: [],

//   }
  
  // <p>{projectDetails.domain}</p>
)

const ProjectRemixes = ({projectRemixes}) => (
  <p>projectRemix item</p>
)

class TeamAnalyticsProjectDetails extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      isGettingData: true,
      projectDetails: {},
      projectRemixes: [],
      // projectId: "",
      // projectCreatedAt: "",
      // projectDescription: "",
      // projectAvatar: "", // https://cdn.glitch.com/project-avatar/${id}.png
      // projectLastAccess: "",
      // projectLastEdited: "",
      // projectLastRemixed: "",
      // projectTotalAppVisits: 0,
      // projectTotalCodeVisits: 0,
      // projectDirectRemixes: 0,
      // projectTotalRemixes: 0,
      // projectRemixes: [],
    };
  }

  
  componentDidMount() {
    getProjectDetails(this.props).then(({data}) => {
      this.setState({
        isGettingData: false,
        projectDetails: data,
        projectRemixes: data.remixes
      }, () => {
        console.log ('update project details', data)
        // <ProjectDetails 
        // />
      });
    });
  }
  
  componentWillUpdate() {
    console.log ('🚗 getProjectOverview: componentWillUpdate')
    // this.setState({
    //   isGettingData: true,
    // }, () => {
    //   console.log('get data, update deets')
    // });
  }

  
  render() {
    return (
      <React.Fragment>
        { (this.state.isGettingData) &&
          <Loader />
        ||
          <React.Fragment>
            <ProjectDetails 
              projectDetails = {this.state.projectDetails}            
            />
            <p>iterate here</p>
            <ProjectRemixes 
              projectRemixes = {this.state.projectRemixes}            
            />            
          </React.Fragment>
        }
      </React.Fragment>
    )
  }
};

TeamAnalyticsProjectDetails.propTypes = {
  currentProjectDomain: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
};

export default TeamAnalyticsProjectDetails;
