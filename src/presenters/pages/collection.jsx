import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import ProjectModel from '../../models/project';

import Loader, {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import Categories from '../categories.jsx';

import EditableField from '../includes/editable-field.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import CollectionEditor from '../collection-editor.jsx';

import PopoverContainer from '../pop-overs/popover-container.jsx';
import AddCollectionProject from '../includes/add-collection-project.jsx';
import AddCollectionAvatar from '../includes/add-collection-avatar.jsx';

import EditCollectionColor from '../includes/edit-collection-color.jsx';

import {avatars} from '../../models/collection.js'; 

import {CurrentUserConsumer} from '../current-user.jsx';

// some dummy info for testing - to be eventually removed as name generation happens outside of collection page
let adjectives = [
  'charming',
  'bold',
  'brave',
  'cool',
  'docile',
  'dope',
  'faithful',
  'fertile',
  'fervent',
  'forgiving',
  'genial',
  'genteel',
  'grouchy',
  'hopeful',
  'humane',
  'jolly',
  'joyful',
  'loving',
  'magical',
  'moral',
  'mysterious',
  'notorious',
  'passionate',
  'preposterous',
  'quaint',
  'quirky',
  'scrumptious',
  'sensitive',
  'sober',
  'tropical',
  'woeful',
  'whimsical',
  'zealous',
];

let name = "Wondrous Collection";
const url = "wondrous";
const avatarUrl = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg?1489265199230"; // to be replaced
let color = "#FFA3BB";
let description = "A collection of projects that does wondrous things.";
const id = 14;

const randomName = () => {
  let randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  let randomName = randomAdjective.charAt(0).toUpperCase() + randomAdjective.slice(1); // capitalize first letter
  name = `${randomName} Collection`;
  description = `A collection of projects that does ${randomAdjective} things`;
};

class CollectionColorWrap extends React.Component { 
  constructor(props){
    super(props);
    
    if(this.props.collection){
      color= this.props.collection.color;
    }
    this.state = {
      color: color,
      avatar: (this.props.collection ? this.props.collection.avatarUrl : avatarUrl),
    };
    this.setColor = this.setColor.bind(this);
    this.setAvatar = this.setAvatar.bind(this);
  }
  
  // static getDerivedStateFromProps(props, state) {
  //   // Any time the current user changes,
  //   // Reset any parts of state that are tied to that user.
  //   // In this simple example, that's just the email.
  //   if (props.collection.color !== this.props.color) {
  //     return {
  //       color: props.collection.color
  //     };
  //   }
  //   return null;
  // }
  
  setAvatar(newAvatar){
    this.setState({
      avatar: newAvatar
    });
    console.log(`newAvatar: ${newAvatar}`);
  }
  
  setColor(newColor){
    this.setState({
      color: newColor
    });
    console.log(`newColor: ${newColor}`);
  }
  
  render(){
    return this.props.children(this.state.color, this.setColor, this.state.avatar, this.setAvatar);
  }
}

const hexToRgbA = (hex) => {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.4)';
  }
  throw new Error('Bad Hex');
};

{/*
const CollectionPageEditor = ({api, initialCollection, children}) => (
  <CollectionEditor api={api} initialCollection={initialCollection}>
    {(collection, funcs, ...args) =>{
      <ProjectsLoader api={api} projects={collection.projects}>
          {(projects, reloadProjects) => {
          return children({...collection, projects}, {
            ...funcs,
          }, ...args);
          }}
           )}
     </ProjectsLoader>
    }};
  </CollectionEditor>
  );
*/}

const CollectionPageWrap = ({collection, api, color, setColor, avatar, setAvatar, isAuthorized, updateName, updateDescription, projectOptions, uploadAvatar, addProject, removeProject, ...props}) => (
  <React.Fragment>
    
    <Helmet>
      <title>{(collection ? collection.name : name)}</title>
    </Helmet>
    <main className="collection-page">
      <article className="projects" style={{backgroundColor: hexToRgbA(color)}}>
        <header className="collection">
          <h1 className="collection-name">
            {/* TO DO: actually update name */}
            {(isAuthorized 
              ? <AuthDescription authorized={isAuthorized}
                description={(collection ? collection.name : name)} 
                update={updateName => null} 
                placeholder="Name your collection"/> 
              : <React.Fragment>{collection.name} </React.Fragment>
            )}
          </h1>
          <div className="collection-image-container">
            <img src={avatar} alt=""/>
          </div>
          {/* TO DO: actually enable uploading avatar - see example of uploadAvatar in user-editor.jsx */}
          {isAuthorized 
            ? <div className="upload-image-buttons">
              
              <AddCollectionAvatar
                api={api}
                collectionID = {(collection ? collection.id : id)}
                setAvatar={setAvatar}
              />
              
              {/*
                <button className="button button-small button-tertiary" onClick={uploadAvatar}>
                  <span>Replace Avatar</span>  
                </button>
              */}
              
            </div>
            : null
          }
          
          <p className="description">
            {/* TO DO: actually update description */}
            <AuthDescription
              authorized={isAuthorized} description={(collection ? collection.description : description)}
              update={updateDescription => null} placeholder="Tell us about your collection"
            />
          </p>
          
          
          <EditCollectionColor
            api={api}
            collectionID={(collection ? collection.id : id)}
            currentUserIsOwner={true}
            setColor={setColor}
          />
          
          {(isAuthorized
            ? <button className={`button delete-collection button-tertiary`} >
              Delete Collection
            </button>
            : null
          )}
          
        </header>
        
        {collection
          ? <ProjectsLoader api={api} projects={collection.projects}>
            {projects => 
              <React.Fragment>
                <div className="collection-contents">
                  <div className="collection-project-container-header">
                    <h3>Projects ({collection.projects.length})</h3>
                
                    {(isAuthorized 
                      ? <AddCollectionProject
                        addProject={addProject}
                        api={api}
                        collectionProjects={collection.projects}
                        currentUserIsOwner={true}
                      />
                      : null
                    )}
                
                  </div>
          
                  <ProjectsUL projects={projects} categoryColor={color} 
                    projectOptions={{
                      removeProjectFromCollection: removeProject,
                      addProjectToCollection: {addProject}
                    }} 
                    {...props}/>
                </div>
          
              </React.Fragment>
            }
          </ProjectsLoader>
        
          : 
          <React.Fragment>
            <div className="collection-project-container-header">
              <h3>Projects</h3>
                
              {(isAuthorized 
                ? <AddCollectionProject
                  api={api}
                  collectionProjects={null}
                  currentUserIsOwner={true}
                  myProjects= {[]}
                />
                : null
              )}
              <div className="empty-collection-hint" style={{backgroundColor: color}}>
                Click <b>Add Project</b> to search for projects to add to your collection.<br/><br/>You can add any project, created by any user.
              </div>
                
            </div>
          
          </React.Fragment>
        }
        
      </article>
      
    </main>
    <Categories/>
  </React.Fragment>
);

CollectionPageWrap.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
  }).isRequired,
  addProject: PropTypes.func.isRequired,
  addProjectToCollection: PropTypes.func,
  api: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
  isAuthorized: PropTypes.any.isRequired,  
  projectOptions: PropTypes.object.isRequired,
  removeProject: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
};

const CollectionPageLoader = ({...props}) => (
  <Loader/>
);

const CollectionPageError = ({...props}) => (
  "Something went wrong. Try refreshing?"  
);

async function loadCategory(api, id) {
  const {data} = await api.get(`categories/${id}`);
  if(data){
    data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  }
  
  // TO DO: put this in the collection creation
  // set random name stuff
  randomName();
  return data;
}

async function loadCollection(api, id){
  const {data} = await api.get(`collections/${id}`);
  if(data){
    data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  }
  return data;
}
  

const CollectionPage = ({api, collection, addProject, removeProject, ...props}) => (
  <Layout api={api}>
    <DataLoader
      get={() => loadCollection(api, collection.id)}
      renderLoader={() => <CollectionPageLoader collection={collection} api={api} {...props}/>}
      renderError={() => <CollectionPageError collection={collection} api={api} {...props}/>}
    >
      {collection => (
        <CollectionColorWrap collection={collection}>
          {(color, setColor, avatar, setAvatar) => <CollectionPageWrap collection={collection} setColor={setColor} color={color} setAvatar={setAvatar} avatar={avatar} api={api} isAuthorized={true} addProject={addProject} removeProject={removeProject} {...props}/>}
        </CollectionColorWrap>
      )}
    </DataLoader>
  </Layout>
);

CollectionPage.propTypes = {
  api: PropTypes.any.isRequired,
  collection: PropTypes.object.isRequired,
  addProject: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
};

export default CollectionPage;