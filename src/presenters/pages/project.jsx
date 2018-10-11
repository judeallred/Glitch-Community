/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Project, {getAvatarUrl} from '../../models/project';

import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {Markdown} from '../includes/markdown.jsx';
import ProjectEditor from '../project-editor.jsx';
import Expander from '../includes/expander.jsx';
import EditableField from '../includes/editable-field.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import {InfoContainer, ProjectInfoContainer} from '../includes/profile.jsx';
import {ShowButton, EditButton, RemixButton, ReportButton} from '../includes/project-actions.jsx';
import AddProjectToCollection from '../includes/add-project-to-collection.jsx';
import UsersList from '../users-list.jsx';
import RelatedProjects from '../includes/related-projects.jsx';

import {CurrentUserConsumer} from '../current-user.jsx';

import Layout from '../layout.jsx';

function trackRemix(id, domain) {
  analytics.track("Click Remix", {
    origin: "project page",
    baseProjectId: id,
    baseDomain: domain,
  });
}

function syncPageToDomain(domain) {
  history.replaceState(null, null, `/~${domain}`);
}

const PrivateTooltip = "Only members can view code";
const PublicTooltip = "Visible to everyone";

const PrivateBadge = () => (
  <span className="private-project-badge" aria-label={PrivateTooltip} data-tooltip={PrivateTooltip}></span>
);

const PrivateToggle = ({isPrivate, setPrivate}) => {
  const tooltip = isPrivate ? PrivateTooltip : PublicTooltip;
  const classBase = "button-tertiary button-on-secondary-background project-badge";
  const className = isPrivate ? 'private-project-badge' : 'public-project-badge';
  return (
    <span data-tooltip={tooltip}>
      <button aria-label={tooltip}
        onClick={() => setPrivate(!isPrivate)}
        className={`${classBase} ${className}`}
      />
    </span>
  );
};
PrivateToggle.propTypes = {
  isPrivate: PropTypes.bool.isRequired,
  setPrivate: PropTypes.func.isRequired,
};

const Embed = ({domain}) => (
  <div className="glitch-embed-wrap">
    <iframe title="embed" src={`https://glitch.com/embed/#!/embed/${domain}?path=README.md&previewSize=100`}></iframe>
  </div>
);
Embed.propTypes = {
  domain: PropTypes.string.isRequired,
};

const ReadmeError = (error) => (
  (error && error.response && error.response.status === 404)
    ? <React.Fragment>This project would be even better with a <code>README.md</code></React.Fragment>
    : <React.Fragment>We couldn't load the readme. Try refreshing?</React.Fragment>
);
const ReadmeLoader = ({api, domain}) => (
  <DataLoader get={() => api.get(`projects/${domain}/readme`)} renderError={ReadmeError}>
    {({data}) => <Expander height={200}><Markdown>{data}</Markdown></Expander>}
  </DataLoader>
);
ReadmeLoader.propTypes = {
  api: PropTypes.any.isRequired,
  domain: PropTypes.string.isRequired,
};

const ProjectPage = ({
  project: {
    description, domain, id, users, teams,
    ...project // 'private' can't be used as a variable name
  },
  api,
  currentUser,
  isAuthorized,
  updateDomain,
  updateDescription,
  updatePrivate,
}) => (
  <main className="project-page">
    <section id="info">
      <InfoContainer>
        <ProjectInfoContainer style={{backgroundImage: `url('${getAvatarUrl(id)}')`}}>
          <h1>
            {(isAuthorized
              ? <EditableField value={domain} update={domain => updateDomain(domain).then(() => syncPageToDomain(domain))} placeholder="Name your project"/>
              : <React.Fragment>{domain} {project.private && <PrivateBadge/>}</React.Fragment>
            )}
          </h1>
          {(isAuthorized &&
            <div>
              <PrivateToggle isPrivate={project.private} isMember={isAuthorized} setPrivate={updatePrivate}/>
            </div>
          )}
          <UsersList users={users} />
          <AuthDescription
            authorized={isAuthorized} description={description}
            update={updateDescription} placeholder="Tell us about your app"
          />
          <p className="buttons">
            <ShowButton name={domain}/>
            <EditButton name={domain} isMember={isAuthorized}/>
          </p>
        </ProjectInfoContainer>
      </InfoContainer>
    </section>
    <section id="embed">
      <Embed domain={domain}/>
      <div className="buttons buttons-right">
        <div>Project {project.domain}</div>
        {currentUser && <AddProjectToCollection className="button-small" api={api} project={project} fromProject={true}/>}
        <RemixButton className="button-small"
          name={domain} isMember={isAuthorized}
          onClick={() => trackRemix(id, domain)}
        />
      </div>
    </section>
    <section id="readme">
      <ReadmeLoader api={api} domain={domain}/>
    </section>
    <section id="related">
      <RelatedProjects ignoreProjectId={id} {...{api, teams, users}}/>
    </section>
    <section id="feedback" className="buttons buttons-right">
      <ReportButton name={domain} id={id} className="button-small button-tertiary"/>
    </section>
  </main>
);
ProjectPage.propTypes = {
  api: PropTypes.any.isRequired,
  currentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
};

async function getProject(api, domain) {
  const {data} = await api.get(`projects/${domain}`);
  return data ? Project(data).update(data).asProps() : null;
}

const ProjectPageLoader = ({domain, api, currentUser, ...props}) => (
  <DataLoader get={() => getProject(api, domain)} renderError={() => <NotFound name={domain}/>}>
    {project => project ? (
      <ProjectEditor api={api} initialProject={project}>
        {(project, funcs, userIsMember) => (
          <React.Fragment>
            <Helmet>
              <title>{project.domain}</title>
            </Helmet>
            <ProjectPage api={api} project={project} {...funcs} isAuthorized={userIsMember} currentUser={currentUser} {...props}/>
          </React.Fragment>
        )}
      </ProjectEditor>
    ) : <NotFound name={domain}/>}
  </DataLoader>
);
ProjectPageLoader.propTypes = {
  api: PropTypes.func.isRequired,
  domain: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const ProjectPageContainer = ({api, name}) => (
  <Layout api={api}>
    <CurrentUserConsumer>
      {currentUser => (
        <ProjectPageLoader api={api} domain={name} currentUser={currentUser}/>
      )}
    </CurrentUserConsumer>
  </Layout>
);

export default ProjectPageContainer;